<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="AppBundle\Repository\QuestionRepository")
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
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    protected $question;

    /**
     * @ORM\Column(type="string", length=80, nullable=true)
     * @Assert\Regex(
       *     pattern="/^[a-z0-9_-]+$/i",
       *     match=true,
       *     message="Your quesiton's variable name contains invalid characters. It can only contain letters, numbers, underscores (_) and dashes (-)"
       * )
     */
    protected $variable;

    /**
     * @ORM\Column(type="string", length=30, nullable=false)
     * @Assert\Choice(choices = {"choice", "choice_multi", "choice_emotive", "choice_boolean", "text", "float", "date", "date_quit", "float_spend_weekly", "choice_boolean_continue"}, message = "The question type selected is not valid", strict = true)
     */
    protected $input_type;

    /**
     * @ORM\OneToMany(targetEntity="Answer", mappedBy="question", cascade={"all"})
     */
    protected $answer_options;

    /**
     * @ORM\Column(type="boolean", options={"default" : 0})
     * @var boolean
     */
    protected $quit_plan = false;

    /**
     * @ORM\Column(type="integer", options={"default" : 10})
     * @Assert\Expression("this.getMinAnswers() <= this.getMaxAnswers()", message="The minimum answers required must be less than or equal to the maximum permitted")
     * @var int
     */
    protected $maxAnswers = 10;

    /**
     * @ORM\Column(type="integer", options={"default" : 1})
     * @Assert\Expression("this.getMinAnswers() <= this.getMaxAnswers()", message="The minimum answers required must be less than or equal to the maximum permitted")
     * @var int
     */
    protected $minAnswers = 1;

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

    /**
     * @return bool
     */
    public function isQuitPlan(): bool
    {
        return $this->quit_plan;
    }

    /**
     * @param bool $quit_plan
     */
    public function setQuitPlan(bool $quit_plan): void
    {
        $this->quit_plan = $quit_plan;
    }

    /**
     * @return int
     */
    public function getMaxAnswers(): int
    {
        return $this->maxAnswers;
    }

    /**
     * @param int $maxAnswers
     */
    public function setMaxAnswers(int $maxAnswers): void
    {
        $this->maxAnswers = $maxAnswers;
    }

    /**
     * @return int
     */
    public function getMinAnswers(): int
    {
        return $this->minAnswers;
    }

    /**
     * @param int $minAnswers
     */
    public function setMinAnswers(int $minAnswers): void
    {
        $this->minAnswers = $minAnswers;
    }
}
