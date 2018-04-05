<?php

namespace UserBundle\EventListener;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;

use FOS\UserBundle\FOSUserEvents;
use FOS\UserBundle\Event\FormEvent;

use Symfony\Bundle\FrameworkBundle\Routing\Router;
use Symfony\Component\HttpFoundation\RedirectResponse;

class UserChangePasswordListener implements EventSubscriberInterface
{
    private $router;

    public function __construct(Router $router)
    {
        $this->router = $router;
    }

    /**
     * {@inheritdoc}
     */
    public static function getSubscribedEvents()
    {
        return array(
            FOSUserEvents::CHANGE_PASSWORD_SUCCESS => 'onChangePasswordSuccess'
        );
    }

    public function onChangePasswordSuccess(FormEvent $event)
    {
        $response = new RedirectResponse($this->router->generate('account_settings'));
        $event->setResponse($response);
    }
}
