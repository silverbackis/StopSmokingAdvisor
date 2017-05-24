<?php

namespace UserBundle\Mailer;

use FOS\UserBundle\Mailer\TwigSwiftMailer as BaseMailer;
use FOS\UserBundle\Model\UserInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class TwigSwiftMailer extends BaseMailer
{
    /**
     * {@inheritdoc}
     */
    public function sendConfirmationEmailChangeMessage(UserInterface $user)
    {
        $template = $this->parameters['template']['confirmation'];
        $url = $this->router->generate('user_email_confirm', array('token' => $user->getEmailChangeConfirmationToken()), UrlGeneratorInterface::ABSOLUTE_URL);

        $context = array(
            'user' => $user,
            'confirmationUrl' => $url,
        );

        $this->sendMessage($template, $context, $this->parameters['from_email']['confirmation'], (string) $user->getEmailNew());
    }
}