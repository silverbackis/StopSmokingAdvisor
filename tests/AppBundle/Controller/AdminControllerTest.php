<?php

namespace Tests\AppBundle\Controller;

use Tests\WebTestCase;
use Symfony\Component\BrowserKit\Cookie;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;

use AppBundle\DataFixtures\ORM\LoadSamplePages;

use Doctrine\Common\Persistence\ObjectManager;

class AdminControllerTest extends WebTestCase
{
	private $client = null;

	/**
     * @var \Doctrine\ORM\EntityManager
     */
    private static $em;

	public static function setUpBeforeClass()
    {
    	$client = static::createClient();

    	$container = $client->getKernel()->getContainer();
    	self::$em = $container->get('doctrine')->getManager();
        $schema = self::$em->getConnection()->getSchemaManager();
        $newSchema = clone $schema;
        $newSchema->dropTable('answer');
        $newSchema->dropTable('question');
        $newSchema->dropTable('`condition`');
        $newSchema->dropTable('page');

    	parent::setUpBeforeClass();
        self::runCommand('doctrine:fixtures:load --append --no-interaction --fixtures=src/AppBundle/DataFixtures/ORM/LoadSamplePages.php');
    }

    public function setUp()
    {
        $this->client = static::createClient();
    }

    private function assertStandardResponse($httpCode=200, $crawler)
    {
    	$response = $this->client->getResponse();

    	$textException = $crawler->filter('.text-exception');

    	$decoded = json_decode($response->getContent(), true);
    	$messageOutput = $textException->count()>0 ? $textException->text() : ($decoded ? $response->getContent() : 'Unknown content');
    	
    	//Check for HTTP response and output exception of page content
        $this->assertEquals($httpCode, $response->getStatusCode(), $messageOutput);
        
        // Valid JSON check
        $this->assertInternalType('array', $decoded);

        return $decoded;
    }

    public function testSecuredAdmin()
    {
        //$this->logIn();

        $crawler = $this->client->request('GET', '/admin/manage');

        $this->assertFalse($this->client->getResponse()->isSuccessful());
        //$this->assertEquals(1, $crawler->filter('.bottom-tree-area')->count());
    }

    public function testGetSessionPages()
    {
    	$this->logIn();

        $crawler = $this->client->request(
            'GET', 
            '/admin/pages/get/1'
        );

        $decoded = $this->assertStandardResponse(200, $crawler);
        // page fixtures data has 1 top level node in session 1
        $this->assertEquals(1, sizeof($decoded));
    }

    public function testSearchSessionPages()
    {
        $this->logIn();

        $postData = array(
            "search"=>"page"
        );

        $crawler = $this->client->request(
            'POST', 
            '/admin/pages/search/1',
            array(),
            array(),
            array('CONTENT_TYPE' => 'application/json'),
            json_encode($postData)
        );

        $decoded = $this->assertStandardResponse(200, $crawler);
        // page fixtures data has 1 top level node in session 1
        $this->assertEquals(1, sizeof($decoded));
    }

    public function testPageAdd()
    {
    	$this->logIn();

    	$postData = array(
			"session"=>1,
			"parent"=>null,
			"sort"=>2
    	);

    	$crawler = $this->client->request(
            'POST', 
            '/admin/page/add',
            array(),
            array(),
            array('CONTENT_TYPE' => 'application/json'),
            json_encode($postData)
        );

        $decoded = $this->assertStandardResponse(200, $crawler);

    	$this->assertNotNull($decoded['id'], 'ID is not a string');
    	
    	// check it is in the database now
    	$pages = self::$em->getRepository('AppBundle:Page')->findOneById($decoded['id']);
    	$this->assertNotNull($pages, 'Success response but no page added to database');

    	//check we have no order/sort value duplicates
    	$pages = self::$em->getRepository('AppBundle:Page')->findBy(array('sort' => $postData['sort'], 'parent'=>$postData['parent']));
    	$this->assertCount(1, $pages, 'Order of pages not updated properly. There should be just 1 page with the sort value of '.$postData['sort']);
    }
    
    public function testLinkAdd()
    {
    	$this->logIn();

    	$postData = array(
			"session"=>1,
			"parent"=>1,
			"sort"=>2,
			"type"=>"link"
    	);

    	$crawler = $this->client->request(
            'POST', 
            '/admin/page/add',
            array(),
            array(),
            array('CONTENT_TYPE' => 'application/json'),
            json_encode($postData)
        );

    	$decoded = $this->assertStandardResponse(200, $crawler);
    }
    
    public function testPageAddFail()
    {
    	$this->logIn();

    	$postData = array(
			"session"=>60,
			"parent"=>999,
            "sort"=>0,
			"type"=>"unknown"
    	);

    	$crawler = $this->client->request(
            'POST', 
            '/admin/page/add',
            array(),
            array(),
            array('CONTENT_TYPE' => 'application/json'),
            json_encode($postData)
        );

    	$decoded = $this->assertStandardResponse(400, $crawler);

    	//check we are getting errors array
    	$this->assertInternalType('array', $decoded['errors']);
    	//should have an error for each of the submitted keys
    	$this->assertCount(4, $decoded['errors']);
    }

    public function testPageUpdate()
    {
        $this->logIn();

        $postData = array(
            "name"=>"I have updated the name"
        );

        $crawler = $this->client->request(
            'POST', 
            '/admin/page/update/1',
            array(),
            array(),
            array('CONTENT_TYPE' => 'application/json'),
            json_encode($postData)
        );

        $decoded = $this->assertStandardResponse(200, $crawler);
    }
    

    public function testPageDelete()
    {
    	$this->logIn();

    	$crawler = $this->client->request(
            'GET', 
            '/admin/page/delete/6'
        );

        $decoded = $this->assertStandardResponse(200, $crawler);
    }

    public function testPageCopy()
    {
    	$this->logIn();

    	$postData = array(
    		"parent"=>null,
			"sort"=>2
    	);

    	$crawler = $this->client->request(
            'POST', 
            '/admin/page/copy/3',
            array(),
            array(),
            array('CONTENT_TYPE' => 'application/json'),
            json_encode($postData)
        );

        $this->assertStandardResponse(200, $crawler);
    }

    public function testPageMove()
    {
    	$this->logIn();

    	$postData = array(
    		"parent"=>2,
			"sort"=>2
    	);

    	$crawler = $this->client->request(
            'POST', 
            '/admin/page/move/7',
            array(),
            array(),
            array('CONTENT_TYPE' => 'application/json'),
            json_encode($postData)
        );

        $this->assertStandardResponse(200, $crawler);
    }

    public function testConditionAdd()
    {
    	$this->logIn();

    	$postData = array(
    		'pageID'=>1,
    		'condition'=>'y < 50'
    	);

    	$crawler = $this->client->request(
            'POST', 
            '/admin/condition/add',
            array(),
            array(),
            array('CONTENT_TYPE' => 'application/json'),
            json_encode($postData)
        );

        $decoded = $this->assertStandardResponse(200, $crawler);
    }

    public function testConditionDelete()
    {
    	$this->logIn();

    	$crawler = $this->client->request(
            'GET', 
            '/admin/condition/delete/1'
        );

        $decoded = $this->assertStandardResponse(200, $crawler);
    }

	private function logIn()
    {
        $session = $this->client->getContainer()->get('session');

        // the firewall context (defaults to the firewall name)
        $firewall = 'main';

        $token = new UsernamePasswordToken('daniel', null, $firewall, array('ROLE_ADMIN'));
        $session->set('_security_'.$firewall, serialize($token));
        $session->save();

        $cookie = new Cookie($session->getName(), $session->getId());
        $this->client->getCookieJar()->set($cookie);
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