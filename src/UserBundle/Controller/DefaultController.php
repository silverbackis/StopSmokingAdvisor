<?php

namespace UserBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\RedirectResponse;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class DefaultController extends Controller
{
    /**
     * @Route("/email/confirm/{token}", name="user_email_confirm")
     */
    public function confirmEmailAction(Request $request, $token)
    {
        /** @var $userManager \FOS\UserBundle\Model\UserManagerInterface */
        $userManager = $this->get('fos_user.user_manager');

        $user = $userManager->findUserBy([
          'email_change_confirmation_token' => $token
        ]);

        if (null === $user) {
            throw new NotFoundHttpException(sprintf('The user with email confirmation token "%s" does not exist', $token));
        }

        $user->setEmailChangeConfirmationToken(null);
        $user->setEmail($user->getEmailNew());
        $user->setEmailNew(null);
        $user->setEnabled(true);
        $userManager->updateUser($user);

        $this->addFlash('success', 'Your email address has been updated');
        $url = $this->generateUrl('account_settings');
        $response = new RedirectResponse($url);

        return $response;
    }
}
