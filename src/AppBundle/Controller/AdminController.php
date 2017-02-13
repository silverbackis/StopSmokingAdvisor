<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
//Use `BWCore\AssetsBundle\Controller\DefaultController` instead of `Symfony\Bundle\FrameworkBundle\Controller\Controller`
use BW\AssetsBundle\Controller\DefaultController as Controller;
use FOS\UserBundle\Form\Factory\FactoryInterface;
use Symfony\Component\Translation\Translator;
use Symfony\Component\HttpFoundation\RedirectResponse;

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