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
    

    public static function setUpBeforeClass()
    {
        parent::setUpBeforeClass();
        self::updateSchema();

        $userManager = self::$container->get('fos_user.user_manager');
        $testUser = $userManager->findUserByEmail(self::$email);
        if($testUser){
            self::$em->remove($testUser);
            self::$em->flush();
        }
        
        self::runCommand('doctrine:fixtures:load --append --no-interaction --fixtures=src/UserBundle/DataFixtures/ORM/LoadUserData.php');
    }

    protected function setUp()
    {
        self::$client = static::createClient();
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
        $crawler = self::$client->request(
            'POST', 
            '/register/',
            $data
        );
        return $crawler;
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
        $crawler = $this->makePOSTRequest($data, $inputID);
        $decoded = $this->assertStandardResponse(202, $crawler);

        $this->assertCount(0, $decoded);
    }

    public function testInvalidField()
    {
        $inputID = 'fos_user_registration_form_email';
        $data = [
            'email' => 'notanemail'
        ];
        $crawler = $this->makePOSTRequest($data, $inputID);
        $decoded = $this->assertStandardResponse(400, $crawler);

        $this->assertEquals(1, sizeof($decoded));
        $this->assertTrue(isset($decoded[$inputID]));
    }

    public function testRegisterNewUser()
    {
        self::$container = self::$client->getKernel()->getContainer();

        $CSRF_Token = (string)self::$container->get('security.csrf.token_manager')->getToken('registration');
        
        $data = [
            '_token' => $CSRF_Token, 
            'username' => self::$email,
            'email' => self::$email,
            'plainPassword' => [
                'first' => 'test123',
                'second' => 'test123'
            ]
        ];
        $crawler = $this->makePOSTRequest($data);
        $decoded = $this->assertStandardResponse(201, $crawler);
    }

    public function testForgotPassword()
    {
        $data = [
            'username' => self::$email
        ];
        $crawler = self::$client->request(
            'POST', 
            '/resetting/send-email',
            $data
        );
        $decoded = $this->assertStandardResponse(202, $crawler);
    }

    public function testForgotPasswordRepeat()
    {
        $data = [
            'username' => self::$email
        ];
        $crawler = self::$client->request(
            'POST', 
            '/resetting/send-email',
            $data
        );
        $decoded = $this->assertStandardResponse(400, $crawler);
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
        $crawler = $this->makePOSTRequest($data);
        $decoded = $this->assertStandardResponse(400, $crawler);
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
        $crawler = $this->makePOSTRequest($data);
        $decoded = $this->assertStandardResponse(400, $crawler);
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
        $crawler = $this->makePOSTRequest($data); 
        $decoded = $this->assertStandardResponse(400, $crawler);
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
