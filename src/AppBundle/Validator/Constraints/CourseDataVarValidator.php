<?php

namespace AppBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

use AppBundle\Course\CourseManager;
/**
 * @Annotation
 */
class CourseDataVarValidator extends ConstraintValidator
{
    private $CourseManager;
    private $question;

    public function __construct(CourseManager $CourseManager)
    {
        $this->CourseManager = $CourseManager;
        $questions = $CourseManager->getCurrentPage()->getQuestions();
        $this->question = $questions[0];
    }

    public function validate($value, Constraint $constraint)
    {
        if ($this->question->getVariable() !== $value) {
            $this->context->buildViolation($constraint->message)
                ->setParameter('{{ var }}', $value)
                ->addViolation();
        }
    }
}