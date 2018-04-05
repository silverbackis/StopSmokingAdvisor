<?php

namespace AppBundle\Utils;

use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Doctrine\ORM\EntityManager;
use AppBundle\Entity\UserSettings as Settings;

class UserSettings
{
    private $ts;
    private $em;

    public function __construct(
        TokenStorageInterface $ts,
        EntityManager $em
    ) {
        $this->ts = $ts;
        $this->em = $em;
    }

    public function getUserSettings(AppBundle\Entity\User $User = null)
    {
        if (is_null($User)) {
            $User = $this->ts->getToken()->getUser();
        }

        $UserSettings = $this->em->getRepository('AppBundle\Entity\UserSettings')
            ->findOneBy([
                'user' => $User
            ]);

        // Setup settings if not already there
        if (null === $UserSettings) {
            $UserSettings = new Settings();
            $UserSettings->setUser($User);
            $this->em->persist($UserSettings);
            $this->em->flush();
        }

        return $UserSettings;
    }
}
