<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

use AppBundle\Entity\UserSettings;


class AccountController extends Controller
{
    /**
     * @Route("/dashboard", name="account_dashboard")
     */
    public function dashboardAction(Request $request)
    {
        $seo_page = $this->container->get('sonata.seo.page');
        $seo_page->setTitle("Dashboard - ".$seo_page->getTitle());

        $course_manager = $this->container->get('app.course_manager');
        $user_settings = $this->container->get('app.user_settings')->getUserSettings();

        $EXPIRE = $course_manager->getCourse()->getSessionExpire();
        $AVAIL = $course_manager->getCourse()->getSessionAvailable();
        return $this->render('@App/Account/dashboard.html.twig', [
            'session_available' => $course_manager->isSessionAvailable(),
            'session_expired' => $course_manager->isSessionExpired(),
            'session_expired_date' => null === $EXPIRE ? null : $EXPIRE->format("l jS F Y"),
            'session_started' => count($course_manager->getCurrentSession()->getViews()) > 0,
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
        return $this->render('@App/Account/settings.html.twig', [
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