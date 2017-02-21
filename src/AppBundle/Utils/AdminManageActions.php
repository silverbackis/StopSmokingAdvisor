<?php

namespace AppBundle\Utils;

use Doctrine\ORM\EntityManager;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\HttpFoundation\Request;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;
use AppBundle\Entity\Page;
use AppBundle\Entity\Condition;
use Symfony\Component\Validator\ConstraintViolation;

class AdminManageActions
{
	private $doctrine,
	$serializer,
	$validator,
	$response;

	public function __construct(EntityManager $doctrine, ValidatorInterface $validator)
	{
		$this->doctrine = $doctrine;
		$this->validator = $validator;

		$encoders = array(new JsonEncoder());
		$normalizer = new ObjectNormalizer();

		//instead of a circular reference where we would continue looping around the  parent and children, just return the parent's ID
		$normalizer->setCircularReferenceHandler(function ($object) {
		    return $object->getId();
		});

		$normalizers = array($normalizer);
		$this->serializer = new Serializer($normalizers, $encoders);

		$this->response = new JsonResponse();
	}

	public function getSessionPages(int $session)
	{
		$pages = $this->doctrine->getRepository('AppBundle\Entity\Page')->findBy(array('session' => $session, 'parent' => null), array('sort'=>'ASC'));
		
		$this->response->setContent($this->serializer->serialize($pages, 'json', ['json_encode_options' => JSON_PRETTY_PRINT]));
		$this->response->setStatusCode(JsonResponse::HTTP_OK);
		return $this->response;
	}

	public function addPage(Request $request)
	{	
		$data = $this->getData($request, ['session', 'sort', 'parent']);
		if ($data instanceof JsonResponse) {
			return $data;
		}

		//create and populate entity
		$page = new Page();
		$page->setSession($data['session']);
		$page->setSort($data['sort']);
		$page->setParentById($data['parent']);
		if(isset($data['type']))
		{
			$page->setType($data['type']);
		}

		// run validation
		$validResponse = $this->validatePage($page);
		if ($validResponse instanceof JsonResponse) {
			return $validResponse;
		}

		$this->updateOrder($data['parent'], $data['sort'], "+1");

	    //persist to the database
	    $this->doctrine->persist($page);
	    $this->doctrine->flush();

		$this->response->setContent($this->serializer->serialize($page, 'json', ['json_encode_options' => JSON_PRETTY_PRINT]));
		$this->response->setStatusCode(JsonResponse::HTTP_OK);
		return $this->response;
	}

	public function copyPage(int $pageID, Request $request)
	{
		$data = $this->getData($request, ['sort', 'parent']);
		if ($data instanceof JsonResponse) {
			return $data;
		}

		$page = $this->getPage($pageID);
		if (!$page instanceof Page) {
			return $page;
		}

    	$pageCopy = clone $page;
    	$pageCopy->setParentById($data['parent']);
    	$pageCopy->setSort($data['sort']);
    	
    	// run validation
		$validResponse = $this->validatePage($pageCopy);
		if ($validResponse instanceof JsonResponse) {
			return $validResponse;
		}

    	$this->updateOrder($data['parent'], $data['sort'], "+1");

	    //persist new page the database
	    $this->doctrine->persist($pageCopy);
	    $this->doctrine->flush();

		$this->response->setContent($this->serializer->serialize($pageCopy, 'json', ['json_encode_options' => JSON_PRETTY_PRINT]));
		$this->response->setStatusCode(JsonResponse::HTTP_OK);
		return $this->response;
	}

	public function movePage(int $pageID, Request $request)
	{
		$data = $this->getData($request, ['sort', 'parent']);
		if ($data instanceof JsonResponse) {
			return $data;
		}

		$page = $this->getPage($pageID);
		if (!$page instanceof Page) {
			return $page;
		}

		$oldInfo = array(
			'parent'=>(null == $page->getParent() ? null : $page->getParent()->getId()),
			'sort'=> $page->getSort()
		);

		$page->setParentById($data['parent']);
		$page->setLastUpdated(new \DateTime());
    	$page->setSort($data['sort']);
    	
    	// run validation
		$validResponse = $this->validatePage($page);
		if ($validResponse instanceof JsonResponse) {
			return $validResponse;
		}
		$this->doctrine->flush();

		//Update order of other entities where page is moving FROM
		$this->updateOrder($oldInfo['parent'], $oldInfo['sort'], "-1", $page->getId());

	    //Update order of other entities where page is moving TO
	    $this->updateOrder($data['parent'], $data['sort'], "+1", $page->getId());

		$this->response->setContent($this->serializer->serialize($page, 'json', ['json_encode_options' => JSON_PRETTY_PRINT]));
		$this->response->setStatusCode(JsonResponse::HTTP_OK);
		return $this->response;
	}

	public function deletePage(int $pageID)
	{
		$page = $this->getPage($pageID);
		if (!$page instanceof Page) {
			return $page;
		}

		//check it isn't the last root node page of the session
		if(null === $page->getParent())
		{
			// it is a root page, so check if there is at least 1 other
			$totalSessionRootNodes = (int) $this->doctrine->createQueryBuilder()
				->select('COUNT(p.id)')
				->from('AppBundle\Entity\Page', 'p')
				->where('p.parent IS NULL AND p.session = :session AND p.type = :pagetype')
				->setParameter('session', $page->getSession())
				->setParameter('pagetype', 'page')
				->getQuery()
				->getSingleScalarResult();
			
			if($totalSessionRootNodes === 1)
			{
				$this->response->setData(array(
	    			"errors"=>"You cannot delete this page because it will result in there being no pages in session ".$page->getSession()."."
	    		));
	    		$this->response->setStatusCode(JsonResponse::HTTP_BAD_REQUEST);
				return $this->response;
			}
		}

    	// update order of other items so no gaps in the order values
	    $this->updateOrder((null == $page->getParent() ? null : $page->getParent()->getId()), $page->getSort(), "-1");
	    
	    // remove the page that was requested
    	$this->doctrine->remove($page);
    	$this->doctrine->flush();

	    $this->response->setContent($this->serializer->serialize(array("result"=>true), 'json', ['json_encode_options' => JSON_PRETTY_PRINT]));
		$this->response->setStatusCode(JsonResponse::HTTP_OK);
		return $this->response;
	}

	public function addCondition(Request $request)
	{
		$data = $this->getData($request, ['pageID', 'condition']);
		if ($data instanceof JsonResponse) {
			return $data;
		}

		$pageID = $data['pageID'];
		$page = $this->getPage($pageID);
		if (!$page instanceof Page) {
			return $page;
		}

		$condition = new Condition();
		$condition->setCondition($data['condition']);
		$condition->setPage($page);

		$validResponse = $this->validatePage($condition);
		if ($validResponse instanceof JsonResponse) {
			return $validResponse;
		}

		$this->doctrine->persist($condition);
	    $this->doctrine->flush();

	    $this->response->setContent($this->serializer->serialize($condition, 'json', ['json_encode_options' => JSON_PRETTY_PRINT]));
		$this->response->setStatusCode(JsonResponse::HTTP_OK);
		return $this->response;
	}

	public function deleteCondition(int $id)
	{
		$condition = $this->doctrine->getRepository('AppBundle\Entity\Condition')->findOneById($id);
    	if(null === $condition)
    	{
    		$this->response->setData(array(
    			"errors"=>"The condition ID '$id' does not exist."
    		));
    		$this->response->setStatusCode(JsonResponse::HTTP_BAD_REQUEST);
			return $this->response;
    	}
	    
	    // remove the page that was requested
    	$this->doctrine->remove($condition);
    	$this->doctrine->flush();

	    $this->response->setContent($this->serializer->serialize(array("result"=>true), 'json', ['json_encode_options' => JSON_PRETTY_PRINT]));
		$this->response->setStatusCode(JsonResponse::HTTP_OK);
		return $this->response;
	}

	private function getData(Request $request, array $requiredKeys = array())
	{
		$data = json_decode($request->getContent(), true);
		foreach($requiredKeys as $rk)
		{
			if(!array_key_exists($rk, $data))
			{
				$this->response->setContent($this->serializer->serialize(array("errors"=>['The key `'.$rk.'` is required for this action but it was not submitted']), 'json', ['json_encode_options' => JSON_PRETTY_PRINT]));
				$this->response->setStatusCode(JsonResponse::HTTP_BAD_REQUEST);
				return $this->response;
				break;
			}
		}
		return $data;
	}

	private function validatePage($page)
	{
		$errors = $this->validator->validate($page);
        if (count($errors) > 0) {
	        $this->response->setContent($this->serializer->serialize(array("errors"=>$errors), 'json', ['json_encode_options' => JSON_PRETTY_PRINT]));
			$this->response->setStatusCode(JsonResponse::HTTP_BAD_REQUEST);
			return $this->response;
	    }
	    return true;
	}

	private function updateOrder($parentID, $currentPageSort, $changeBy="+1", int $excludeId=null)
	{
		$qb = $this->doctrine->createQueryBuilder();

		if(null === $parentID)
	    {
	    	$whereStr = $qb->expr()->isNull('p.parent');
	    }
	    else
	    {
	    	$whereStr = 'p.parent=:pid';
	    	$qb->setParameter('pid', $parentID);
	    }
	    $whereStr .= ' AND p.sort>= :cpsort';
	    $qb->setParameter('cpsort', $currentPageSort);
	    if($excludeId)
	    {
	    	$whereStr .= ' AND p.id!=:exclid';
	    	$qb->setParameter('exclid', $excludeId);
	    }
	    $query = $qb->update('AppBundle\Entity\Page', 'p')
	    	->set('p.sort', 'p.sort'.$changeBy)
	    	->where($whereStr)
	    	->getQuery();

	    try
	    {
	   		$query->getSingleResult();
	    }catch(\Doctrine\ORM\NoResultException $e){}

	    return true;
	}

	private function getPage(int $pageID)
	{
		$page = $this->doctrine->getRepository('AppBundle\Entity\Page')->findOneById($pageID);
    	if(null === $page)
    	{
    		$this->response->setData(array(
    			"errors"=>["The page ID '$pageID' does not exist."]
    		));
    		$this->response->setStatusCode(JsonResponse::HTTP_BAD_REQUEST);
			return $this->response;
    	}
    	return $page;
	}
}