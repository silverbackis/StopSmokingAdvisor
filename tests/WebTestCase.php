<?php

namespace Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase as BaseTestCase;

use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Input\StringInput;
use Symfony\Component\Console\Output\BufferedOutput;

class WebTestCase extends BaseTestCase
{
	protected static $application;

	public static function setUpBeforeClass()
    {
    	$client = static::createClient();
    	self::$application = new Application($client->getKernel());
    	self::$application->setAutoExit(false);

    	//create and update the database schema
        //self::runCommand('doctrine:database:drop --force');
        self::runCommand('doctrine:database:create');
        self::runCommand('doctrine:schema:update --force');
    }

	protected static function runCommand($command)
    {
        $command = sprintf('%s --quiet', $command);
        $input = new StringInput($command);
        $output = new BufferedOutput();
        return self::$application->run($input, $output);
    }
}