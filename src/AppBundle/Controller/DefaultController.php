<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
//Use `BWCore\AssetsBundle\Controller\DefaultController` instead of `Symfony\Bundle\FrameworkBundle\Controller\Controller`
use BW\AssetsBundle\Controller\DefaultController as Controller;

use FOS\UserBundle\Form\Factory\FactoryInterface;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {
        /** @var $formFactory FactoryInterface */
        $formFactory = $this->get('fos_user.registration.form.factory');
        $form = $formFactory->createForm();

        return $this->render('@App/Default/index.html.twig', [
            'form' => $form->createView()
        ]);
    }

    /**
     * @Route("/admin/manage", name="manage")
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