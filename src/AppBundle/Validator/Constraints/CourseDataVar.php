<?php

namespace AppBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class CourseDataVar extends Constraint
{
    private $session_manager;
    public $message = 'The variable "{{ var }}" cannot be modified right now.';
}
