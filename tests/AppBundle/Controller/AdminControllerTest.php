<?php

namespace Tests\AppBundle\Controller;

use Tests\WebTestCase;
use Symfony\Component\BrowserKit\Cookie;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;

use AppBundle\DataFixtures\ORM\LoadSamplePages;

use Doctrine\Common\Persistence\ObjectManager;

class AdminControllerTest extends WebTestCase
{

	public static function setUpBeforeClass()
    {
        parent::setUpBeforeClass();

        $schema = self::$em->getConnection()->getSchemaManager();
        $newSchema = clone $schema;
        $newSchema->dropTable('answer');
        $newSchema->dropTable('question');
        $newSchema->dropTable('`condition`');
        $newSchema->dropTable('page');
    	self::updateSchema();
        self::runCommand('doctrine:fixtures:load --append --no-interaction --fixtures=src/AppBundle/DataFixtures/ORM/LoadSamplePages.php');
    }

    public function setUp()
    {
        self::$client = static::createClient();
    }

    public function testSecuredAdmin()
    {
        //$this->logIn();

        $crawler = self::$client->request('GET', '/admin/manage');

        $this->assertFalse(self::$client->getResponse()->isSuccessful());
        //$this->assertEquals(1, $crawler->filter('.bottom-tree-area')->count());
    }

    public function testGetSessionPages()
    {
    	$this->logIn();

        $crawler = self::$client->request(
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

        $crawler = self::$client->request(
            'POST', 
            '/admin/pages/search/2',
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

    	$crawler = self::$client->request(
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
        $parentID = 6;
    	$postData = array(
			"session"=>1,
			"parent"=>$parentID,
			"sort"=>2,
			"type"=>"link"
    	);

    	$crawler = self::$client->request(
            'POST', 
            '/admin/page/add',
            array(),
            array(),
            array('CONTENT_TYPE' => 'application/json'),
            json_encode($postData)
        );

    	$decoded = $this->assertStandardResponse(200, $crawler);

        $addedLink = self::$em->getRepository('AppBundle:Page')->findOneById($decoded['id']);
        $databaseParentId = $addedLink->getParent()->getId();
        $this->assertEquals($parentID, $databaseParentId, 'Parent ID in database should be '.$parentID.' for newly added link with ID '.$decoded['id'].'. It was '.$databaseParentId);
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

    	$crawler = self::$client->request(
            'POST', 
            '/admin/page/add',
            array(),
            array(),
            array('CONTENT_TYPE' => 'application/json'),
            json_encode($postData)
        );

    	$decoded = $this->assertStandardResponse(400, $crawler);
        
    	//should have an error for each of the submitted keys
    	$this->assertCount(4, $decoded['errors']);//, json_encode($decoded['errors'], JSON_PRETTY_PRINT)
    }

    public function testPageUpdate()
    {
        $this->logIn();

        $postData = array(
            "name"=>"I have updated the name"
        );

        $crawler = self::$client->request(
            'POST', 
            '/admin/page/update/1',
            array(),
            array(),
            array('CONTENT_TYPE' => 'application/json'),
            json_encode($postData)
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

        $crawler = self::$client->request(
            'POST', 
            '/admin/page/copy/3',
            array(),
            array(),
            array('CONTENT_TYPE' => 'application/json'),
            json_encode($postData)
        );

        $this->assertStandardResponse(200, $crawler);
    }
    

    public function testPageDelete()
    {
    	$this->logIn();

    	$crawler = self::$client->request(
            'GET', 
            '/admin/page/delete/9'
        );

        $decoded = $this->assertStandardResponse(200, $crawler);
    }

    public function testPageMove()
    {
    	$this->logIn();

    	$postData = array(
    		"parent"=>null,
			"sort"=>2
    	);

    	$crawler = self::$client->request(
            'POST', 
            '/admin/page/move/8',
            array(),
            array(),
            array('CONTENT_TYPE' => 'application/json'),
            json_encode($postData)
        );

        $decoded = $this->assertStandardResponse(200, $crawler);

        // check it is in the database now
        $this->assertNull($decoded['parent'], 'Parent ID of page 8 should be Null. Just tried moving it to the root');
    }

    public function testConditionAdd()
    {
    	$this->logIn();

    	$postData = array(
    		'page'=>1,
    		'condition'=>'y < 50'
    	);

    	$crawler = self::$client->request(
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

    	$crawler = self::$client->request(
            'GET', 
            '/admin/condition/delete/1'
        );

        $decoded = $this->assertStandardResponse(200, $crawler);
    }

	private function logIn()
    {
        $session = self::$client->getContainer()->get('session');

        // the firewall context (defaults to the firewall name)
        $firewall = 'main';

        $token = new UsernamePasswordToken('daniel', null, $firewall, array('ROLE_ADMIN'));
        $session->set('_security_'.$firewall, serialize($token));
        $session->save();

        $cookie = new Cookie($session->getName(), $session->getId());
        self::$client->getCookieJar()->set($cookie);
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