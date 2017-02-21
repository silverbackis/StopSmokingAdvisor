<?php

namespace AppBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class PageExists extends Constraint
{
	public $message = 'The page ID "%string%" does not exist.';
}