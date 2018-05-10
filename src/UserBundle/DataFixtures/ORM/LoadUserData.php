<?php

namespace UserBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;

use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use UserBundle\Entity\User;

class LoadUserData implements FixtureInterface, ContainerAwareInterface, OrderedFixtureInterface
{
    private $container;
    private $adminUsers = array(
        array(
            'daniel',
            'daniel@silverback.is',
            ['ROLE_ADMIN']
        ),
        array(
            'matthew',
            'matthew@silverback.is',
            ['ROLE_ADMIN']
        ),
        array(
            'robert',
            'robertwest100@googlemail.com',
            ['ROLE_ADMIN']
        )
    );

    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }

    private function generateUser($username, $email, $roles)
    {
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPlainPassword(bin2hex(random_bytes(20)));
        $user->setRoles($roles);
        $user->setEnabled(true);
        return $user;
    }

    /**
     * Helper method to return an already existing User from the database, else create and return a new one
     *
     * @param string        $name
     * @param ObjectManager $manager
     *
     * @return User
     */
    protected function findOrCreateUser($name, ObjectManager $manager): User
    {
        return $manager->getRepository(User::class)->findOneBy(['username' => $name]) ?: new User();
    }

    public function load(ObjectManager $manager)
    {
        foreach ($this->adminUsers as $userArray) {
            $locator = $this->findOrCreateUser($userArray[0], $manager);

            /** Check if the object is managed (so already exists in the database) **/
            if (!$manager->contains($locator)) {
                $manager->persist($this->generateUser($userArray[0], $userArray[1], $userArray[2]));
            }
        }
        $manager->flush();
    }

    public function getOrder()
    {
        // the order in which fixtures will be loaded
        // the lower the number, the sooner that this fixture is loaded
        return 1;
    }
}
