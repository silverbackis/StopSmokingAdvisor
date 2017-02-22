<?php

namespace AppBundle\DataFixtures\ORM;
// Class level
use Doctrine\Common\DataFixtures\FixtureInterface;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
// Method parameters
use Symfony\Component\DependencyInjection\ContainerInterface;
use Doctrine\Common\Persistence\ObjectManager;
// Used in methods
use AppBundle\Entity\Page;
use AppBundle\Entity\Condition;

class LoadSamplePages implements FixtureInterface, ContainerAwareInterface
{
	private static $pageCounter = 1;
	private $container,
	$manager;

    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
        $this->validator = $this->container->get('validator');
    }
    
    private function generatePage($session=1, $parent=null, $sort=1, $forwardTo=null)
    {
        $page = new Page();

        $page->setSession($session);
        $page->setParent($parent);
        $page->setSort($sort);
        $page->setName('Default session '.$session.' page');
        $page->setAdminDescription('Default session '.$session.' page description');
        $page->setDraft(0);
        $page->setForwardToPage($forwardTo);

        // validate
        $errors = $this->validator->validate($page);
        if (count($errors) > 0) {
	        $errorsString = (string) $errors;
	        throw new \Exception($errorsString);
	    }

	    // persist new page to database and flush
        $this->manager->persist($page);
        $this->manager->flush();

        // up the page counter
        self::$pageCounter++;

        // return the new page
        return $page;
    }

    /**
     * Helper method to return an already existing Locator from the database, else create and return a new one
     *
     * @param string        $name
     * @param ObjectManager $manager
     *
     * @return Page
     */
    protected function findOrCreateLocator($sessioNumber, ObjectManager $manager)
    {
        return $manager->getRepository('AppBundle\Entity\Page')->findOneBy(['session' => $sessioNumber]) ?: new Page();
    }

    public function load(ObjectManager $manager)
    {
    	$this->manager = $manager;
        $counter = 6;
        while($counter>0)
        {
            $locator = $this->findOrCreateLocator($counter, $this->manager);
            if (!$this->manager->contains($locator))
            {
                $this->generatePage($counter);
            }
            $counter--;
        }
    }
}