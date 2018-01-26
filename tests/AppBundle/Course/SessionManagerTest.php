<?php

namespace Tests\AppBundle\Course;

use AppBundle\Course\SessionManager;
use AppBundle\Entity\Condition;
use AppBundle\Entity\Page;
use Doctrine\Common\Persistence\ObjectRepository;
use Doctrine\ORM\EntityManager;
use PHPUnit\Framework\TestCase;
use Sonata\SeoBundle\Seo\SeoPage;
use Symfony\Bundle\FrameworkBundle\Routing\Router;
use Symfony\Bundle\TwigBundle\TwigEngine;
use Symfony\Component\Form\FormFactory;
use Symfony\Component\HttpFoundation\Session\Session;

class SessionManagerTest extends TestCase
{
    private $sm;
    private $checkPageConditions;
    /**
     * @var SessionManager
     */
    private $smReal;

    public function setUp ()
    {
        $em = $this->prophesize(EntityManager::class);
        $ses = $this->prophesize(Session::class);
        $this->sm = $this->prophesize(
            SessionManager::class,
            [
                $em->reveal(),
                $this->prophesize(Router::class)->reveal(),
                $this->prophesize(SeoPage::class)->reveal(),
                $ses->reveal(),
                $this->prophesize(TwigEngine::class)->reveal(),
                $this->prophesize(FormFactory::class)->reveal()
            ]
        );
        $this->smReal = new SessionManager($em->reveal(),
                                           $this->prophesize(Router::class)->reveal(),
                                           $this->prophesize(SeoPage::class)->reveal(),
                                           $ses->reveal(),
                                           $this->prophesize(TwigEngine::class)->reveal(),
                                           $this->prophesize(FormFactory::class)->reveal());
        $this->checkPageConditions = new \ReflectionMethod(SessionManager::class, 'checkPageConditions');
        $this->checkPageConditions->setAccessible(true);
    }

    private function getPageWithCondition(string $conditionStr)
    {
        $page = new Page();
        $condition = new Condition();
        $condition->setPage($page);
        $condition->setCondition($conditionStr);
        $page->addCondition($condition);
        return $page;
    }

    public function test_convertBoolData ()
    {
        $this->assertTrue($this->smReal->convertBoolData('bool_1'));
        $this->assertFalse($this->smReal->convertBoolData('bool_0'));
        $this->assertEquals('123', $this->smReal->convertBoolData('123'));
    }

    public function test_checkPageConditions ()
    {
        $this->sm
            ->getData('var')
            ->willReturn(1)
        ;

        $page = $this->getPageWithCondition('var==1');
        $this->assertTrue($this->checkPageConditions->invokeArgs($this->sm->reveal(), [ $page ]));

        $page = $this->getPageWithCondition('var = 1');
        $this->assertTrue($this->checkPageConditions->invokeArgs($this->sm->reveal(), [ $page ]));

        $page = $this->getPageWithCondition('var');
        $this->assertTrue($this->checkPageConditions->invokeArgs($this->sm->reveal(), [ $page ]));

        $page = $this->getPageWithCondition('var < 2');
        $this->assertTrue($this->checkPageConditions->invokeArgs($this->sm->reveal(), [ $page ]));

        $page = $this->getPageWithCondition('var < 1');
        $this->assertFalse($this->checkPageConditions->invokeArgs($this->sm->reveal(), [ $page ]));

        $page = $this->getPageWithCondition('var > 0');
        $this->assertTrue($this->checkPageConditions->invokeArgs($this->sm->reveal(), [ $page ]));

        $page = $this->getPageWithCondition('var > 1');
        $this->assertFalse($this->checkPageConditions->invokeArgs($this->sm->reveal(), [ $page ]));

        $page = $this->getPageWithCondition('var >= 1');
        $this->assertTrue($this->checkPageConditions->invokeArgs($this->sm->reveal(), [ $page ]));

        $page = $this->getPageWithCondition('var <= 1');
        $this->assertTrue($this->checkPageConditions->invokeArgs($this->sm->reveal(), [ $page ]));

        $page = $this->getPageWithCondition('var != 1');
        $this->assertFalse($this->checkPageConditions->invokeArgs($this->sm->reveal(), [ $page ]));

        $page = $this->getPageWithCondition('var <> 1');
        $this->assertFalse($this->checkPageConditions->invokeArgs($this->sm->reveal(), [ $page ]));

        $page = $this->getPageWithCondition('!var');
        $this->assertFalse($this->checkPageConditions->invokeArgs($this->sm->reveal(), [ $page ]));
    }
}
