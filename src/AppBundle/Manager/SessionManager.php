<?php
namespace AppBundle\Manager;
use AppBundle\Entity\Session;
use AppBundle\Entity\Page;
use AppBundle\Entity\SessionPageView;
use AppBundle\Manager\Session\SessionAvailability;

use Doctrine\ORM\EntityManager;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;

class SessionManager {
  private $em;
  private $course_manager = null;
  private $session_availability = null;
  private $session = null;
  private $last_page;
  private $current_page;
  private $router;
  private $max_pages_remain = 0;

  public function __construct(EntityManager $em, CourseManager $course_manager, RouterInterface $router)
  {
    $this->em = $em;
    $this->course_manager = $course_manager;
    $this->router = $router;
    $this->setSession();
  }


  private function setSession()
  {
    if(0 === count($this->course_manager->getCourse()->getSessions()))
    {
      // No sessions in DB in database - create 1st session
      $this->session = $this->createNewSession();
    }
    else
    {
      $allSessions = $this->course_manager->getCourse()->getSessions()->toArray();
      $this->session = end($allSessions);

      if($this->session->getCompleted())
      {
        // The session entity already there is finished - no good. Create the next session
        $this->session = $this->createNewSession($this->session->getSession()+1);
      }
    }

    $this->session_availability = new SessionAvailability($this->session, $this->course_manager->getData('quit_date'));
    $this->last_page = $this->session->getLastPage();

    if(!$this->session_availability->isAvailable())
    {
      $this->current_page = false;
    }    
    elseif(null !== $this->last_page && $this->last_page->getLive())
    // Check for the last page id that was viewed to continue
    {
      // Find the last page and return if it still exists and is available
      $this->current_page = $this->last_page;
    }
    else
    {
      $this->current_page = $this->findPage($this->session->getSession(), null);
      $this->session->setLastPage($this->current_page);
      $this->em->flush();
    }
  }

  public function getSession()
  {
    return $this->session;
  }

  public function getSessionAvailability()
  {
    return $this->session_availability;
  }

  public function getCourseManager()
  {
    return $this->course_manager;
  }

  public function getCurrentPage()
  {
    return $this->current_page;
  }

  public function getPageTitle(Page $page)
  {
    $sessionNumber = $page->getSession();
    switch($sessionNumber)
    {
      case 1:
        return 'Introduction';
      break;

      case 5:
        return 'The Final Stretch - Week 4';
      break;

      case 6:
        return 'Well Done - Keep It Up!';
      break;

      default:
        return 'SmokeFree Week '.($sessionNumber-1);
      break;
    }
  }

  public function setNextPage()
  {
    $NextPage = $this->findPage($this->session->getSession(), $this->current_page);
    if(null === $NextPage)
    {
      $this->session->setLastPage(null);
      $this->session->setCompleted(true);
      $this->em->flush();
      return new RedirectResponse($this->router->generate('account_dashboard'));
    }
    else
    {
      $this->session->setLastPage($NextPage);
      $this->em->flush();
      return new RedirectResponse($this->router->generate('account_session'));
    }
  }

  public function recordPageView()
  {
    $SessionView = $this->em->getRepository('AppBundle\Entity\SessionPageView')
      ->findOneBy([
          'course' => $this->course_manager->getCourse(),
          'session' => $this->session,
          'page_viewed' => $this->current_page
      ]);
    if(null === $SessionView)
    {
      // create the row
      $SessionView = new SessionPageView();
      $SessionView->setCourse($this->course_manager->getCourse());
      $SessionView->setSession($this->session);
      $SessionView->setPageViewed($this->current_page);
      $SessionView->setViews(1);
      $this->em->persist($SessionView);
    }
    else
    {
      $SessionView->setViews($SessionView->getViews()+1);
    }

    //This updating database prematurely with CourseData which is modified after this...
    $this->em->flush();
    
    $this->getSessionProgress();

    return;
  }

  public function getSessionProgress()
  {
    // This includes the page we are on by now
    $TotalPagesViewed = count($this->session->getViews())-0.5;
    $children[$this->current_page->getId()] = $this->getChildren($this->current_page);

    $MaxTotalPages = $this->max_pages_remain+$TotalPagesViewed+0.5;
    $PercViewed = round(($TotalPagesViewed/$MaxTotalPages)*100, 2);
    return $PercViewed;
  }

  private function getChildren(Page $page, $parentIds = [], $depth = 0)
  {
    if(!$page->getLive())
    {
      return [];
    }

    $parentIds[] = $page->getId();
    $children = [];
    if($depth > $this->max_pages_remain)
    {
      $this->max_pages_remain = $depth;
    }
    if($page->getType()==='page') 
    {
      foreach($page->getChildren() as $child)
      {
        if($child->getType()==='page') 
        {
          $key = $child->getId();
          // check if page ID already visited in parents (linear)
          if(in_array($child->getId(), $parentIds))
          {
            $children[$key] = [];
          }
          else
          {
            $children[$key] = $this->getChildren($child, $parentIds, $depth+1);
          }
        }
        else
        {
          $linked_child = $child->getForwardToPage();
          $key = 'l_'.$linked_child->getId();

          // check if page ID already visited in parents (linear)
          if(in_array($linked_child->getId(), $parentIds))
          {
            $children[$key] = [];
          }
          else
          {
            $children[$key] = $this->getChildren($linked_child, $parentIds, $depth+1);
          }
        }
      }
    }

    return $children;
  }

  private function createNewSession(int $SessionNumber = 1)
  {
    // Create a user's first course and add to the database
    $session = new Session();
    $session->setCourse($this->course_manager->getCourse());
    $session->setSession($SessionNumber);
    $this->em->persist($session);
    $this->em->flush();
    $this->course_manager->getCourse()->sessions[] = $session;
    return $session;
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
        // check if it's a 'Go To'
        if($page->getType()==='link')
        {
          // We may be trying to be forwarded to a page that isn't live - we don't want that, skip the goto if that's the case
          $GoToPage = $page->getForwardToPage();
          if(!$GoToPage->getLive())
          {
            continue;
          }
          return $GoToPage;
        }
        else
        {
          return $page;
        }
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
      // /^(([a-z0-9_-]+)([\<|\>|\<=|\>=|=])(.+)|([a-z0-9_-]+))$/i
      
      // e.g. var=123
      if(preg_match("/^([a-z0-9_-]+)([\<|\>|\<=|\>=|=])(.+)$/i", $condition->getCondition(), $re_matches))
      {
        // the condition can be evaluated - variable, operator, value
        $var = trim($re_matches[1]);
        $op = trim($re_matches[2]);
        $val = trim($re_matches[3]);
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
          case "==":
            if($data != $val)
            {
              return false;
            }
          break;
        }
      }
      // e.g. var (variable exists and not null or false)
      elseif(preg_match("/^([a-z0-9_-]+)$/i", $condition->getCondition(), $re_matches))
      {
        //the condition can be evaluated, does a variable exist
        $var = $re_matches[1];
        if(!$this->course_manager->getData($var))
        {
          return false;
        }
      }
    }

    return true;
  }
}