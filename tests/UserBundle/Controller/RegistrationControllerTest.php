<?php

namespace Tests\UserBundle\Controller;
 
use Tests\WebTestCase;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Input\StringInput;
use Symfony\Component\Console\Output\BufferedOutput;

use Symfony\Component\Security\Csrf\TokenStorage\SessionTokenStorage;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\MockFileSessionStorage;

class RegistrationControllerTest extends WebTestCase
{
    private static $email = "info@silverback.is";
    /**
     * @var \Doctrine\ORM\EntityManager
     */
    private static $em;

    private $client;

    public static function setUpBeforeClass()
    {
        $client = static::createClient();
        $container = $client->getKernel()->getContainer();
        self::$em = $container->get('doctrine')->getManager();

        $userManager = $container->get('fos_user.user_manager');
        $testUser = $userManager->findUserByEmail(self::$email);
        if($testUser){
            self::$em->remove($testUser);
            self::$em->flush();
        }

        parent::setUpBeforeClass();
        self::runCommand('doctrine:fixtures:load --append --no-interaction --fixtures=src/UserBundle/DataFixtures/ORM/LoadUserData.php');
    }

    protected function setUp()
    {
        $this->client = static::createClient();
    }

    private function makePOSTRequest($data, $validationInputVar=false)
    {
        $data = [ 
            'fos_user_registration_form' => $data
        ];
        if($validationInputVar){
            $data['task'] = [ 
                'submit' => 'no',
                'input' => $validationInputVar
            ];
        }
        $this->client->request(
            'POST', 
            '/register/',
            $data
        );
    }

    public function testValidField()
    {
        $inputID = 'fos_user_registration_form_plainPassword_first';
        $data = [
            'plainPassword' => [
                'first' => 'test12345',
                'second' => 'test12345'
            ]
        ];
        $this->makePOSTRequest($data, $inputID);
        $response = $this->client->getResponse();

        $this->assertEquals(202, $response->getStatusCode());
        $this->assertEquals('[]', $response->getContent());
    }

    public function testInvalidField()
    {
        $inputID = 'fos_user_registration_form_email';
        $data = [
            'email' => 'notanemail'
        ];
        $this->makePOSTRequest($data, $inputID);
        $response = $this->client->getResponse();

        $this->assertEquals(400, $response->getStatusCode());

        $decoded = json_decode($response->getContent(), true);
        $this->assertInternalType('array', $decoded);
        $this->assertEquals(1, sizeof($decoded));
        $this->assertTrue(isset($decoded[$inputID]));
    }

    public function testRegisterNewUser()
    {
        $container = $this->client
            ->getKernel()
            ->getContainer();

        $CSRF_Token = (string)$container->get('security.csrf.token_manager')->getToken('registration');
        
        $data = [
            '_token' => $CSRF_Token, 
            'username' => self::$email,
            'email' => self::$email,
            'plainPassword' => [
                'first' => 'test123',
                'second' => 'test123'
            ]
        ];
        $this->makePOSTRequest($data);
        $response = $this->client->getResponse();

        $this->assertEquals(201, $response->getStatusCode(), $response->getContent());
        $this->assertInternalType('array', json_decode($response->getContent(), true));
    }

    public function testForgotPassword()
    {
        $data = [
            'username' => self::$email
        ];
        $this->client->request(
            'POST', 
            '/resetting/send-email',
            $data
        );
        $response = $this->client->getResponse();

        $this->assertEquals(202, $response->getStatusCode());
        $this->assertInternalType('array', json_decode($response->getContent(), true));
    }

    public function testForgotPasswordRepeat()
    {
        $data = [
            'username' => self::$email
        ];
        $this->client->request(
            'POST', 
            '/resetting/send-email',
            $data
        );
        $response = $this->client->getResponse();

        $this->assertEquals(400, $response->getStatusCode());
        $this->assertInternalType('array', json_decode($response->getContent(), true));
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
        $this->makePOSTRequest($data);
        $response = $this->client->getResponse();
 
        $this->assertEquals(400, $response->getStatusCode());
        $this->assertInternalType('array', json_decode($response->getContent(), true));
    }

    public function testRegisterInvalidPassword()
    {
        $data = [
            'username' => self::$email,
            'email' => self::$email,
            'plainPassword' => [
                'first' => 'badpass', 'second' => 'badpass'
            ]
        ];
        $this->makePOSTRequest($data);
        $response = $this->client->getResponse();
        $this->assertEquals(400, $response->getStatusCode());
    }

    public function testRegisterInvalidPasswordMatch()
    {
        $data = [
            'username' => self::$email,
            'email' => self::$email,
            'plainPassword' => [
                'first' => 'test123', 'second' => 'test12'
            ]
        ];
        $this->makePOSTRequest($data);
        $response = $this->client->getResponse();
 
        $this->assertEquals(400, $response->getStatusCode());
    }

    /**
     * {@inheritDoc}
     */
    public static function tearDownfterClass()
    {
        parent::tearDown();

        self::$em->close();
        self::$em = null; // avoid memory leaks
    }
}
