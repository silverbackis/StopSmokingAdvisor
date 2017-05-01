<?php
namespace AppBundle\Manager;
use AppBundle\Entity\Session;
use AppBundle\Entity\Page;
use AppBundle\Manager\Session\SessionAvailability;

use Doctrine\ORM\EntityManager;

class SessionManager {
  private $em;
  public $course_manager = null;
  private $session_availability = null;

  public function __construct(EntityManager $em, CourseManager $course_manager)
  {
    $this->em = $em;
    $this->course_manager = $course_manager;
  } 

  public function getLastSession()
  {
    $sessionArray = $this->course_manager->course->getSessions()->toArray();
    return end($sessionArray);
  }

  /**
   * getSessionAvailability
   * @return SessionAvailability - object containing the current session and it's availability
   */
  public function getSessionAvailability()
  {
    // No sessions started for user yet, or first session not completed
    if(0 === count($this->course_manager->course->getSessions()))
    {
      $this->session_availability = new SessionAvailability(null, null);
    }
    else
    {
      $this->session_availability = new SessionAvailability($this->getLastSession(), new \DateTime($this->course_manager->getData('quit_date')));
    }

    return $this->session_availability;
  }

  public function getSessionPage()
  {
    if(!$this->session_availability)
    {
      $this->getSessionAvailability();
    }

    if(!$this->session_availability->getAvailable())
    {
      return false;
    }

    if(!$this->session_availability->isSessionEntity())
    {
      // Session NOT in database - create session
      $session = $this->createNewSession();
    }
    else
    {
      $session = $this->getLastSession();
    }

    // Check for the last page id that was viewed to continue
    $last_page = $session->getLastPage();
    if(null !== $last_page && $last_page->getLive())
    {
      // Find the last page and return if it still exists and is available
      return $last_page;
    }

    // Find the pages with no parent and loop through until one is found with matching conditions or no conditions
    return $this->findPage($this->session_availability->week, null);
  }

  private function findPage(int $week, Page $parent_page = null)
  {
    $pages = $this->em->getRepository('AppBundle:Page')
    ->findBy([
      'live'=>true,
      'session'=>$week,
      'parent'=>($parent_page === null) ? null : $parent_page->getId()
    ],
    [
      'sort'=>'ASC'
    ]);

    // Loop through possible pages until conditions match
    foreach($pages as $page)
    {
      if($this->checkPageConditions($page)){
        $this->getLastSession()->setLastPage($page);
        $this->em->flush();
        return $page;
        break;
      }
    }
  }

  /**
   * Checks conditions assigned to page against current course data variables
   * @param  Page   $page Page entity to check
   * @return boolean - if all conditions are met, or true if no conditions specified
   */
  private function checkPageConditions(Page $page)
  {
    if(0 === count($page->getConditions()))
    {
      return true;
    }

    // All conditions must match for this function to return true
    foreach($page->getConditions() as $condition)
    {
      // Statement - variable, operator, value
      // ([A-Za-z0-9_-](\<|\>|\<=|\>=|=).*)
      if(preg_match("(([A-Za-z0-9_-])(\<|\>|\<=|\>=|=)(.*))", $condition, $re_matches))
      {
        // the condition can be evaluated - variable, operator, value
        $var = $re_matches[0];
        $op = $re_matches[1];
        $val = $re_matches[2];

        $data = $this->course_manager->getData($var);
        // Do comparisons where we will return false if condition not matched
        switch($op)
        {
          case "<":
            if($data >= $val)
            {
              return false;
            }
          break;

          case ">":
            if($data <= $val)
            {
              return false;
            }
          break;

          case "<=":
            if($data > $val)
            {
              return false;
            }
          break;

          case ">=":
            if($data < $val)
            {
              return false;
            }
          break;

          case "=":
            if($data != $val)
            {
              return false;
            }
          break;
        }
        
      }
      elseif(preg_match("([A-Za-z0-9_-])", $condition, $re_matches))
      {
        //the condition can be evaluated, does a variable exist
        $var = $re_matches[0];
        if(!$this->course_manager->getData($var))
        {
          return false;
        }
      }
    }

    return true;
  }

  private function createNewSession()
  {
    // Create a user's first course and add to the database
    $session = new Session();
    $session->setCourse($this->course_manager->course);
    $session->setSession($this->session_availability->week);
    $this->em->persist($session);
    $this->em->flush();
    $this->course_manager->course->sessions[] = $session;
    return $session;
  }
}