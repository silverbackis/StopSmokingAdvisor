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
        $seoPage = $this->container->get('sonata.seo.page');
        $seoPage->setTitle("Dashboard - ".$seoPage->getTitle());

        $session_manager = $this->container->get('app.session_manager');
        $UserSettings = $this->getUserSettings();

        return $this->render('@App/Account/dashboard.html.twig', [
            'session_available' => $session_manager->getSessionAvailability()->isAvailable(),
            'session_expired' => $session_manager->getSessionAvailability()->isExpired(),
            'session_expired_date' => $session_manager->getSessionAvailability()->getExpire()->format("l jS F Y"),
            'session_started' => count($session_manager->getSession()->getViews()) > 0,
            'session_number' => $session_manager->getSession()->getSession(),
            'session_available_date' => $session_manager->getSessionAvailability()->getAvailable()->format("l jS F"),
            'reminder_emails' => $UserSettings->getReminderEmails()
        ]);
    }

    /**
     * @Route("/settings", name="account_settings")
     */
    public function settingsAction(Request $request)
    {
        return $this->redirectToRoute('account_dashboard', ['_fragment' => 'no_settings_page_made']);
    }
    
    /**
     * @Route("/restart", name="account_restart")
     */
    public function restartAction(Request $request)
    {
        $session_manager = $this->container->get('app.session_manager');
        $session_manager->getCourseManager()->createNewCourse();
        return $this->redirectToRoute('account_dashboard', ['_fragment' => 'restarted']);
    }

    private function getUserSettings()
    {
        $em = $this->getDoctrine()->getManager();
        $UserSettings = $em->getRepository('AppBundle\Entity\UserSettings')
            ->findOneBy([
                'user' => $this->get('security.token_storage')->getToken()->getUser()
            ]);

        // Setup settings if not already there
        if(null === $UserSettings)
        {
            $UserSettings = new UserSettings();
            $UserSettings->setUser($this->get('security.token_storage')->getToken()->getUser());
            $em->persist($UserSettings);
            $em->flush();
        }
        return $UserSettings;
    }

    /**
     * @Route("/session/next", name="account_session_next")
     */
    public function sessionActionNext(Request $request)
    {
        // The current page must have no question requirements
        $session_manager = $this->container->get('app.session_manager');
        $page = $session_manager->getCurrentPage();
        $questions = $page->getQuestions();
        $question = $questions[0];
        if($this->isQuestionPresent($question))
        {
            $this->addFlash(
                'danger',
                'Please answer the question before proceeding'
            );
            return $this->redirectToRoute('account_session');
        }

        // If we get here, we can proceed to next page
        return $session_manager->setNextPage();
    }

    /**
     * @Route("/session", name="account_session")
     */
    public function sessionAction(Request $request)
    {
        return $this->sessionPageAction($request);
    }
}