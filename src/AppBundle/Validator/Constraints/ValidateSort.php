<?php

namespace AppBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class ValidateSort extends Constraint
{
	public function getTargets()
	{
	    return self::CLASS_CONSTRAINT;
	}
}