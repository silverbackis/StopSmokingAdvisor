<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity
 * @ORM\Table(name="user_settings")
 */
class UserSettings
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\ManyToOne(targetEntity="UserBundle\Entity\User", cascade={"persist"})
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", onDelete="CASCADE")
     */
    public $user;

    /**
     * @ORM\Column(type="boolean", options={"default" : 1})
     */
    protected $reminder_emails = 1;

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set reminderEmails
     *
     * @param boolean $reminderEmails
     *
     * @return UserSettings
     */
    public function setReminderEmails($reminderEmails)
    {
        $this->reminder_emails = $reminderEmails;

        return $this;
    }

    /**
     * Get reminderEmails
     *
     * @return boolean
     */
    public function getReminderEmails()
    {
        return $this->reminder_emails;
    }

    /**
     * Set user
     *
     * @param \UserBundle\Entity\User $user
     *
     * @return UserSettings
     */
    public function setUser(\UserBundle\Entity\User $user = null)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get user
     *
     * @return \UserBundle\Entity\User
     */
    public function getUser()
    {
        return $this->user;
    }
}
