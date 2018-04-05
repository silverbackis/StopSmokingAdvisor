<?php
namespace AppBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\EventDispatcher\GenericEvent;

class SendReminderEmailsCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            // the name of the command (the part after "bin/console")
            ->setName('app:reminder-emails:send')

            // the short description shown while running "php bin/console list"
            ->setDescription('Sends login reminders.')

            // the full command description shown when running the command with
            // the "--help" option
            ->setHelp('This command allows you to send reminder emails out to users who have this setting enabled')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $output->writeLn('<info>Starting Lookup...</info> <comment>env '.$this->getContainer()->getParameter("kernel.environment").'</comment>');

        $dispatcher = $this->getContainer()->get('event_dispatcher');
        $dispatcher->addListener(
            'reminder_emails.info',
            function (GenericEvent $event) use ($output) {
                $output->writeLn('<info>'.$event->getSubject().'</info>');
            }
        );
        $dispatcher->addListener(
            'reminder_emails.comment',
            function (GenericEvent $event) use ($output) {
                $output->writeLn('<comment>'.$event->getSubject().'</comment>');
            }
        );
        $dispatcher->addListener(
            'reminder_emails.question',
            function (GenericEvent $event) use ($output) {
                $output->writeLn('<question>'.$event->getSubject().'</question>');
            }
        );
        $dispatcher->addListener(
            'reminder_emails.error',
            function (GenericEvent $event) use ($output) {
                $output->writeLn('<error>'.$event->getSubject().'</error>');
            }
        );

        $CourseReminderProvider = $this->getContainer()->get('app.course_reminder_provider');
        $CourseReminderProvider->sendReminders();
    }
}
