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
    public function getSessionPages($session, Request $request)
    {
        return $this->adminManageActions->getSessionPages($session);
    }

    /**
     * @Route("/pages/search/{session}", name="admin_manage_search_pages", requirements={"session": "\d+"})
     * @Method({"POST"})
     */
    public function searchSessionPages($session, Request $request)
    {
        return $this->adminManageActions->searchSessionPages($session, $request);
    }

    /**
     * @Route("/page/add", name="admin_manage_add_page")
     * @Method({"POST"})
     */
    public function addPageAction(Request $request)
    {
        return $this->adminManageActions->addPage($request);
    }

    /**
     * @Route("/page/update/{id}", name="admin_manage_update_page", requirements={"id": "\d+"})
     * @Method({"POST"})
     */
    public function updatePageAction(int $id, Request $request)
    {
        return $this->adminManageActions->updatePage($id, $request);
    }

    /**
     * @Route("/page/delete/{id}", name="admin_manage_delete_page", requirements={"id": "\d+"})
     * @Method({"GET"})
     */
    public function deletePageAction(int $id, Request $request)
    {
        return $this->adminManageActions->deletePage($id);
    }

    /**
     * @Route("/page/move/{id}", name="admin_manage_move_page", requirements={"id": "\d+"})
     * @Method({"POST"})
     */
    public function movePageAction(int $id, Request $request)
    {
        return $this->adminManageActions->movePage($id, $request);
    }

    /**
     * @Route("/page/copy/{id}", name="admin_manage_copy_page", requirements={"id": "\d+"})
     * @Method({"POST"})
     */
    public function copyPageAction(int $id, Request $request)
    {
        return $this->adminManageActions->copyPage($id, $request);
    }

    /**
     * @Route("/condition/add", name="admin_manage_add_condition")
     * @Method({"POST"})
     */
    public function addConditionAction(Request $request)
    {
        return $this->adminManageActions->addCondition($request);
    }

    /**
     * @Route("/condition/delete/{id}", name="admin_manage_delete_condition", requirements={"id": "\d+"})
     * @Method({"GET"})
     */
    public function deleteConditionAction(int $id, Request $request)
    {
        return $this->adminManageActions->deleteCondition($id);
    }
}