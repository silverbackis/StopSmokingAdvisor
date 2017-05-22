<?php

namespace AppBundle\Course;

use AppBundle\Entity\Course;
use AppBundle\Entity\Session;
use Doctrine\ORM\EntityManager;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\EventDispatcher\GenericEvent;
use Symfony\Bundle\TwigBundle\TwigEngine;
use Symfony\Bundle\FrameworkBundle\Routing\Router;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class CourseReminderProvider {
    private $em;
    private $mailer;
    private $dates = [];
    private $mailer_user;
    private $mailer_sender_name;
    private $router;

    public function __construct(
        \Swift_Mailer $mailer,
        EntityManager $em,
        EventDispatcherInterface $dispatcher,
        TwigEngine $templating,
        string $mailer_user,
        string $mailer_sender_name,
        Router $router
    )
    {
        $this->mailer = $mailer;
        $this->em = $em;
        $this->dispatcher = $dispatcher;
        $this->templating = $templating;
        $this->mailer_user = $mailer_user;
        $this->mailer_sender_name = $mailer_sender_name;
        $this->router = $router;
        $this->dates['tomorrow'] = (new \DateTime())->setTime(0, 0, 0)->modify("+1 Day");
        $this->dates['today'] = (new \DateTime())->setTime(0, 0, 0);
        $this->dates['yesterday'] = (new \DateTime())->setTime(0, 0, 0)->modify("-1 Day");
    }

    public function sendReminders()
    {
        // http://stackoverflow.com/questions/2111384/sql-join-selecting-the-last-records-in-a-one-to-many-relationship
       
        /*
        THIS WORKS
        SELECT c.*, s1.id, s1.last_updated 
        FROM user_course c
          INNER JOIN user_session s1
            ON (c.id = s1.course_id)
          LEFT OUTER JOIN user_session s2
            ON (c.id = s2.course_id AND s1.id < s2.id)
        WHERE s2.id IS NULL;
         */

        //$this->writeln('<info>Querying database for courses needing reminders</info>');

        $this->dispatcher->dispatch(
            'reminder_emails.comment', 
            new GenericEvent('Querying database for courses needing reminders')
        );

        $qb = $this->em->createQueryBuilder('all');
        $qb
            ->select('c1')
            
            // Coursees linked to users with reminders enabled
            /*->from(
                'AppBundle:Course', 
                'c1'
            )

            ->join(
                'UserBundle:User',
                'u',
                'WITH',
                $qb->expr()->eq(
                    'u',
                    'c1.user'
                )
            )*/

            ->from(
                'UserBundle:User', 
                'u'
            )

            ->join(
                'AppBundle:Course', 
                'c1',
                'WITH',
                $qb->expr()->andX(
                    $qb->expr()->eq(
                        'c1.user',
                        'u'                    
                    ),
                    $qb->expr()->orX(
                        $qb->expr()->andX(
                            $qb->expr()->gte(
                                'c1.session_available',
                                ':ses_avail_lower_date'
                            ),
                            $qb->expr()->lte(
                                'c1.session_available',
                                ':ses_avail_upper_date'
                            )
                        ),
                        $qb->expr()->andX(
                            $qb->expr()->gte(
                                'c1.session_expire',
                                ':ses_expire_lower_date'
                            ),
                            $qb->expr()->lte(
                                'c1.session_expire',
                                ':ses_expire_upper_date'
                            )
                        )
                    )
                )
            )            

            // Will have NULL id for old entries
            ->leftJoin(
                'AppBundle:Course',
                'c2',
                'WITH',
                $qb->expr()->andX(
                    $qb->expr()->eq(
                        'c2.user',
                        'u'
                    ),
                    $qb->expr()->lt(
                        'c1.id',
                        'c2.id'
                    )
                )
            )

            // Sessions linked
            // and limit to those modified within 30 days
            ->join(
                'AppBundle:Session',
                's1',
                'WITH',
                $qb->expr()->eq(
                    's1.course',
                    'c1'
                )
            )

            // Will have NULL id for old entries
            ->leftJoin(
                'AppBundle:Session',
                's2',
                'WITH',
                $qb->expr()->andX(
                    $qb->expr()->eq(
                        's2.course',
                        'c1'
                    ),
                    $qb->expr()->lt(
                        's1.id',
                        's2.id'
                    )
                )
            )

            // Users with reminders enabled
            ->join(
                'AppBundle:UserSettings', 
                'us1',
                'WITH',
                $qb->expr()->andX(
                    $qb->expr()->eq(
                        'us1.user',
                        'u'
                    ),
                    $qb->expr()->eq(
                        'us1.reminder_emails',
                        '1'
                    )
                )
            )

            // Filter out the old entries
            ->where(
                $qb->expr()->andX(
                    $qb->expr()->isNull('s2.id'),
                    $qb->expr()->isNull('c2.id')
                )
            )

            ->setParameter('ses_avail_lower_date', (new \DateTime())->setTime(0, 0, 0)->modify("-1 Day"))
            ->setParameter('ses_avail_upper_date', (new \DateTime())->setTime(0, 0, 0)->modify("+0 Day"))
            ->setParameter('ses_expire_lower_date', (new \DateTime())->setTime(0, 0, 0)->modify("+1 Day"))
            ->setParameter('ses_expire_upper_date', (new \DateTime())->setTime(0, 0, 0)->modify("+1 Day"))
        ;

        /*$this->dispatcher->dispatch(
            'reminder_emails.comment', 
            new GenericEvent($qb->getQuery()->getSql())
        );

        $this->dispatcher->dispatch(
            'reminder_emails.comment', 
            new GenericEvent(dump($qb->getQuery()->getParameters()))
        );*/

        // Now we have an array of the latest session for each user (where session last modified within 30 days)
        $this->processSessionReminders($qb->getQuery()->getResult());
    }

    private function processSessionReminders(array $Courses)
    {
        $this->dispatcher->dispatch(
            'reminder_emails.info', 
            new GenericEvent('Found '.count($Courses).' courses')
        );

        foreach( $Courses as $UserCourse )
        {
            $all_sessions = $UserCourse->getSessions()->toArray();

            $this->dispatcher->dispatch(
                'reminder_emails.comment', 
                new GenericEvent(''.count($all_sessions).' sessions in course id '.$UserCourse->getId())
            );

            $latest_session = end($all_sessions);
            $this->sendEmail($latest_session);
        }
    }

    public function sendEmail(Session $session)
    {
        $this->dispatcher->dispatch(
            'reminder_emails.comment', 
            new GenericEvent('Preparing email for Session ID '.$session->getId().'')
        );
        $HomePageUrl = "[Stop Smoking Advisor](".$this->router->generate('homepage', [], UrlGeneratorInterface::ABSOLUTE_URL).")";
        $text = ["Hello,"];
        if( $session->getCourse()->getSessionExpire() == $this->dates['tomorrow'] )
        {
            // SEND REMINDER EMAIL - SESSION EXPIRING TOMORROW
            $email_subject = "Your session is expiring";
            $type = 'expiring_tomorrow';
            $text[] = "**Your session is expiring tomorrow, ".$session->getCourse()->getSessionExpire()->format("jS F")."**.";
        }
        elseif( $session->getCourse()->getSessionAvailable() == $this->dates['today'] )
        {
            // SEND REMINDER EMAIL - SESSION UNLOCKED TODAY
            $email_subject = "Your next video session is now available";
            $type = 'available_today';

            $text[] = "**Session ".$session->getSession()." is available now!**";
            $text[] = "We've got a great set of videos lined up tailored just for you.";

            if( $session->getCourse()->getSessionExpire() )
            {
                $text[] = "> **Please note that this session expires on ".$session->getCourse()->getSessionExpire()->format("jS F").".**";
            }
        }
        elseif( $session->getCourse()->getSessionAvailable() == $this->dates['yesterday'] )
        {
            // Send reminder email - session unlocked yesterday
            $email_subject = "Please complete session ".$session->getSession()." today";
            $type = 'available_yesterday';


            $text[] = "Session ".$session->getSession()." on Stop Smoking Advisor was unlocked yesterday.";

            if( $session->getCourse()->getSessionExpire() )
            {
                $text[] = "> **Your current session wil expire on ".$session->getCourse()->getSessionExpire()->format("jS F").".**";
            }
        }
        $text[] = "Why not take some time now to complete your session and get some expert advice on your quit attempt?";
        $text[] = "You'll get tailored videos to give you the best help and guidance from a stop smoking expert.";
        $text[] = "Login now at ".$HomePageUrl." to continue your smoke-free journey.";
        $text[] = "Regards,\nStop Smoking Advisor";
        $text[] = "Ps. You can log in to your account to disable email notifications at any time.";

        $twig_vars = [
            'session_number' => $session->getSession(),
            'session_available' => $session->getCourse()->getSessionAvailable(),
            'session_expire' => $session->getCourse()->getSessionExpire(),
            'type' => $type,
            'user' => $session->getCourse()->getUser()
        ];
        $message = \Swift_Message::newInstance()
            ->setSubject($email_subject)
            ->setFrom([$this->mailer_user => $this->mailer_sender_name])
            ->setTo($session->getCourse()->getUser()->getEmail())
            ->setBody(
                $this->templating->render(
                    'AppBundle:Emails:SessionReminder.html.twig',
                    [
                        'subject' => $email_subject,
                        'content' => join("\n\n", $text)
                    ]
                ),
                'text/html'
            )
            ->addPart(
                $this->templating->render(
                    'AppBundle:Emails:SessionReminder.txt.twig',
                   [
                    'content' => join("\n\n", $text)
                   ]
                ),
                'text/plain'
            )
        ;
        $this->mailer->send($message);
        $this->dispatcher->dispatch(
            'reminder_emails.info', 
            new GenericEvent('Sent email for Session ID '.$session->getId().'')
        );
    }
}