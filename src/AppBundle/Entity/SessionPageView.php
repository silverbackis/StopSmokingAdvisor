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
 * @ORM\Table(name="user_session_view")
 * @ORM\HasLifecycleCallbacks()
 */
class SessionPageView
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
     * @ORM\Column(type="integer", nullable=false)
     */
    protected $views = 1;

    /**
     * One Session view related to one page.
     * @ORM\ManyToOne(targetEntity="Page")
     * @ORM\JoinColumn(name="page_viewed_id", referencedColumnName="id", onDelete="CASCADE")
     */
    private $page_viewed;

    /**
     * One Session view related to session.
     * @ORM\ManyToOne(targetEntity="Session", inversedBy="views")
     * @ORM\JoinColumn(name="session_id", referencedColumnName="id")
     */
    private $session;

    /**
     * One Session view related to course.
     * @ORM\ManyToOne(targetEntity="Course")
     * @ORM\JoinColumn(name="course_id", referencedColumnName="id")
     */
    private $course;

    /**
     * @ORM\PrePersist
     */
    public function setCreatedAtValue()
    {
        $this->created_at = new \DateTime();
        $this->last_updated = new \DateTime();
        return $this;
    }

  
    /**
     * Set lastUpdated
     *
     * @param \DateTime $lastUpdated
     *
     * @return Session
     * @ORM\PreUpdate
    */
    public function setLastUpdatedValue($lastUpdated)
    {
        return $this->setLastUpdated(new \DateTime());
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
     * @return SessionPageViews
     */
    public function setCreatedAt(\DateTime $createdAt)
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
     * Set views
     *
     * @param integer $views
     *
     * @return SessionPageViews
     */
    public function setViews($views)
    {
        $this->views = $views;

        return $this;
    }

    /**
     * Get views
     *
     * @return integer
     */
    public function getViews()
    {
        return $this->views;
    }

    /**
     * Set pageViewed
     *
     * @param \AppBundle\Entity\Page $pageViewed
     *
     * @return SessionPageViews
     */
    public function setPageViewed(\AppBundle\Entity\Page $pageViewed = null)
    {
        $this->page_viewed = $pageViewed;

        return $this;
    }

    /**
     * Get pageViewed
     *
     * @return \AppBundle\Entity\Page
     */
    public function getPageViewed()
    {
        return $this->page_viewed;
    }

    /**
     * Set session
     *
     * @param \AppBundle\Entity\Session $session
     *
     * @return SessionPageViews
     */
    public function setSession(\AppBundle\Entity\Session $session = null)
    {
        $this->session = $session;

        return $this;
    }

    /**
     * Get session
     *
     * @return \AppBundle\Entity\Session
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
     * @return SessionPageViews
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
     * Get lastUpdated
     *
     * @return \DateTime
     */
    public function getLastUpdated()
    {
        return $this->last_updated;
    }

    /**
     * Set lastUpdated
     *
     * @param \DateTime $lastUpdated
     *
     * @return SessionPageViews
     */
    public function setLastUpdated(\DateTime $lastUpdated)
    {
        $this->last_updated = $lastUpdated;

        return $this;
    }
}
