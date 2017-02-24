<?php

namespace AppBundle\Utils;

use Doctrine\ORM\EntityManager;
use Symfony\Component\Validator\Validator\ValidatorInterface;

use Symfony\Component\HttpFoundation\Request;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\NameConverter\CamelCaseToSnakeCaseNameConverter;
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
		$this->ccConverter = $ccConverter = new CamelCaseToSnakeCaseNameConverter();

		$encoders = array(new JsonEncoder());
		$normalizer = new ObjectNormalizer();

		//instead of a circular reference where we would continue looping around the  parent and children, just return the parent's ID
		$normalizer->setCircularReferenceHandler(function ($object) {
			$className = $this->doctrine->getClassMetadata(get_class($object))->getName();

		    return $className=='AppBundle\Entity\Page' ? array(
		    	"id"=>$object->getId(),
		    	"name"=>$object->getName()
		    ) : $object->getId();
		});

		$normalizers = array($normalizer);
		$this->serializer = new Serializer($normalizers, $encoders);
	}

	public function getSessionPages(int $session)
	{
		$pages = $this->doctrine->getRepository('AppBundle\Entity\Page')->findBy(array('session' => $session, 'parent' => null), array('sort'=>'ASC'));
		return $this->getOKResponse($pages);
	}

	public function getPage(int $id)
	{
		$page = $this->fetchPage($id);
		if (!$page instanceof Page) {
			return $page;
		}
		return $this->getOKResponse($page);
	}


	public function searchSessionPages(int $session, Request $request)
	{
		$data = $this->validatePost($request, ['search']);
		if ($data instanceof JsonResponse) {
			return $data;
		}

		$pages = $this->doctrine->createQueryBuilder()
			->select('p.id, p.name')
			->from('AppBundle\Entity\Page', 'p')
			->where('p.session = :session')
			->andWhere('p.name LIKE :search')
			->setParameter('session', $session)
   			->setParameter('search', '%'.$data['search'].'%')
   			->orderBy('p.name', 'ASC')
   			->getQuery()
   			->getResult();

   		return $this->getOKResponse($pages);
	}

	public function addPage(Request $request)
	{	
		$data = $this->validatePost($request, ['session', 'sort', 'parent'], ['type']);
		if ($data instanceof JsonResponse) {
			return $data;
		}
		//create and populate entity
		$page = new Page();

		// apply data to page and validate
		$validResponse = $this->validateEntity($page, $data);
		if ($validResponse instanceof JsonResponse) {
			return $validResponse;
		}

		$this->updateOrder($data['session'], $data['parent'], $data['sort'], "+1");

	    //persist to the database
	    $this->doctrine->persist($page);
	    $this->doctrine->flush();

		return $this->getOKResponse($page);
	}

	private function getSetMethodFromKey($key)
	{
		$snake_case = "set_".$key;
		return $this->ccConverter->denormalize($snake_case);
	}

	public function updatePage(int $pageID, Request $request)
	{
		$data = $this->validatePost($request, [], ['name', 'adminDescription', 'live', 'mediaType', 'imagePath', 'videoUrl', 'text', 'forwardToPage']);
		if ($data instanceof JsonResponse) {
			return $data;
		}

		$page = $this->fetchPage($pageID);
		if (!$page instanceof Page) {
			return $page;
		}

		// apply data to page and validate
		$validResponse = $this->validateEntity($page, $data);
		if ($validResponse instanceof JsonResponse) {
			return $validResponse;
		}

		$this->doctrine->flush();
		return $this->getOKResponse($page);
	}

	public function copyPage(int $pageID, Request $request)
	{
		$data = $this->validatePost($request, ['sort', 'parent']);
		if ($data instanceof JsonResponse) {
			return $data;
		}

		$page = $this->fetchPage($pageID);
		if (!$page instanceof Page) {
			return $page;
		}

    	$pageCopy = clone $page;
    	
    	// apply data to page and validate
		$validResponse = $this->validateEntity($pageCopy, $data);
		if ($validResponse instanceof JsonResponse) {
			return $validResponse;
		}

    	$this->updateOrder($page->getSession(), $data['parent'], $data['sort'], "+1");

	    //persist new page the database
	    $this->doctrine->persist($pageCopy);
	    $this->doctrine->flush();

		return $this->getOKResponse($pageCopy);
	}

	public function movePage(int $pageID, Request $request)
	{
		$data = $this->validatePost($request, ['sort', 'parent']);
		if ($data instanceof JsonResponse) {
			return $data;
		}

		$page = $this->fetchPage($pageID);
		if (!$page instanceof Page) {
			return $page;
		}

		$oldInfo = array(
			'parent'=>(null == $page->getParent() ? null : $page->getParent()->getId()),
			'sort'=> $page->getSort()
		);
    	
    	// apply data to page and validate
		$validResponse = $this->validateEntity($page, $data);
		if ($validResponse instanceof JsonResponse) {
			return $validResponse;
		}

		$this->doctrine->flush();

		//Update order of other entities where page is moving FROM
		$this->updateOrder($page->getSession(), $oldInfo['parent'], $oldInfo['sort'], "-1", $page->getId());

	    //Update order of other entities where page is moving TO
	    $this->updateOrder($page->getSession(), $data['parent'], $data['sort'], "+1", $page->getId());

		return $this->getOKResponse($page);
	}

	public function deletePage(int $pageID)
	{
		$page = $this->fetchPage($pageID);
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
				return $this->getBadRequestResponse("You cannot delete this page because it will result in there being no pages in session ".$page->getSession().".");
			}
		}

    	// update order of other items so no gaps in the order values
	    $this->updateOrder($page->getSession(), (null == $page->getParent() ? null : $page->getParent()->getId()), $page->getSort(), "-1");
	    
	    // remove the page that was requested
    	$this->doctrine->remove($page);
    	$this->doctrine->flush();

	    return $this->getOKResponse();
	}

	public function addCondition(Request $request)
	{
		$data = $this->validatePost($request, ['page', 'condition']);
		if ($data instanceof JsonResponse) {
			return $data;
		}

		$condition = new Condition();

		$validResponse = $this->validateEntity($condition, $data);
		if ($validResponse instanceof JsonResponse) {
			return $validResponse;
		}

		$this->doctrine->persist($condition);
	    $this->doctrine->flush();

	    return $this->getOKResponse($condition);
	}

	public function deleteCondition(int $id)
	{
		$condition = $this->doctrine->getRepository('AppBundle\Entity\Condition')->findOneById($id);
    	if(null === $condition)
    	{
    		return $this->getBadRequestResponse("The condition ID '$id' does not exist.");
    	}
	    
	    // remove the page that was requested
    	$this->doctrine->remove($condition);
    	$this->doctrine->flush();

	    return $this->getOKResponse();
	}

	private function validatePost(Request $request, array $requiredKeys = array(), array $optionalKeys = array())
	{
		$decodedJSON = json_decode($request->getContent(), true);
		$allPossibleKeys = array_merge($requiredKeys, $optionalKeys);

		// Expected post variables only
		foreach($decodedJSON as $k=>$d)
		{
			if(!in_array($k, $allPossibleKeys))
			{
				return $this->getBadRequestResponse('The key `'.$k.'` was submitted but is not permitted');
			}
		}

		// Loop through expected keys, check if they exist in post data
		foreach($requiredKeys as $rk)
		{
			if(!array_key_exists($rk, $decodedJSON))
			{
				return $this->getBadRequestResponse('The key `'.$rk.'` is required for this action but it was not submitted');
			}
		}

		// finish $anyRequired checks to see if a data key was found from $requiredKeys
		if(sizeof($decodedJSON)===0)
		{
			return $this->getBadRequestResponse('Nothing was submitted');
		}

		return $decodedJSON;
	}

	private function validateEntity($entity, $data)
	{
		$entityReferences = array(
			'AppBundle:Page'=>array(
				'parent',
				'forwardToPage',
				'page'
			)
		);

		$allEntityRefs = [];
		foreach($entityReferences as $e=>$erSet)
		{
			foreach($erSet as $er)
			{
				$allEntityRefs[$er] = $e;
			}
		}
		$entityKeys = array_keys($allEntityRefs);

		// Set everything that is not supposed to be an object
		$entityKeysInData = [];
		foreach($data as $k=>$d)
		{
			if(!in_array($k, $entityKeys))
			{
				$setMethod = $this->getSetMethodFromKey($k);
				$entity->$setMethod($d);
			}
			else
			{
				$entityKeysInData[] = $k;
			}
		}
		//Validate the plain data
		$errors = $this->validator->validate($entity);

		//Find entity objects for remaining keys and add errors to validation if they do not exist
		foreach($entityKeysInData as $key)
		{
			$id = $data[$key];
			$setMethod = $this->getSetMethodFromKey($key);
			try{
				$setEntity = is_null($id) ? null : $this->doctrine->getReference($allEntityRefs[$key], $id);
				$entity->$setMethod($setEntity);
			}
			catch(\Doctrine\ORM\EntityNotFoundException $e)
			{
				$error = new ConstraintViolation("ID not found.".$e->getMessage(), '', [], $entity, $key, $id);
				$errors->add($error);
				$entity->$setMethod(null);
			}
		}

		if (count($errors) > 0) {
        	return $this->getBadRequestResponse($errors);
	    }
	    return true;
	}

	private function fetchPage(int $pageID)
	{
		$page = $this->doctrine->getRepository('AppBundle\Entity\Page')->findOneById($pageID);
    	if(null === $page)
    	{
			return $this->getBadRequestResponse("The page ID '$pageID' does not exist.");
    	}
    	return $page;
	}

	private function updateOrder($session, $parentID, $currentPageSort, $changeBy="+1", int $excludeId=null)
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

	    $whereStr .= ' AND p.session = :session';
	    $qb->setParameter('session', $session);
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

	private function getOKResponse($data = array('success'=>true))
	{
		$response = new JsonResponse();
		$response->setContent(
			$this->serializer->serialize($data, 'json', ['json_encode_options' => JSON_PRETTY_PRINT])
		);
		$response->setStatusCode(JsonResponse::HTTP_OK);
		return $response;
	}

	private function getBadRequestResponse($data)
	{
		$response = new JsonResponse();
		if(is_string($data))
		{
			$data = array(
				"message"=>$data
			);
		}
		
		$serialized = $this->serializer->serialize(array("errors"=>$data), 'json', ['json_encode_options' => JSON_PRETTY_PRINT]);
		$response->setContent($serialized);
		$response->setStatusCode(JsonResponse::HTTP_BAD_REQUEST);
		return $response;
	}
}