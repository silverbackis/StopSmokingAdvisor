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
  private $week;
  
  // Session in the database if it exists (has been staretd already)
  private $session_entity;

  protected $quit_date;
  
  public function __construct(Session $session = null, string $quit_date = null)
  {
    $this->quit_date = null === $quit_date ? null : new \DateTime($quit_date);
    $this->session_entity = $session;
    $this->setAvailability();
    return $this;
  }

  private function setAvailability()
  {
    if($this->session_entity->getCompleted())
    {
      $this->setAvailable(new \DateTime("-1 Minutes"));
      $this->setExpire(new \DateTime("-1 Minutes"));
    }
    elseif(1===$this->week || null === $this->quit_date)
    {
      $this->setAvailable(new \DateTime("Now"));
      $this->setExpire(new \DateTime("+1 Minutes"));
    }
    else
    {
      // The available from and expiry dates will be based on the week number and the quit date
      
      // Get the quit date variable for the course
      $quitDate = $this->quit_date;
      
      // Set to midnight of the quit date
      $quitDate->setTime(0, 0, 0);

      $daysFromQuitAvailable = (($this->session_entity->getSession()-1)*7);
      $available = clone $quitDate;
      $this->setAvailable($available->modify("+$daysFromQuitAvailable days"));

      $expire = clone $available;
      $this->setExpire($expire->modify("+6 days"));
    }
  }

  /**
   * isAvailable checks whether the session should be available
   * @return boolean - is the session available now
   */
  public function isAvailable()
  {
    $now = new \DateTime();
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

  public function isExpired()
  {
    $now = new \DateTime();
    return $now > $this->expire;
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
}