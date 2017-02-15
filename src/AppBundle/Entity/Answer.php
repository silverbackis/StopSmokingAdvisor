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
     * @ORM\Column(type="integer", nullable=false)
     * @ORM\ManyToOne(targetEntity="Question", inversedBy="answer")
     */
    protected $question;

    /**
     * @ORM\Column(type="string", length=500, nullable=false)
     */
    protected $answer;

    /**
     * @ORM\Column(type="string", length=255, nullable=false)
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
     * Set question
     *
     * @param integer $question
     *
     * @return Answer
     */
    public function setQuestion($question)
    {
        $this->question = $question;

        return $this;
    }

    /**
     * Get question
     *
     * @return integer
     */
    public function getQuestion()
    {
        return $this->question;
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
}
