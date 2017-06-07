<?php

namespace AppBundle\Validator\Constraints;

use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Constraint;

use Doctrine\ORM\EntityManager;

class ValidateSortValidator extends ConstraintValidator
{
	public $doctrineEM;

	public function __construct(EntityManager $doctrineEM)
	{
		$this->doctrineEM = $doctrineEM;
	}

	public function validate($page, Constraint $constraint)
  {
    $queryBuilder = $this->doctrineEM->createQueryBuilder();

    $parent = $page->getParent();

  	if(is_null($parent))
  	{
  		$parentWhere = 'IS NULL';
  	}
  	else
  	{
  		$parentWhere = '= :parent';
  		$queryBuilder->setParameter('parent', $parent);
  	}

  	$totalTreeNodes = (int) $queryBuilder
			->select('COUNT(p.id)')
			->from('AppBundle\Entity\Page', 'p')
			->where('p.parent '.$parentWhere)
			->andWhere('p.session = :session')
			->setParameter('session', $page->getSession())
			->getQuery()
			->getSingleScalarResult();

		// if this page has not been added yet, it could be 1 sort value higher
    // if this page is being added to a new parent / moved it can be 1 higher too 
    if(is_null($page->getId()))
		{
			$totalTreeNodes++;
		}
    else
    {
      $old_data = $this->doctrineEM
        ->getUnitOfWork()
        ->getOriginalEntityData($page)
      ;
      if($old_data['parent_id']!==$page->getParent()) {
        $totalTreeNodes++;
      }
    }

		if($page->getSort()>$totalTreeNodes)
		{
			$page->setSort($totalTreeNodes);
		}
  }
}