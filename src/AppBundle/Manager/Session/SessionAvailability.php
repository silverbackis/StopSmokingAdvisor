<?php
namespace AppBundle\Manager\Session;

use AppBundle\Entity\Session;

class SessionAvailability
{
  // Timestamp when session is available
  protected $available;
  
  // Timestamp when session will expire
  protected $expire;
  
  // Week number
  public $week;
  
  // Session in the database if it exists (has been staretd already)
  private $session_entity;

  protected $quit_date;
  
  public function __construct(Session $session = null, \DateTime $quit_date = null)
  {
    $this->quit_date = $quit_date;
    $this->setSessionEntity($session);
    $this->setCurrentSession();    
    return $this;
  }

  /**
   * isAvailable checks whether the session should be available
   * @return boolean - is the session available now
   */
  public function isAvailable()
  {
    $now = new DateTime();
    return ($now > $this->available && $now < $this->expire);
  }

  public function getAvailable()
  {
    return $this->available;
  }

  public function getExpire()
  {
    return $this->expire;
  }

  public function getWeek()
  {
    return $this->week;
  }

  public function isSessionEntity()
  {
    return $this->session_entity!==null;
  }

  private function setCurrentSession()
  {
    // No session from database yet for current course, initial session always available
    if(null === $this->session_entity)
    {
      $this->setWeek(1);
    }
    elseif(!$this->session_entity->getCompleted())
    {
      // The session in the database is the available session to set available and expiry times as it has not been completed yet (was started)
      $this->setWeek($this->session_entity->getSession());
    }
    else
    {
      // The session in the database is completed, which means we are setting available and expiry dates for the next session.
      $this->setWeek($this->session_entity->getSession()+1);
      // The session entity is nothing to do with the week we are returning the data for, set to null to avoid any confusion
      $this->setSessionEntity(null);
    }
    $this->setAvailability();
  }

  private function setAvailability()
  {
    if(1===$this->week)
    {
      $this->setAvailable(new \DateTime("Now"));
      $this->setExpire(new \DateTime("+5 Minutes"));
    }
    else
    {
      // The available from and expiry dates will be based on the week number and the quit date
      
      // Get the quit date variable for the course
      $quitDate = $this->quit_date;
      
      // Set to midnight of the quit date
      $quitDate->setTime(0, 0, 0);

      $daysFromQuitAvailable = (($this->week-2)*7);

      $this->setAvailable($quitDate->modify("+$daysFromQuitAvailable days"));
      $this->setExpire($quitDate->modify("+6 days"));
    }
  }

  private function setWeek(int $week = 1)
  {
    $this->week = $week;
    return $this;
  }

  private function setAvailable(\DateTime $date)
  {
    $this->available = $date;
    return $this;
  }

  private function setExpire(\DateTime $date)
  {
    $this->expire = $date;
    return $this;
  }

  private function setSessionEntity(Session $session = null)
  {
    $this->session_entity = $session;
  }
}