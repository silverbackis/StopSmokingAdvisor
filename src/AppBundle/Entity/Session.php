<?php
/**
 * A session entity is created for a user in their current course for each session they start
 * A session can have a status of started or completed, last active and more
 */
namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity
 * @ORM\Table(name="user_session")
 * @ORM\HasLifecycleCallbacks()
 */
class Session
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="datetime", nullable=false)
     */
    protected $created_at;

    /**
     * @ORM\Column(type="datetime", nullable=false)
     */
    protected $last_updated;

    /**
     * Many Sessions have One Course.
     * @ORM\ManyToOne(targetEntity="Course", inversedBy="sessions")
     * @ORM\JoinColumn(name="course_id", referencedColumnName="id")
     */
    private $course;

    /**
     * @ORM\Column(type="integer", nullable=false, options={"default" : 1})
     * @Assert\Range(
     *      min = 1,
     *      max = 6,
     *      minMessage = "The session week number must be at least 1",
     *      maxMessage = "The session week number cannot be greater than 6"
     * )
     */
    protected $session = 1;

    /**
     * One Session has One Last Page.
     * @ORM\ManyToOne(targetEntity="Page")
     * @ORM\JoinColumn(name="last_page_id", referencedColumnName="id", onDelete="SET NULL")
     */
    private $last_page = null;

    /**
     * @ORM\Column(type="boolean", options={"default" : 0})
     */
    protected $completed = 0;

    /**
     * One Session has Many Views.
     * @ORM\OneToMany(targetEntity="SessionPageView", mappedBy="session", cascade={"all"})
     */
    public $views;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->views = new \Doctrine\Common\Collections\ArrayCollection();
    }

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
     * @return Session
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
     * @return Session
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
     * Set session
     *
     * @param integer $session
     *
     * @return Session
     */
    public function setSession($session)
    {
        $this->session = $session;

        return $this;
    }

    /**
     * Get session
     *
     * @return integer
     */
    public function getSession()
    {
        return $this->session;
    }

    /**
     * Set course
     *
     * @param \AppBundle\Entity\Course $course
     *
     * @return Session
     */
    public function setCourse(\AppBundle\Entity\Course $course = null)
    {
        $this->course = $course;

        return $this;
    }

    /**
     * Get course
     *
     * @return \AppBundle\Entity\Course
     */
    public function getCourse()
    {
        return $this->course;
    }

    /**
     * Set lastPage
     *
     * @param \AppBundle\Entity\Page $lastPage
     *
     * @return Session
     */
    public function setLastPage(\AppBundle\Entity\Page $lastPage = null)
    {
        $this->last_page = $lastPage;

        return $this;
    }

    /**
     * Get lastPage
     *
     * @return \AppBundle\Entity\Page
     */
    public function getLastPage()
    {
        return $this->last_page;
    }

    /**
     * Set completed
     *
     * @param boolean $completed
     *
     * @return Session
     */
    public function setCompleted($completed)
    {
        $this->completed = $completed;

        return $this;
    }

    /**
     * Get completed
     *
     * @return boolean
     */
    public function getCompleted()
    {
        return $this->completed;
    }

    /**
     * Add view
     *
     * @param \AppBundle\Entity\SessionPageView $view
     *
     * @return Session
     */
    public function addView(\AppBundle\Entity\SessionPageView $view)
    {
        $this->views[] = $view;

        return $this;
    }

    /**
     * Remove view
     *
     * @param \AppBundle\Entity\SessionPageView $view
     */
    public function removeView(\AppBundle\Entity\SessionPageView $view)
    {
        $this->views->removeElement($view);
    }

    /**
     * Get views
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getViews()
    {
        return $this->views;
    }
}
