<?php
/**
 * Course data is all the variables saved within a user's course, this is saved accross all sessions
 * Key value pairs that can be saved and loaded for each page being displayed in a session in a course
 */
namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\ORM\Mapping\UniqueConstraint;

use AppBundle\Validator\Constraints as AppBundleAssert;
use Symfony\Component\Validator\Context\ExecutionContextInterface;

/**
 * @ORM\Entity(repositoryClass="AppBundle\Repository\CourseDataRepository")
 * @ORM\Table(name="user_course_data", uniqueConstraints={@UniqueConstraint(name="var_key_unique", columns={"course_id", "var"})})
 * @ORM\HasLifecycleCallbacks()
 */
class CourseData
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
     * Many Datum have One Course.
     * @ORM\ManyToOne(targetEntity="Course", inversedBy="data")
     * @ORM\JoinColumn(name="course_id", referencedColumnName="id", onDelete="NO ACTION")
     */
    private $course;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @AppBundleAssert\CourseDataVar()
     */
    protected $var;

    /**
     * @ORM\Column(type="json", length=255, nullable=true)
     * @Assert\NotBlank(message="Please answer the question before you continue")
    */
    protected $value;

    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Question")
     * @ORM\JoinColumn(nullable=false)
     * @var Question
     */
    private $question;

    public function __construct(Question $question)
    {
        $this->question = $question;
        $this->setVar($question->getVariable());
    }

    /**
     * @Assert\Callback
     * @param ExecutionContextInterface $context
     */
    public function validate(ExecutionContextInterface $context)
    {
        if ($this->question->getInputType() === 'choice_multi') {
            $answersProvided  = \count($this->value);
            if ($answersProvided < $this->question->getMinAnswers()) {
                $context->buildViolation(sprintf('Please select at least %d answers', $this->question->getMinAnswers()))
                    ->atPath('value')
                    ->addViolation();
            }
            if ($answersProvided > $this->question->getMaxAnswers()) {
                $context->buildViolation(sprintf('Sorry, you cannot select more than %d answers', $this->question->getMaxAnswers()))
                    ->atPath('value')
                    ->addViolation();
            }
        }
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
     * @return CourseData
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
     * @return CourseData
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
     * Set var
     *
     * @param string $var
     *
     * @return CourseData
     */
    public function setVar($var)
    {
        $this->var = $var;

        return $this;
    }

    /**
     * Get var
     *
     * @return string
     */
    public function getVar()
    {
        return $this->var;
    }

    /**
     * Set value
     *
     * @param string $value
     *
     * @return CourseData
     */
    public function setValue($value)
    {
        $this->value = $value;

        return $this;
    }

    /**
     * Get value
     *
     * @return string
     */
    public function getValue()
    {
        return $this->value;
    }

    /**
     * Set course
     *
     * @param \AppBundle\Entity\Course $course
     *
     * @return CourseData
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

    public function setQuestion(Question $question)
    {
        $this->question = $question;
    }
}
