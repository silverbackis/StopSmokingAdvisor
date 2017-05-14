<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Templating\EngineInterface;
use Sonata\SeoBundle\Seo\SeoPage;
use AppBundle\Utils\AdminManageActions;
use AppBundle\Manager\SessionManager;

use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use PlUploadBundle\Utils\PlUploadHandler;
/**
 * @Route(service="app.admin_manage")
 */
class AdminController
{

    private $templating,
    $seoPage,
    $kernelRoot,
    $PlHandler,
    $sessionManager;

    public function __construct(EngineInterface $templating, SeoPage $seoPage, string $kernelRoot, AdminManageActions $ama, PlUploadHandler $PlHandler, SessionManager $sessionManager)
    {
        // for the default tree page
        $this->templating = $templating;
        $this->seoPage = $seoPage;
        $this->kernelRoot = $kernelRoot;

        // ajax actions
        $this->adminManageActions = $ama;

        // upload (plupload) service
        $this->PlHandler = $PlHandler;
        $this->sessionManager = $sessionManager;
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
     * @Route("/preview/{id}", name="admin_preview", requirements={"id": "\d+"})
     */
    public function previewAction($id, Request $request)
    {
        return $this->sessionManager->sessionPageAction($request, $id);
    }

    /**
     * @Route("/pages/get/{session}", name="admin_get_pages", requirements={"session": "\d+"})
     * @Method({"GET"})
     */
    public function getSessionPages($session, Request $request)
    {
        return $this->adminManageActions->getSessionPages($session);
    }

    /**
     * @Route("/page/get/{id}", name="admin_get_page", requirements={"id": "\d+"})
     * @Method({"GET"})
     */
    public function getPage($id, Request $request)
    {
        return $this->adminManageActions->getPage($id);
    }

    /**
     * @Route("/pages/search/{session}", name="admin_search_pages", requirements={"session": "\d+"})
     * @Method({"POST"})
     */
    public function searchSessionPages($session, Request $request)
    {
        return $this->adminManageActions->searchSessionPages($session, $request);
    }

    /**
     * @Route("/page/add", name="admin_add_page")
     * @Method({"POST"})
     */
    public function addPageAction(Request $request)
    {
        return $this->adminManageActions->addPage($request);
    }

    /**
     * @Route("/page/update/{id}", name="admin_update_page", requirements={"id": "\d+"})
     * @Method({"POST"})
     */
    public function updatePageAction(int $id, Request $request)
    {
        return $this->adminManageActions->updatePage($id, $request);
    }

    /**
     * @Route("/page/delete/{id}", name="admin_delete_page", requirements={"id": "\d+"})
     * @Method({"GET"})
     */
    public function deletePageAction(int $id, Request $request)
    {
        return $this->adminManageActions->deletePage($id);
    }

    /**
     * @Route("/page/move/{id}", name="admin_move_page", requirements={"id": "\d+"})
     * @Method({"POST"})
     */
    public function movePageAction(int $id, Request $request)
    {
        return $this->adminManageActions->movePage($id, $request);
    }

    /**
     * @Route("/page/copy/{id}", name="admin_copy_page", requirements={"id": "\d+"})
     * @Method({"POST"})
     */
    public function copyPageAction(int $id, Request $request)
    {
        return $this->adminManageActions->copyPage($id, $request);
    }

    /**
     * @Route("/condition/add", name="admin_add_condition")
     * @Method({"POST"})
     */
    public function addConditionAction(Request $request)
    {
        return $this->adminManageActions->addCondition($request);
    }

    /**
     * @Route("/condition/delete/{id}", name="admin_delete_condition", requirements={"id": "\d+"})
     * @Method({"GET"})
     */
    public function deleteConditionAction(int $id, Request $request)
    {
        return $this->adminManageActions->deleteCondition($id);
    }

    /**
     * @Route("/page/upload/{id}", name="admin_upload_file", requirements={"id": "\d+"})
     * @Method({"POST"})
     */
    public function uploadAction(int $id, Request $request)
    {
        $file = $this->PlHandler->handle($request);
        if ($file instanceof JsonResponse) {
            return $data;
        }
        // file is a string with a path to the filename
        $request->request->set('imagePath', $file);
        $request->request->remove('name');
        return $this->adminManageActions->updatePage($id, $request, true);
    }

    /**
     * @Route("/question/update/{id}", name="admin_update_question", requirements={"id": "\d+"})
     * @Method({"POST"})
     */
    public function updateQuestionAction(int $id, Request $request)
    {
        return $this->adminManageActions->updateQuestion($id, $request);
    }

    /**
     * @Route("/answer/add", name="admin_add_answer")
     * @Method({"POST"})
     */
    public function addAnswerAction(Request $request)
    {
        return $this->adminManageActions->addAnswer($request);
    }

    /**
     * @Route("/answer/update/{id}", name="admin_update_answer", requirements={"id": "\d+"})
     * @Method({"POST"})
     */
    public function updateAnswerAction(int $id, Request $request)
    {
        return $this->adminManageActions->updateAnswer($id, $request);
    }

    /**
     * @Route("/answer/delete/{id}", name="admin_delete_answer", requirements={"id": "\d+"})
     * @Method({"GET"})
     */
    public function deleteAnswerAction(int $id, Request $request)
    {
        return $this->adminManageActions->deleteAnswer($id);
    }
}