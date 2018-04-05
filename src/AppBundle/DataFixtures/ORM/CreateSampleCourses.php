<?php

namespace AppBundle\DataFixtures\ORM;

// Class level
use Doctrine\Common\DataFixtures\FixtureInterface;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
// Method parameters
use Symfony\Component\DependencyInjection\ContainerInterface;
use Doctrine\Common\Persistence\ObjectManager;
// Used in methods
use UserBundle\Entity\User;
use AppBundle\Entity\Course;
use AppBundle\Entity\Session;
use AppBundle\Entity\UserSettings as Settings;

/*
Create course for daniel for tests (email reminders)
1 that expires tomorrow
1 that unlocks today
1 that unlocked yesterday
 */
class CreateSampleCourses implements FixtureInterface, ContainerAwareInterface, OrderedFixtureInterface
{
    private $container;
    /** @var ObjectManager */
    private $manager;

    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }

    private function setupUserCourse(string $username)
    {
        $User = $this->manager->getRepository(User::class)->findOneBy(['username' => $username]) ?: new User();
        $User->setUsername($username);
        $User->setEmail($username);
        $User->setPlainPassword(bin2hex(random_bytes(20)));
        //$User->setRoles($roles);
        $User->setEnabled(true);

        // Create user settings
        $UserSettings = new Settings();
        $UserSettings->setUser($User);
        $UserSettings->setReminderEmails(true);
        $this->manager->persist($UserSettings);

        switch ($username) {
        case 'testuser2@example.com':
          $available = (new \DateTime())->setTime(0, 0, 0)->modify("-1 Day");
          $expires = null;
        break;

        case 'testuser3@example.com':
          $expires = (new \DateTime())->setTime(0, 0, 0)->modify("+1 Day");
          $available =  (clone $expires)->modify("-6 Day");
        break;

        default:
          $available = (new \DateTime())->setTime(0, 0, 0);
          $expires = (clone $available)->modify("+6 Day");
        break;
      }
        $Course = new Course();
        $Course->setUser($User);
        $Course->setSessionAvailable($available);
        $Course->setSessionExpire($expires);

        $Session = new Session();
        $Session->setCourse($Course);
        $Course->setLatestSession($Session);

        $this->manager->persist($Course);
        $this->manager->persist($Session);
    }

    public function load(ObjectManager $manager)
    {
        $this->manager = $manager;
        $this->setupUserCourse('testuser1@example.com');
        $this->setupUserCourse('testuser2@example.com');
        $this->setupUserCourse('testuser3@example.com');
        $this->manager->flush();
    }

    public function getOrder()
    {
        // the order in which fixtures will be loaded
        // the lower the number, the sooner that this fixture is loaded
        return 3;
    }
}
