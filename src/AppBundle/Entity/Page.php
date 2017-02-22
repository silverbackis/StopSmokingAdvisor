<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Validator\Constraints as Assert;
use AppBundle\Validator\Constraints as SSAPageAssert;

/**
 * @ORM\Entity
 * @ORM\Table(name="page")
 * @ORM\HasLifecycleCallbacks()
 */
class Page
{
	/**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

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
     * @ORM\ManyToOne(targetEntity="Page", inversedBy="children")
     */
    protected $parent;

    /**
     * @ORM\Column(type="integer", nullable=false, options={"default" : 1})
     * @Assert\GreaterThanOrEqual(
     *      value = 1,
     *      message = "The sort value must be at least 1"
     * )
     */
    protected $sort = 1;

    /**
     * @ORM\Column(type="string", length=4, nullable=false, options={"default" : "page"})
     * @Assert\Choice(choices = {"page", "link"}, strict = true, message="Type must be `page` or `link`")
     */
    protected $type = 'page';

    /**
     * @ORM\ManyToOne(targetEntity="Page")
     */
    protected $forward_to_page;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    protected $name;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    protected $admin_description;

    /**
     * @ORM\Column(type="boolean", options={"default" : 1})
     */
    protected $draft = 1;

    /**
     * @ORM\Column(type="string", length=50, nullable=false, options={"default" : "none"})
     * @Assert\Choice(choices = {"none", "video", "image"}, strict = true, message="Media type must be `none`, `video` or `image`")
     */
    protected $media_type = 'none';

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    protected $media_path = 'none';

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    protected $text;

    /**
     * @ORM\Column(type="datetime", nullable=false)
     */
    protected $createdAt;

    /**
     * @ORM\Column(type="datetime", nullable=false)
     */
    protected $last_updated;

    /**
     * @ORM\OneToMany(targetEntity="Condition", mappedBy="page", cascade={"all"})
     */
    protected $conditions;

    /**
     * @ORM\OneToMany(targetEntity="Question", mappedBy="page", cascade={"all"})
     */
    protected $questions;

    /**
     * @ORM\OneToMany(targetEntity="Page", mappedBy="parent", cascade={"all"})
     * @ORM\OrderBy({"sort" = "ASC"})
     */
    protected $children;

    /**
     * @SSAPageAssert\PageExists
     */
    public $parentID = null;
    

    public function __construct()
    {
        $this->conditions = new ArrayCollection();
    	$this->questions = new ArrayCollection();
        $this->children = new ArrayCollection();
    }

    /**
     * @ORM\PrePersist
     */
    public function setCreatedAtValue()
    {
        $this->createdAt = new \DateTime();
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
     * Set session
     *
     * @param integer $session
     *
     * @return Page
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
     * Set sort
     *
     * @param integer $sort
     *
     * @return Page
     */
    public function setSort($sort)
    {
        $this->sort = $sort;

        return $this;
    }

    /**
     * Get sort
     *
     * @return integer
     */
    public function getSort()
    {
        return $this->sort;
    }

    /**
     * Set type
     *
     * @param string $type
     *
     * @return Page
     */
    public function setType($type)
    {
        $this->type = $type;

        return $this;
    }

    /**
     * Get type
     *
     * @return string
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * Set name
     *
     * @param string $name
     *
     * @return Page
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set adminDescription
     *
     * @param string $adminDescription
     *
     * @return Page
     */
    public function setAdminDescription($adminDescription)
    {
        $this->admin_description = $adminDescription;

        return $this;
    }

    /**
     * Get adminDescription
     *
     * @return string
     */
    public function getAdminDescription()
    {
        return $this->admin_description;
    }

    /**
     * Set draft
     *
     * @param boolean $draft
     *
     * @return Page
     */
    public function setDraft($draft)
    {
        $this->draft = $draft;

        return $this;
    }

    /**
     * Get draft
     *
     * @return boolean
     */
    public function getDraft()
    {
        return $this->draft;
    }

    /**
     * Set mediaType
     *
     * @param string $mediaType
     *
     * @return Page
     */
    public function setMediaType($mediaType)
    {
        $this->media_type = $mediaType;

        return $this;
    }

    /**
     * Get mediaType
     *
     * @return string
     */
    public function getMediaType()
    {
        return $this->media_type;
    }

    /**
     * Set mediaPath
     *
     * @param string $mediaPath
     *
     * @return Page
     */
    public function setMediaPath($mediaPath)
    {
        $this->media_path = $mediaPath;

        return $this;
    }

    /**
     * Get mediaPath
     *
     * @return string
     */
    public function getMediaPath()
    {
        return $this->media_path;
    }

    /**
     * Set text
     *
     * @param string $text
     *
     * @return Page
     */
    public function setText($text)
    {
        $this->text = $text;

        return $this;
    }

    /**
     * Get text
     *
     * @return string
     */
    public function getText()
    {
        return $this->text;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     *
     * @return Page
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * Get createdAt
     *
     * @return \DateTime
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    public function setParentById(int $parentID = null)
    {
        $this->parentID = $parentID;
    }

    /**
     * Set parent
     *
     * @param \AppBundle\Entity\Page $parent
     *
     * @return Page
     */
    public function setParent(\AppBundle\Entity\Page $parent = null)
    {
        $this->parent = $parent;

        return $this;
    }

    /**
     * Get parent
     *
     * @return \AppBundle\Entity\Page
     */
    public function getParent()
    {
        return $this->parent;
    }

    /**
     * Set forwardToPage
     *
     * @param \AppBundle\Entity\Page $forwardToPage
     *
     * @return Page
     */
    public function setForwardToPage(\AppBundle\Entity\Page $forwardToPage = null)
    {
        $this->forward_to_page = $forwardToPage;

        return $this;
    }

    /**
     * Get forwardToPage
     *
     * @return \AppBundle\Entity\Page
     */
    public function getForwardToPage()
    {
        return $this->forward_to_page;
    }


    /**
     * Add condition
     *
     * @param \AppBundle\Entity\Condition $condition
     *
     * @return Page
     */
    public function addCondition(\AppBundle\Entity\Condition $condition)
    {
        $this->conditions[] = $condition;

        return $this;
    }

    /**
     * Remove condition
     *
     * @param \AppBundle\Entity\Condition $condition
     */
    public function removeCondition(\AppBundle\Entity\Condition $condition)
    {
        $this->conditions->removeElement($condition);
    }

    /**
     * Get conditions
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getConditions()
    {
        return $this->conditions;
    }

    /**
     * Add question
     *
     * @param \AppBundle\Entity\Question $question
     *
     * @return Page
     */
    public function addQuestion(\AppBundle\Entity\Question $question)
    {
        $this->questions[] = $question;

        return $this;
    }

    /**
     * Remove question
     *
     * @param \AppBundle\Entity\Question $question
     */
    public function removeQuestion(\AppBundle\Entity\Question $question)
    {
        $this->questions->removeElement($question);
    }

    /**
     * Get questions
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getQuestions()
    {
        return $this->questions;
    }

    /**
     * Add child
     *
     * @param \AppBundle\Entity\Page $child
     *
     * @return Page
     */
    public function addChild(\AppBundle\Entity\Page $child)
    {
        $this->children[] = $child;

        return $this;
    }

    /**
     * Remove child
     *
     * @param \AppBundle\Entity\Page $child
     */
    public function removeChild(\AppBundle\Entity\Page $child)
    {
        $this->children->removeElement($child);
    }

    /**
     * Get children
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getChildren()
    {
        return $this->children;
    }

    /**
     * Set lastUpdated
     *
     * @param \DateTime $lastUpdated
     *
     * @return Page
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
}
