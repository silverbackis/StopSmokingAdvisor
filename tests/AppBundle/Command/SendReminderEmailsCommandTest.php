<?php

namespace Tests\AppBundle\Command;

use AppBundle\Command\SendReminderEmailsCommand;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Console\Tester\CommandTester;

class SendReminderEmailsCommandTest extends KernelTestCase
{
    public function testExecute()
    {
        self::bootKernel();
        $application = new Application(self::$kernel);

        $application->add(new SendReminderEmailsCommand());

        $command = $application->find('app:reminder-emails:send');
        $commandTester = new CommandTester($command);
        $commandTester->execute(array(
            'command'  => $command->getName(),

            // pass arguments to the helper
            //'username' => 'Wouter',

            // prefix the key with two dashes when passing options,
            // e.g: '--some-option' => 'option_value',
        ));

        // the output of the command in the console
        $output = $commandTester->getDisplay();
        $this->assertContains('Found 3 courses', $output, 'app:reminder-emails:send');
        $this->assertContains('Sent email for Session ID 3', $output, 'app:reminder-emails:send');
        // ...
    }
}