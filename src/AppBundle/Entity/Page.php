<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity
 * @ORM\Table(name="page")
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
     * @ORM\OneToMany(targetEntity="Condition", mappedBy="page")
     */
    protected $conditions;

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
     * @ORM\Column(type="integer", nullable=true)
     * @ORM\OneToOne(targetEntity="Page")
     */
    protected $parent;

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
     * @ORM\Column(type="boolean", nullable=true)
     * @ORM\OneToOne(targetEntity="Page")
     */
    protected $forward_to_page;

    /**
     * @ORM\Column(type="string", length=50, nullable=false, options={"default" : "none"})
     * @Assert\Choice({"none", "video", "image"})
     */
    protected $media_type = 'none';

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    protected $media_path = 'none';

    /**
     * @ORM\OneToMany(targetEntity="Question", mappedBy="page")
     */
    protected $questions;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    protected $text;

    public function __construct()
    {
    	$this->questions = new ArrayCollection();
        $this->conditions = new ArrayCollection();
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
     * Set parent
     *
     * @param integer $parent
     *
     * @return Page
     */
    public function setParent($parent)
    {
        $this->parent = $parent;

        return $this;
    }

    /**
     * Get parent
     *
     * @return integer
     */
    public function getParent()
    {
        return $this->parent;
    }

    /**
     * Set pageName
     *
     * @param string $pageName
     *
     * @return Page
     */
    public function setPageName($pageName)
    {
        $this->page_name = $pageName;

        return $this;
    }

    /**
     * Get pageName
     *
     * @return string
     */
    public function getPageName()
    {
        return $this->page_name;
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
     * @param \boolean $draft
     *
     * @return Page
     */
    public function setDraft(bool $draft)
    {
        $this->draft = $draft;

        return $this;
    }

    /**
     * Get draft
     *
     * @return \boolean
     */
    public function getDraft()
    {
        return $this->draft;
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
     * Set forwardToPage
     *
     * @param boolean $forwardToPage
     *
     * @return Page
     */
    public function setForwardToPage($forwardToPage)
    {
        $this->forward_to_page = $forwardToPage;

        return $this;
    }

    /**
     * Get forwardToPage
     *
     * @return boolean
     */
    public function getForwardToPage()
    {
        return $this->forward_to_page;
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


}
