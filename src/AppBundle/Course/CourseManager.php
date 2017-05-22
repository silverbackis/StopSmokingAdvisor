<?php

namespace AppBundle\Course;

use Doctrine\ORM\EntityManager;
use Symfony\Component\Security\Core\Authorization\AuthorizationChecker;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\User\UserInterface;
use AppBundle\Utils\UserSettings;
use AppBundle\Entity\Course;
use AppBundle\Entity\Session;
use AppBundle\Entity\Page;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\RouterInterface;

class CourseManager {
  private $em;

  protected $user;
  private $course;
  private $current_session;
  private $router;
  private $token_storage;

  public function getCourse()
  {
    return $this->course;
  }

  public function __construct(AuthorizationChecker $AuthorizationChecker, TokenStorage $TokenStorage, EntityManager $em, SessionManager $session_manager, RouterInterface $router)
  {
    if (!$AuthorizationChecker->isGranted('IS_AUTHENTICATED_FULLY')) {
      throw new AccessDeniedException();
    }
    $this->auth_checker = $AuthorizationChecker;
    $this->em = $em;
    $this->session_manager = $session_manager;
    $this->router = $router;
    $this->token_storage = $TokenStorage;
    $this->setUser($this->token_storage->getToken()->getUser());
  }

  /**
   * @return UserInterface
   */
  public function getUser()
  {
    return $this->user;
  }

  public function getCurrentSession()
  {
    return $this->current_session;
  }

  public function getData($key)
  {
    return $this->session_manager->getData($key);
  }

  public function getCurrentPage()
  {
    return $this->session_manager->getCurrentPage();
  }

  /**
   * isSessionAvailable checks whether the session should be available
   * @return boolean - is the session available now
   */
  public function isSessionAvailable()
  {
    $now = new \DateTime();
    return $this->isAvailableExpireNull() || ($now > $this->course->getSessionAvailable() && $now < $this->course->getSessionExpire());
  }

  public function isSessionExpired()
  {
    $now = new \DateTime();
    return $this->isAvailableExpireNull() || $now > $this->course->getSessionExpire();
  }

  private function isAvailableExpireNull()
  {
    return null === $this->course->getSessionAvailable() || null === $this->course->getSessionExpire();
  }

  /**
   * setUser set the user who we are managing the course for
   * @param UserInterface $user
   */
  public function setUser(UserInterface $user)
  {
    $this->user = $user;
    $this->setCurrentCourse();
    return $this;
  }

  public function createNewCourse()
  {
    // Create a user's first course and add to the database
    $this->course = new Course();
    $this->course->setUser($this->user);
    $this->em->persist($this->course);
    $this->em->flush();
    return $this;
  }

  /**
   * getCurrentCourse will return the current course 
   * @return AppBundle\Entity\Course
   */
  private function setCurrentCourse()
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
    $this->setCurrentSession();
    return $this;
  }

  private function setCurrentSession()
  {
    if(0 === count($this->getCourse()->getSessions()))
    {
      // No sessions in DB in database - create 1st session
      $this->current_session = $this->createNewSession();
    }
    else
    {
      $allSessions = $this->getCourse()->getSessions()->toArray();
      $this->current_session = end($allSessions);

      if($this->current_session->getCompleted())
      {
        // The session entity already there is finished - no good. Create the next session
        $this->current_session = $this->createNewSession($this->current_session->getSession()+1);
      }
    }
    $this->session_manager->setSession($this->current_session);
    $this->checkSessionAvailability();
    return $this;
  }

  private function createNewSession(int $SessionNumber = 1)
  {
    // Create a user's first course and add to the database
    $session = new Session();
    $session->setCourse($this->getCourse());
    $session->setSession($SessionNumber);
    $this->em->persist($session);
    $this->em->flush();

    $this->current_session = $session;
    $this->getCourse()->sessions[] = $this->current_session;
    return $session;
  }

  private function checkSessionAvailability()
  {
    // Set the availability of the current session
    $quit_date =  $this->session_manager->getData('quit_date');
    $this->quit_date = null === $quit_date ? null : new \DateTime($quit_date);

    if( 
      is_null( $this->course->getLatestSession() ) || 
      $this->course->getLatestSession()->getId() !== $this->current_session->getId()
    )
    {

      $this->course->setLatestSession($this->current_session);

      if($this->current_session->getCompleted())
      {
        $this->course->setSessionAvailable( null );
        $this->course->setSessionExpire( null );
      }
      elseif(1===$this->current_session->getSession() || null === $this->quit_date)
      {
        $this->course->setSessionAvailable( (new \DateTime())->setTime(0, 0, 0) );
        $this->course->setSessionExpire( null );
      }
      else
      {
        // The available from and expiry dates will be based on the week number and the quit date
        
        // Get the quit date variable for the course
        $quitDate = $this->quit_date;
        
        // Set to midnight of the quit date
        $quitDate->setTime(0, 0, 0);

        $daysFromQuitAvailable = (($this->current_session->getSession()-1)*7);
        $available = clone $quitDate;
        $this->course->setSessionAvailable( $available->modify("+$daysFromQuitAvailable days") );

        $expire = clone $available;
        $this->course->setSessionExpire( $expire->modify("+6 days") );
      }

      $this->em->persist($this->course);
      $this->em->flush();
    }
  }

  public function sessionPageAction(Request $request, int $pageID = null)
  {
    if( $pageID !== null && !$this->auth_checker->isGranted('ROLE_ADMIN') )
    {
      throw new AccessDeniedException("You are not permitted to request a page to view");
    }
    if( !$this->isSessionAvailable() )
    {
      $this->_session->getFlashBag()->add(
        'warning',
        "Sorry, it doesn't look like you have any sessions available at the moment."
      );
      return new RedirectResponse($this->router->generate('account_dashboard'));
    }
    return $this->session_manager->sessionPageAction($request, $pageID);
  }

  public function nextPageAction()
  {
    $page = $this->getCurrentPage();
    $questions = $page->getQuestions();
    $question = $questions[0];
    if($this->session_manager->isValidQuestion($question))
    {
        $this->addFlash(
            'danger',
            'Please answer the question before proceeding'
        );
        return new RedirectResponse($this->router->generate('account_session'));
    }

    // If we get here, we can proceed to next page
    return $this->session_manager->setNextPage();
  }
}