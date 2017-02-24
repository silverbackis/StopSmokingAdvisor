<?php

namespace Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase as BaseTestCase;

use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Input\StringInput;
use Symfony\Component\Console\Output\BufferedOutput;

class WebTestCase extends BaseTestCase
{
    /**
     * @var \Doctrine\ORM\EntityManager
     */
    protected static $em;

	protected static $application;
    protected static $client;
    protected static $container;

	public static function setUpBeforeClass()
    {
    	self::$client = static::createClient();
    	self::$application = new Application(self::$client->getKernel());
    	self::$application->setAutoExit(false);

        self::$container = self::$client->getKernel()->getContainer();
        self::$em = self::$container->get('doctrine')->getManager();

    	//create and update the database schema
        //self::runCommand('doctrine:database:drop --force');
        //self::runCommand('cache:clear --no-warmup');
        self::runCommand('doctrine:database:create');
    }

    protected static function updateSchema()
    {
        self::runCommand('doctrine:schema:update --force');
    }

	protected static function runCommand($command)
    {
        $command = sprintf('%s --quiet', $command);
        $input = new StringInput($command);
        $output = new BufferedOutput();
        return self::$application->run($input, $output);
    }

    protected function assertStandardResponse($httpCode=200, $crawler)
    {
        $response = self::$client->getResponse();

        $textException = $crawler->filter('.text-exception');

        
        if($textException->count()>0)
        {
            $messageOutput = $textException->text();
        }
        else
        {
            $decoded = json_decode($response->getContent(), true);
            if(!$decoded)
            {
                $messageOutput = 'Unknown content';
            }
            elseif(isset($decoded['errors']))
            {
                $messageOutput = "";
                foreach($decoded['errors'] as $err)
                {
                    if(isset($err['message']))
                    {
                        $messageOutput .= "$err[message]\n";
                    }
                    else
                    {
                        $messageOutput .= $err;
                    }
                }
            }
            else
            {
                $messageOutput = $response->getContent();
            }
        }
        
        //Check for HTTP response and output exception of page content
        $this->assertEquals($httpCode, $response->getStatusCode(), $messageOutput);

        // Valid JSON check
        $this->assertInternalType('array', $decoded, gettype($decoded));

        return $decoded;
    }
}