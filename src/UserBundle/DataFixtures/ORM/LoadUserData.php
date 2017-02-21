<?php

namespace UserBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use UserBundle\Entity\User;

class LoadUserData implements FixtureInterface, ContainerAwareInterface
{
    private $container,
    $adminUsers = array(
        array(
            'daniel',
            'daniel@silverback.is'
        ),
        array(
            'matthew',
            'matthew@silverback.is'
        ),
        array(
            'robert',
            'robertwest100@googlemail.com'
        )
    );

    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }

    private function generateAdminUser($username, $email)
    {
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPlainPassword(bin2hex(random_bytes(20)));
        $user->setRoles(array('ROLE_ADMIN'));
        $user->setEnabled(true);
        return $user;
    }

    /**
     * Helper method to return an already existing Locator from the database, else create and return a new one
     *
     * @param string        $name
     * @param ObjectManager $manager
     *
     * @return Locator
     */
    protected function findOrCreateLocator($name, ObjectManager $manager)
    {
        return $manager->getRepository('UserBundle\Entity\User')->findOneBy(['username' => $name]) ?: new User();
    }

    public function load(ObjectManager $manager)
    {
        foreach ($this->adminUsers as $userArray)
        {
            $locator = $this->findOrCreateLocator($userArray[0], $manager);

            /** Check if the object is managed (so already exists in the database) **/
            if (!$manager->contains($locator))
            {
                $manager->persist($this->generateAdminUser($userArray[0], $userArray[1]));
            }
        }
        $manager->flush();
    }
}