<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class AdminController extends Controller
{
    /**
     * @Route("/manage", name="admin_manage")
     */
    public function manageAction(Request $request)
    {
        $seoPage = $this->container->get('sonata.seo.page');
        $seoPage->setTitle("Manage page - ".$seoPage->getTitle());

        return $this->render('@App/Admin/manage.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.root_dir').'/..').DIRECTORY_SEPARATOR,
        ]);
    }
}