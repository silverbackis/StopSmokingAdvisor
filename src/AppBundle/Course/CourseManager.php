<?php

namespace AppBundle\Course;

use AppBundle\Entity\Course;
use AppBundle\Entity\CourseData;
use AppBundle\Entity\Page;
use AppBundle\Entity\Session;
use Doctrine\ORM\EntityManager;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage;
use Symfony\Component\Security\Core\Authorization\AuthorizationChecker;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\User\UserInterface;

class CourseManager
{
    private $em;

    protected $user;
    /** @var Course|null */
    private $course;
    /** @var Session|null */
    private $current_session;
    private $router;
    private $quit_date;
    private $session_manager;
    private $auth_checker;

    public function __construct(
        AuthorizationChecker $AuthorizationChecker,
        TokenStorage $TokenStorage,
        EntityManager $em,
        SessionManager $session_manager,
        RouterInterface $router
    ) {
        if (!$AuthorizationChecker->isGranted('IS_AUTHENTICATED_FULLY')) {
            throw new AccessDeniedException();
        }
        $this->auth_checker = $AuthorizationChecker;
        $this->em = $em;
        $this->session_manager = $session_manager;
        $this->router = $router;
        $this->setUser($TokenStorage->getToken()->getUser());
    }

    /**
     * @return Course|null
     */
    public function getCourse(): ?Course
    {
        return $this->course;
    }

    /**
     * @return UserInterface
     */
    public function getUser()
    {
        return $this->user;
    }

    public function getCurrentSession()
    {
        return $this->current_session;
    }

    public function getData($key)
    {
        return $this->session_manager->getData($key);
    }

    public function getCurrentPage(): ?Page
    {
        return $this->session_manager->getCurrentPage();
    }

    /**
     * isSessionAvailable checks whether the session should be available
     * @return boolean - is the session available now
     */
    public function isSessionAvailable()
    {
        $now = new \DateTime();
        return $this->isAvailableExpireNull() || ($now > $this->course->getSessionAvailable() && $now < $this->course->getSessionExpire());
    }

    public function isSessionExpired()
    {
        $now = new \DateTime();
        return $this->isAvailableExpireNull() || $now > $this->course->getSessionExpire();
    }

    private function isAvailableExpireNull()
    {
        return null === $this->course->getSessionAvailable() || null === $this->course->getSessionExpire();
    }

    /**
     * setUser set the user who we are managing the course for
     * @param UserInterface $user
     */
    public function setUser(UserInterface $user)
    {
        $this->user = $user;
        $this->setCurrentCourse();
        return $this;
    }

    /**
     * @return $this
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function createNewCourse()
    {
        $courseData = $this->course ?
            $this->em->getRepository(CourseData::class)->findByCourseAndSession($this->course, 1)
            : [];

        // Create a user's first course and add to the database
        $this->course = new Course();
        $this->course->setUser($this->user);
        $this->em->persist($this->course);

        foreach($courseData as $datum)
        {
            $newDatum = clone $datum;
            $newDatum->setCourse($this->course);
            $this->em->persist($newDatum);
        }

        $this->em->flush();
        return $this;
    }

    /**
     * getCurrentCourse will return the current course
     * @return Course
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    private function setCurrentCourse()
    {
        $this->course = $this->em
            ->getRepository(Course::class)
            ->findOneBy(
                [
                    'user' => $this->user
                ],
                [
                    'created_at' => 'DESC'
                ]
            );

        // If no courses exist at all
        if (!$this->course) {
            $this->createNewCourse();
        }
        $this->setCurrentSession();
        return $this->course;
    }

    /**
     * @return $this
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    private function setCurrentSession()
    {
        $course = $this->getCourse();
        if ($course) {
            if (0 === \count($course->getSessions())) {
                // No sessions in DB in database - create 1st session
                $this->current_session = $this->createNewSession();
            } else {
                $allSessions = $course->getSessions()->toArray();
                $this->current_session = end($allSessions);

                if ($this->current_session->getCompleted() && $this->current_session->getSession() < 8) {
                    // The session entity already there is finished - no good. Create the next session
                    $this->current_session = $this->createNewSession($this->current_session->getSession() + 1);
                }
            }
            $this->session_manager->setSession($this->current_session);
            $this->checkSessionAvailability();
        }
        return $this;
    }

    /**
     * @param int $SessionNumber
     * @return Session
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    private function createNewSession(int $SessionNumber = 1)
    {
        // Create a user's first course and add to the database
        $session = new Session();
        $session->setCourse($this->getCourse());
        $session->setSession($SessionNumber);
        $this->em->persist($session);
        $this->em->flush();

        $this->current_session = $session;
        $this->getCourse()->sessions[] = $this->current_session;
        return $session;
    }

    private function checkSessionAvailability()
    {
        // Set the availability of the current session
        $quit_date = $this->session_manager->getData('quit_date');
        $this->quit_date = null === $quit_date ? null : new \DateTime($quit_date);
        if (
            null === $this->course->getLatestSession() ||
            $this->course->getLatestSession()->getId() !== $this->current_session->getId()
        ) {
            $this->course->setLatestSession($this->current_session);
            $available = (new \DateTime())->setTime(0, 0, 0);
            if ($this->current_session->getCompleted()) {
                $this->course->setSessionAvailable(null);
                $this->course->setSessionExpire(null);
            } elseif (null === $this->quit_date || 1 === $this->current_session->getSession() || $this->auth_checker->isGranted('ROLE_ADMIN')) {
                // Available now if we don't have a quit date or it is the first session or admin user
                $this->course->setSessionAvailable($available);
                $this->course->setSessionExpire(null);
            } else {
                // The available from and expiry dates will be based on the week number and the quit date

                // Get the quit date variable for the course
                $quitDate = $this->quit_date;

                // Set to midnight of the quit date
                $quitDate->setTime(0, 0, 0);

                $daysFromQuitAvailable = (($this->current_session->getSession() - 2) * 7);
                $available = clone $quitDate;
                $this->course->setSessionAvailable($available->modify("+$daysFromQuitAvailable days"));

                $expire = clone $available;
                $this->course->setSessionExpire($expire->modify('+6 days'));
            }

            $this->em->persist($this->course);
            $this->em->flush();
        }
    }

    public function sessionPageAction(Request $request, int $pageID = null)
    {
        if ($pageID === null) {
            if (!$this->isSessionAvailable()) {
                $this->session_manager->addFlash(
                    'warning',
                    "Sorry, it doesn't look like you have any sessions available at the moment."
                );
                return new RedirectResponse($this->router->generate('account_dashboard'));
            }
        } elseif (!$this->auth_checker->isGranted('ROLE_ADMIN')) {
            throw new AccessDeniedException('You are not permitted to request a page to view. Only administrators can do that.');
        }
        return $this->session_manager->sessionPageAction($request, $pageID);
    }

    public function nextPageAction()
    {
        $page = $this->getCurrentPage();
        $questions = $page->getQuestions();
        $question = $questions[0];
        if ($this->session_manager->isValidQuestion($question)) {
            $answerRequired = $question->getInputType() === 'choice_multi' ?  $question->getMinAnswers() > 0 : true;
            if ($answerRequired) {
                $this->addFlash(
                    'danger',
                    'Please answer the question before proceeding'
                );
                return new RedirectResponse($this->router->generate('account_session'));
            }
        }

        // If we get here, we can proceed to next page
        return $this->session_manager->setNextPage();
    }
}
