<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
//Use `BWCore\AssetsBundle\Controller\DefaultController` instead of `Symfony\Bundle\FrameworkBundle\Controller\Controller`
use BW\AssetsBundle\Controller\DefaultController as Controller;
use FOS\UserBundle\Form\Factory\FactoryInterface;
use Symfony\Component\Translation\Translator;
use Symfony\Component\HttpFoundation\RedirectResponse;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {
        if($this->get('security.authorization_checker')->isGranted('IS_AUTHENTICATED_FULLY')) {
            $nextURL = $this->getParameter('login_default_target');
            $roles = $this->getUser()->getRoles();
            if(in_array('ROLE_ADMIN', $roles)){
                $nextURL =  $this->getParameter('login_admin_target');
            }
            return new RedirectResponse( $nextURL );
        }
        /** @var $formFactory FactoryInterface */
        $formFactory = $this->get('fos_user.registration.form.factory');
        $form = $formFactory->createForm();

        $csrfToken = $this->has('security.csrf.token_manager')
            ? $this->get('security.csrf.token_manager')->getToken('authenticate')->getValue()
            : null;

        return $this->render('@App/Default/index.html.twig', [
            'form' => $form->createView(),
            'csrf_token' => $csrfToken
        ]);
    }

    /**
     * @Route("/terms", name="terms_page")
     */
    public function termsAction(Request $request)
    {
        $seoPage = $this->container->get('sonata.seo.page');
        $seoPage->setTitle("Terms &amp; Privacy - ".$seoPage->getTitle());

        return $this->render('@App/Default/terms.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.root_dir').'/..').DIRECTORY_SEPARATOR,
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

    /**
     * @Route("/account/dashboard", name="dashboard")
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