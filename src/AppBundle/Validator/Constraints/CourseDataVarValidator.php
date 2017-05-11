<?php

namespace AppBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

use AppBundle\Manager\SessionManager;
/**
 * @Annotation
 */
class CourseDataVarValidator extends ConstraintValidator
{
    private $session_manager;
    private $question;

    public function __construct(SessionManager $session_manager)
    {
        $this->session_manager = $session_manager;
        $questions = $session_manager->getCurrentPage()->getQuestions();
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