<?php

namespace AppBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class ValidateSort extends Constraint
{
	public $parentError = 'Sorry, the requested parent (ID: %parent%) is in session %parent_session% but this page (ID: %id%) is in session %session%. They must be the same.';
	public function getTargets()
	{
	    return self::CLASS_CONSTRAINT;
	}
}