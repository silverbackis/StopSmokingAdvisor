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

        return $this->render('@App/Account/dashboard.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.root_dir').'/..').DIRECTORY_SEPARATOR,
        ]);
    }
}