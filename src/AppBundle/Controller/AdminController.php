<?php

namespace AppBundle\Controller;

//use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Bundle\FrameworkBundle\Templating\EngineInterface;
use Sonata\SeoBundle\Seo\SeoPage;
use AppBundle\Utils\AdminManageActions;

use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

/**
 * @Route(service="app.admin_manage")
 */
class AdminController
{

    private $templating,
    $seoPage,
    $kernelRoot;

    public function __construct(EngineInterface $templating, SeoPage $seoPage, string $kernelRoot, AdminManageActions $ama)
    {
        $this->templating = $templating;
        $this->seoPage = $seoPage;
        $this->kernelRoot = $kernelRoot;
        $this->adminManageActions = $ama;
    }

    /**
     * @Route("/", name="admin_manage_view")
     */
    public function manageAction(Request $request)
    {
        $this->seoPage->setTitle("Manage page - ".$this->seoPage->getTitle());

        return $this->templating->renderResponse('@App/Admin/manage.html.twig', [
            'base_dir' => realpath($this->kernelRoot.'/..').DIRECTORY_SEPARATOR,
        ]);
    }

    /**
     * @Route("/pages/get/{session}", name="admin_manage_get_pages", requirements={"session": "\d+"})
     * @Method({"GET"})
     */
    public function manageGetSessionPages($session, Request $request)
    {
        return $this->adminManageActions->getSessionPages($session);
    }

    /**
     * @Route("/page/add", name="admin_manage_add")
     * @Method({"POST"})
     */
    public function manageAddAction(Request $request)
    {
        return $this->adminManageActions->addPage($request);
    }

    /**
     * @Route("/page/delete/{pageID}", name="admin_manage_delete", requirements={"pageID": "\d+"})
     * @Method({"GET"})
     */
    public function manageDeleteAction($pageID, Request $request)
    {
        return $this->adminManageActions->deletePage($pageID);
    }

    /**
     * @Route("/page/move/{pageID}", name="admin_manage_move", requirements={"pageID": "\d+"})
     * @Method({"POST"})
     */
    public function manageMoveAction($pageID, Request $request)
    {
        return $this->adminManageActions->movePage($pageID, $request);
    }

    /**
     * @Route("/page/copy/{pageID}", name="admin_manage_copy", requirements={"pageID": "\d+"})
     * @Method({"POST"})
     */
    public function manageCopyAction($pageID, Request $request)
    {
        return $this->adminManageActions->copyPage($pageID, $request);
    }

    /**
     * @Route("/condition/add", name="admin_manage_add_condition")
     * @Method({"POST"})
     */
    public function manageConditionAddAction(Request $request)
    {
        return $this->adminManageActions->addCondition($request);
    }

    /**
     * @Route("/condition/delete/{id}", name="admin_manage_delete_condition", requirements={"id": "\d+"})
     * @Method({"GET"})
     */
    public function manageConditionDeleteAction($id, Request $request)
    {
        return $this->adminManageActions->deleteCondition($id);
    }
}