<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity
 * @ORM\Table(name="question")
 */
class Question
{
	/**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\ManyToOne(targetEntity="Page", inversedBy="questions")
     */
    protected $page;

    /**
     * @ORM\Column(type="string", length=255, nullable=false)
     */
    protected $question;

    /**
     * @ORM\Column(type="string", length=80, nullable=false)
     */
    protected $variable;

    /**
     * @ORM\Column(type="string", length=30, nullable=false)
     * @Assert\Choice({"choice", "choice_emotive", "choice_boolean", "text", "float", "date", "date_quit"})
     */
    protected $input_type;

    /**
     * @ORM\OneToMany(targetEntity="Answer", mappedBy="question", cascade={"all"})
     */
    protected $answer_options;

    public function __construct()
    {
    	$this->answer_options = new ArrayCollection();
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
     * Set question
     *
     * @param string $question
     *
     * @return Question
     */
    public function setQuestion($question)
    {
        $this->question = $question;

        return $this;
    }

    /**
     * Get question
     *
     * @return string
     */
    public function getQuestion()
    {
        return $this->question;
    }

    /**
     * Set variable
     *
     * @param string $variable
     *
     * @return Question
     */
    public function setVariable($variable)
    {
        $this->variable = $variable;

        return $this;
    }

    /**
     * Get variable
     *
     * @return string
     */
    public function getVariable()
    {
        return $this->variable;
    }

    /**
     * Set inputType
     *
     * @param string $inputType
     *
     * @return Question
     */
    public function setInputType($inputType)
    {
        $this->input_type = $inputType;

        return $this;
    }

    /**
     * Get inputType
     *
     * @return string
     */
    public function getInputType()
    {
        return $this->input_type;
    }

    /**
     * Set page
     *
     * @param \AppBundle\Entity\Page $page
     *
     * @return Question
     */
    public function setPage(\AppBundle\Entity\Page $page = null)
    {
        $this->page = $page;

        return $this;
    }

    /**
     * Get page
     *
     * @return \AppBundle\Entity\Page
     */
    public function getPage()
    {
        return $this->page;
    }

    /**
     * Add answerOption
     *
     * @param \AppBundle\Entity\Answer $answerOption
     *
     * @return Question
     */
    public function addAnswerOption(\AppBundle\Entity\Answer $answerOption)
    {
        $this->answer_options[] = $answerOption;

        return $this;
    }

    /**
     * Remove answerOption
     *
     * @param \AppBundle\Entity\Answer $answerOption
     */
    public function removeAnswerOption(\AppBundle\Entity\Answer $answerOption)
    {
        $this->answer_options->removeElement($answerOption);
    }

    /**
     * Get answerOptions
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getAnswerOptions()
    {
        return $this->answer_options;
    }
}
