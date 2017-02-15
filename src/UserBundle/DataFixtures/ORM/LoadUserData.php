<?php

namespace UserBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use UserBundle\Entity\User;

class LoadUserData implements FixtureInterface, ContainerAwareInterface
{
    private $container;
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
    public function load(ObjectManager $manager)
    {
        $manager->persist($this->generateAdminUser('daniel', 'daniel@silverback.is'));
        $manager->persist($this->generateAdminUser('matthew', 'matthew@silverback.is'));
        $manager->persist($this->generateAdminUser('robert', 'robertwest100@googlemail.com'));
        $manager->flush();
    }
}