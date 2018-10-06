<?php
/**
 * A user starts a course of sessions and can start new courses.
 * A course in the database keeps track of where a user is in relation to sessions
 * A course can expire - based on if latest available session has expired
 * A course will be created when a user logs in if no course is available
 * A user will always be on the most recent course they started
 */
namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="user_course", indexes={@ORM\Index(name="date_search_index", columns={"session_available", "session_expire"})})
 * @ORM\HasLifecycleCallbacks()
 */
class Course
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    public $id;

    /**
     * @ORM\Column(type="datetime", nullable=false)
     */
    public $created_at;

    /**
     * @ORM\Column(type="datetime", nullable=false)
     */
    public $last_updated;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    public $session_available;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    public $session_expire;

    /**
     * Many Course have One User.
     * @ORM\ManyToOne(targetEntity="Session")
     * @ORM\JoinColumn(name="latest_session_id", referencedColumnName="id", onDelete="NO ACTION")
     */
    public $latest_session;

    /**
     * @ORM\Column(type="boolean", options={"default" : 0})
     */
    public $expired = 0;

    /**
     * Many Course have One User.
     * @ORM\ManyToOne(targetEntity="UserBundle\Entity\User")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", onDelete="NO ACTION", nullable=false)
     */
    public $user;

    /**
     * One Course has Many Datas.
     * @ORM\OneToMany(targetEntity="CourseData", mappedBy="course", cascade={"all"})
     */
    public $data;

    /**
     * One Course has Many Datas.
     * @ORM\OneToMany(targetEntity="Session", mappedBy="course", cascade={"all"})
     */
    public $sessions;

    /**
     * @ORM\PrePersist
     */
    public function setCreatedAtValue()
    {
        $this->created_at = new \DateTime();
        $this->last_updated = new \DateTime();
    }

    /**
     * @ORM\PreUpdate
     */
    public function setUpdatedValue()
    {
        $this->last_updated = new \DateTime();
    }
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->data = new \Doctrine\Common\Collections\ArrayCollection();
        $this->sessions = new \Doctrine\Common\Collections\ArrayCollection();
    }

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
     * Set createdAt
     *
     * @param \DateTime $createdAt
     *
     * @return Course
     */
    public function setCreatedAt($createdAt)
    {
        $this->created_at = $createdAt;

        return $this;
    }

    /**
     * Get createdAt
     *
     * @return \DateTime
     */
    public function getCreatedAt()
    {
        return $this->created_at;
    }

    /**
     * Set lastUpdated
     *
     * @param \DateTime $lastUpdated
     *
     * @return Course
     */
    public function setLastUpdated($lastUpdated)
    {
        $this->last_updated = $lastUpdated;

        return $this;
    }

    /**
     * Get lastUpdated
     *
     * @return \DateTime
     */
    public function getLastUpdated()
    {
        return $this->last_updated;
    }

    /**
     * Set expired
     *
     * @param boolean $expired
     *
     * @return Course
     */
    public function setExpired($expired)
    {
        $this->expired = $expired;

        return $this;
    }

    /**
     * Get expired
     *
     * @return boolean
     */
    public function getExpired()
    {
        return $this->expired;
    }

    /**
     * Set user
     *
     * @param \UserBundle\Entity\User $user
     *
     * @return Course
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

    /**
     * Add datum
     *
     * @param \AppBundle\Entity\CourseData $datum
     *
     * @return Course
     */
    public function addDatum(\AppBundle\Entity\CourseData $datum)
    {
        $this->data[] = $datum;

        return $this;
    }

    /**
     * Remove datum
     *
     * @param \AppBundle\Entity\CourseData $datum
     */
    public function removeDatum(\AppBundle\Entity\CourseData $datum)
    {
        $this->data->removeElement($datum);
    }

    /**
     * Get data
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getData()
    {
        return $this->data;
    }

    /**
     * Add session
     *
     * @param \AppBundle\Entity\Session $session
     *
     * @return Course
     */
    public function addSession(\AppBundle\Entity\Session $session)
    {
        $this->sessions[] = $session;

        return $this;
    }

    /**
     * Remove session
     *
     * @param \AppBundle\Entity\Session $session
     */
    public function removeSession(\AppBundle\Entity\Session $session)
    {
        $this->sessions->removeElement($session);
    }

    /**
     * Get sessions
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getSessions()
    {
        return $this->sessions;
    }

    /**
     * Set sessionAvailable
     *
     * @param \DateTime $sessionAvailable
     *
     * @return Course
     */
    public function setSessionAvailable($sessionAvailable)
    {
        $this->session_available = $sessionAvailable;

        return $this;
    }

    /**
     * Get sessionAvailable
     *
     * @return \DateTime
     */
    public function getSessionAvailable()
    {
        return $this->session_available;
    }

    /**
     * Set sessionExpire
     *
     * @param \DateTime $sessionExpire
     *
     * @return Course
     */
    public function setSessionExpire($sessionExpire)
    {
        $this->session_expire = $sessionExpire;

        return $this;
    }

    /**
     * Get sessionExpire
     *
     * @return \DateTime
     */
    public function getSessionExpire()
    {
        return $this->session_expire;
    }

    /**
     * Set latestSession
     *
     * @param \AppBundle\Entity\Session $latestSession
     *
     * @return Course
     */
    public function setLatestSession(\AppBundle\Entity\Session $latestSession = null)
    {
        $this->latest_session = $latestSession;

        return $this;
    }

    /**
     * Get latestSession
     *
     * @return \AppBundle\Entity\Session
     */
    public function getLatestSession()
    {
        return $this->latest_session;
    }
}
