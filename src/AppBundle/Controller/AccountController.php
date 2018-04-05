<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

use AppBundle\Entity\UserSettings;
use UserBundle\Form\ChangeSettingsType;

class AccountController extends Controller
{
    /**
     * @Route("/dashboard", name="account_dashboard")
     */
    public function dashboardAction(Request $request)
    {
        $seo_page = $this->container->get('sonata.seo.page');
        $seo_page->setTitle('Dashboard - ' .$seo_page->getTitle());

        $course_manager = $this->container->get('app.course_manager');
        $user_settings = $this->container->get('app.user_settings')->getUserSettings();

        $EXPIRE = $course_manager->getCourse()->getSessionExpire();
        $AVAIL = $course_manager->getCourse()->getSessionAvailable();
        return $this->render('@App/Account/dashboard.html.twig', [
            'session_available' => $course_manager->isSessionAvailable(),
            'session_expired' => $course_manager->isSessionExpired(),
            'session_expired_date' => null === $EXPIRE ? null : $EXPIRE->format("l jS F Y"),
            'session_started' => \count($course_manager->getCurrentSession()->getViews()) > 0,
            'session_number' => $course_manager->getCurrentSession()->getSession(),
            'session_available_date' => null === $AVAIL ? null : $AVAIL->format("l jS F"),
            'weekly_spend' => $course_manager->getData('weekly_spend'),
            'quit_date' =>$course_manager->getData('quit_date'),
            'reminder_emails' => $user_settings->getReminderEmails()
        ]);
    }

    /**
     * @Route("/settings", name="account_settings")
     */
    public function settingsAction(Request $request)
    {
        $user = $this->getUser();

        $formFactoryEmail = $this->get('user.form.change_email.factory');
        $formEmail = $formFactoryEmail->createForm();
        $formEmail->setData($user);
        $formEmail->handleRequest($request);
        // Handle the email form having been submitted
        if ($formEmail->isSubmitted() && $formEmail->isValid()) {
            $em = $this->getDoctrine()->getManager();
            
            // Now we know the email address is valid - What was email changed to? Save it as a var
            $new_email = $user->getEmail();
            $old_new_email = $user->getEmailNew();
            
            // Refresh user from the database again
            $em->refresh($user);

            if ($new_email == $user->getEmail()) {
                $user->setEmailNew(null);
            } else {
                if ($old_new_email == $new_email) {
                    $this->addFlash(
                        'success',
                        'Confirmation email resent'
                    );
                }
                // Now set the new email to another column
                $user->setEmailNew($new_email);
                // Set a confirmation token if one doesn't already exist to the updated email
                if (null === $user->getEmailChangeConfirmationToken()) {
                    $user->setEmailChangeConfirmationToken($this->get('fos_user.util.token_generator')->generateToken());
                }
                $this->get('fos_user.mailer')->sendConfirmationEmailChangeMessage($user);
                $request->getSession()->set('fos_user_send_confirmation_email/email', $user->getEmailNew());
            }
            
            // Make the form again with the correct user data
            $formEmail = $formFactoryEmail->createForm();
            $formEmail->setData($user);

            $em->flush();
        }

        $formFactoryPassword = $this->get('fos_user.change_password.form.factory');
        $formPassword = $formFactoryPassword->createForm();
        $formPassword->setData($user);
        $formPassword->handleRequest($request);
        // This is handled by FOSUserBundle but forwarded back to this action

        $user_settings = $this->container->get('app.user_settings')->getUserSettings();
        $formNotifications = $this->createForm(ChangeSettingsType::class, $user_settings);
        $formNotifications->handleRequest($request);
        // Handle the notification form having been submitted
        if ($formNotifications->isSubmitted() && $formNotifications->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->flush();
            $this->addFlash(
                'success',
                'Notification preferences updated'
            );
        }

        return $this->render('@App/Account/settings.html.twig', [
            'email_new' => $user->getEmailNew(),
            'form_email' => $formEmail->createView(),
            'form_password' => $formPassword->createView(),
            'form_notifications' => $formNotifications->createView()
        ]);
    }
    
    /**
     * @Route("/restart", name="account_restart")
     */
    public function restartAction(Request $request)
    {
        $this->container->get('app.course_manager')->createNewCourse();
        return $this->redirectToRoute('account_dashboard', ['_fragment' => 'restarted']);
    }

    /**
     * @Route("/session/next", name="account_session_next")
     */
    public function sessionActionNext(Request $request)
    {
        // The current page must have no question requirements
        $course_manager = $this->container->get('app.course_manager');
        
        return $course_manager->nextPageAction();
    }

    /**
     * @Route("/session", name="account_session")
     */
    public function sessionAction(Request $request)
    {
        return $this->container->get('app.course_manager')->sessionPageAction($request);
    }
}
