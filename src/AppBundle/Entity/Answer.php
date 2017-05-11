<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity
 * @ORM\Table(name="answer")
 */
class Answer
{
	/**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\ManyToOne(targetEntity="Question", inversedBy="answer_options")
     */
    protected $question;

    /**
     * @ORM\Column(type="string", length=500, nullable=true)
     */
    protected $answer;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    protected $save_value;

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
     * Set answer
     *
     * @param string $answer
     *
     * @return Answer
     */
    public function setAnswer($answer)
    {
        $this->answer = $answer;

        return $this;
    }

    /**
     * Get answer
     *
     * @return string
     */
    public function getAnswer()
    {
        return $this->answer;
    }

    /**
     * Set saveValue
     *
     * @param string $saveValue
     *
     * @return Answer
     */
    public function setSaveValue($saveValue)
    {
        $this->save_value = $saveValue;

        return $this;
    }

    /**
     * Get saveValue
     *
     * @return string
     */
    public function getSaveValue()
    {
        return $this->save_value;
    }

    /**
     * Set question
     *
     * @param \AppBundle\Entity\Question $question
     *
     * @return Answer
     */
    public function setQuestion(\AppBundle\Entity\Question $question = null)
    {
        $this->question = $question;

        return $this;
    }

    /**
     * Get question
     *
     * @return \AppBundle\Entity\Question
     */
    public function getQuestion()
    {
        return $this->question;
    }
}
