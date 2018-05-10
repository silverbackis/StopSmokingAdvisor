<?php

namespace AppBundle\Repository;

use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Query\Expr;

class QuestionRepository extends EntityRepository
{
    public function findVariablesBySession(int $session = 1)
    {
        $qb = $this->createQueryBuilder('q');

        /** @var string[][] $variables */
        $nestedVarNames = $qb
            ->select('q.variable')
            ->join('q.page', 'p', Expr\Join::WITH, $qb->expr()->eq('p.session', ':session'))
            ->setParameter('session', $session)
            ->getQuery()
            ->getResult()
        ;

        $variables = array();
        array_walk_recursive($nestedVarNames, function($a) use (&$variables) { $variables[] = $a; });
        return $variables;
    }
}
