<?php

namespace AppBundle\Repository;

use AppBundle\Entity\Course;
use AppBundle\Entity\CourseData;
use AppBundle\Entity\Question;
use Doctrine\ORM\EntityRepository;

class CourseDataRepository extends EntityRepository
{
    /**
     * @param Course $course
     * @param int $session
     * @return CourseData[] Returns an array of CourseData objects
     */
    public function findByCourseAndSession(Course $course, int $session = 1)
    {
        $variables = $this->getEntityManager()->getRepository(Question::class)->findVariablesBySession($session);
        return $this->findByCourseAndVariables($course, $variables);
    }

    /**
     * @param Course $course
     * @param array $variables
     * @return CourseData[]
     */
    public function findByCourseAndVariables(Course $course, array $variables)
    {
        $qb = $this->createQueryBuilder('c');
        return $qb
            ->andWhere($qb->expr()->in('c.var', ':vars'))
            ->andWhere($qb->expr()->eq('c.course', ':course'))
            ->setParameter('vars', $variables)
            ->setParameter('course', $course)
            ->getQuery()
            ->getResult()
            ;
    }
}
