<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

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
        return $this->render('@App/Account/dashboard.html.twig', [
            'course' => $session_manager->course_manager->course,
            'session_availability' => $session_manager->getSessionAvailability()
        ]);
    }

    /**
     * @Route("/session", name="account_session")
     */
    public function sessionAction(Request $request)
    {
        $seoPage = $this->container->get('sonata.seo.page');
        $seoPage->setTitle("Session - ".$seoPage->getTitle());

        $session_manager = $this->container->get('app.session_manager');
        $page = $session_manager->getSessionPage();
        if($page === false)
        {
            // No page available, return user to dashboard
            $request->getSession()->getFlashBag()->add('notice', 'Sorry but it appears the session you are trying to access has expired.');
            return $this->redirectToRoute('account_dashboard');
        }
        return $this->render('@App/Account/session.html.twig', [
            'page' => $page
        ]);
    }
}