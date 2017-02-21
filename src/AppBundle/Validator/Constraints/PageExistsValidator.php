<?php

namespace AppBundle\Validator\Constraints;

use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Constraint;

use Doctrine\ORM\EntityManager;

class PageExistsValidator extends ConstraintValidator
{
	public $doctrineEM;

	public function __construct(EntityManager $doctrineEM)
	{
		$this->doctrineEM = $doctrineEM;
	}

	public function validate($value, Constraint $constraint)
    {
    	if(null !== $value)
    	{
    		$page = $this->doctrineEM->getRepository('AppBundle\Entity\Page')->findOneById($value);
	    	if(null === $page)
	    	{
	    		$this->context->buildViolation($constraint->message)
	            	->setParameter('%string%', $value)
	        		->addViolation();
	    	}
    	}
    }
}