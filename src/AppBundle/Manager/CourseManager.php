<?php

namespace AppBundle\Manager;

use Doctrine\ORM\EntityManager;
use Symfony\Component\Security\Core\Authorization\AuthorizationChecker;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\User\UserInterface;

use AppBundle\Entity\Course;

class CourseManager {
  private $em;

  protected $user;
  public $course;

  public function __construct(AuthorizationChecker $AuthorizationChecker, TokenStorage $TokenStorage, EntityManager $em)
  {
    if (!$AuthorizationChecker->isGranted('IS_AUTHENTICATED_FULLY')) {
      throw new AccessDeniedException();
    }
    $this->setUser($TokenStorage->getToken()->getUser());
    $this->em = $em;
    $this->setCurrentCourse();
  }

  /**
   * getCurrentCourse will return the current course 
   * @return AppBundle\Entity\Course
   */
  public function setCurrentCourse()
  {
    $this->course = $this->em
      ->getRepository('AppBundle:Course')
      ->findOneBy([
        'user'=>$this->user
      ],
      [
        'created_at'=>'DESC'
      ]);
    
    // If no courses exist at all
    if(!$this->course)
    {
      $this->createNewCourse();
    }
    return $this->course;
  }

  /**
   * setNewCourse will create a empty new course and assign it to the current user
   * @return AppBundle\Entity\Course
   */
  private function createNewCourse()
  {
    // Create a user's first course and add to the database
    $this->course = new Course();
    $this->course->setUser($this->user);
    $this->em->persist($this->course);
    $this->em->flush();
    return $this->course;
  }

  public function getSessionManager()
  {
    return $this->sm;
  }

  /**
   * setUser set the user who we are managing the course for
   * @param UserInterface $user
   */
  public function setUser(UserInterface $user)
  {
    $this->user = $user;
  }

  /**
   * @return UserInterface
   */
  public function getUser()
  {
    return $this->user;
  }

  public function getData($key)
  {
    // find the variable by key for the course in the database
    return $this->em
      ->getRepository('AppBundle:CourseData')
      ->findOneBy([
        'var'=>$key
      ]);
  }
}