<?php

namespace Tests\UserBundle\Controller;
 
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Input\StringInput;
use Symfony\Component\Console\Output\BufferedOutput;

use Symfony\Component\Security\Csrf\TokenStorage\SessionTokenStorage;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\MockFileSessionStorage;

class RegistrationControllerTest extends WebTestCase
{
    private $email = "tester@silverback.is";
    protected static $application;
    /**
     * @var \Doctrine\ORM\EntityManager
     */
    private $em;

    private $container,
    $client;

    protected function setUp()
    {
        //Create Application
        $this->client = static::createClient();
        self::$application = new Application($this->client->getKernel());
        self::$application->setAutoExit(false);

        //create and update the database schema
        self::runCommand('doctrine:database:create');
        self::runCommand('doctrine:schema:update --force');
        //self::runCommand('doctrine:fixtures:load --no-interaction');

        //Remove the test user if already in the database - tests will fail if user already exists
        $this->container = $this->client
            ->getKernel()
            ->getContainer();

        $userManager = $this->container
            ->get('fos_user.user_manager');

        $this->em = $this->container
            ->get('doctrine')
            ->getManager();

        $testUser = $userManager->findUserByEmail($this->email);
        if($testUser){
            $this->em->remove($testUser);
            $this->em->flush();
        }
    }

    protected static function runCommand($command)
    {
        $command = sprintf('%s --quiet', $command);
        $input = new StringInput($command);
        $output = new BufferedOutput();
        return self::$application->run($input, $output);
    }

    private function makePOSTRequest($data)
    {
        $this->client->request(
            'POST', 
            '/register/',
            [ 'fos_user_registration_form' => $data ]
        );
        return $this->client;
    }

    public function testRegisterNewUser()
    {
        $data = [
            '_token' => (string)$this->container->get('security.csrf.token_manager')->getToken('registration'), 
            'username' => $this->email,
            'email' => $this->email,
            'plainPassword' => [
                'first' => 'test123',
                'second' => 'test123'
            ]
        ];
        $client = $this->makePOSTRequest($data);
        $response = $client->getResponse();

        $this->assertEquals(201, $response->getStatusCode(), $response->getContent());
        $this->assertInternalType('array', json_decode($response->getContent(), true), 'When successful register POST, we should receive JSON back.');
    }
    
    public function testRegisterInvalidEmail()
    {
        $data = [
            'username' => 'notanemail',
            'email' => 'notanemail',
            'plainPassword' => [
                'first' => 'test123', 'second' => 'test123'
            ]
        ];
        $client = $this->makePOSTRequest($data);
        $response = $client->getResponse();
 
        $this->assertEquals(400, $response->getStatusCode());
        $this->assertInternalType('array', json_decode($response->getContent(), true), 'When invalid register POST, we should receive valid JSON back.');
    }

    public function testRegisterInvalidPassword()
    {
        $data = [
            'username' => $this->email,
            'email' => $this->email,
            'plainPassword' => [
                'first' => 'badpass', 'second' => 'badpass'
            ]
        ];
        $client = $this->makePOSTRequest($data);
        $response = $client->getResponse();
        $this->assertEquals(400, $response->getStatusCode());
    }

    public function testRegisterInvalidPasswordMatch()
    {
        $data = [
            'username' => $this->email,
            'email' => $this->email,
            'plainPassword' => [
                'first' => 'test123', 'second' => 'test12'
            ]
        ];
        $client = $this->makePOSTRequest($data);
        $response = $client->getResponse();
 
        $this->assertEquals(400, $response->getStatusCode());
    }

    /**
     * {@inheritDoc}
     */
    protected function tearDown()
    {
        parent::tearDown();

        $this->em->close();
        $this->em = null; // avoid memory leaks
    }
}
