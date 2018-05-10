<?php

namespace AppBundle\Utils;

use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Doctrine\ORM\EntityManager;
use AppBundle\Entity\UserSettings as Settings;
use UserBundle\Entity\User;

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

    public function getUserSettings(User $User = null)
    {
        if (null === $User) {
            $token = $this->ts->getToken();
            if (!$token) {
                return null;
            }
            $User = $token->getUser();
        }

        $UserSettings = $this->em->getRepository(Settings::class)
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
