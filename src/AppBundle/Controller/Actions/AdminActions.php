<?php

namespace AppBundle\Controller\Actions;

use AppBundle\Entity\Answer;
use AppBundle\Entity\Condition;
use AppBundle\Entity\Page;
use AppBundle\Entity\Question;
use Doctrine\ORM\EntityManager;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\NameConverter\CamelCaseToSnakeCaseNameConverter;
use Symfony\Component\Serializer\Normalizer\DateTimeNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class AdminActions
{
    private $doctrine;
    private $serializer;
    private $validator;
    private $ccConverter;

    public function __construct(EntityManager $doctrine, ValidatorInterface $validator)
    {
        $this->doctrine = $doctrine;
        $this->validator = $validator;
        $this->ccConverter = new CamelCaseToSnakeCaseNameConverter();

        $encoders = array(new JsonEncoder());
        $normalizer = new ObjectNormalizer();

        //instead of a circular reference where we would continue looping around the  parent and children, just return the parent's ID
        $normalizer->setCircularReferenceHandler(
            function ($object) {
                $className = $this->doctrine->getClassMetadata(\get_class($object))->getName();

                return $className === Page::class ? array(
                    "id" => $object->getId(),
                    "name" => $object->getName()
                ) : $object->getId();
            }
        );

        $normalizers = array(new DateTimeNormalizer(), $normalizer);
        $this->serializer = new Serializer($normalizers, $encoders);
    }

    public function getSessionPages(int $session)
    {
        $pages = $this->doctrine->getRepository(Page::class)->findBy(array('session' => $session, 'parent' => null), array('sort' => 'ASC'));
        return $this->getOKResponse($pages);
    }

    public function getPage(int $id)
    {
        $page = $this->fetchPage($id);
        if (!$page instanceof Page) {
            return $page;
        }
        if (count($page->getQuestions()) === 0) {
            $question = new Question();
            $question->setPage($page);
            $question->setInputType("choice");
            $page->addQuestion($question);
            $this->doctrine->flush();
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
            ->setParameter('search', '%' . $data['search'] . '%')
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

        // Links cannot be changed to live, so will always be live
        if ($page->getType() == 'link') {
            $page->setLive(true);
        }

        $this->updateOrder($data['session'], $data['parent'], $data['sort'], true);

        //persist to the database
        $this->doctrine->persist($page);
        $this->doctrine->flush();

        return $this->getOKResponse($page);
    }

    private function getSetMethodFromKey($key)
    {
        $snake_case = "set_" . $key;
        return $this->ccConverter->denormalize($snake_case);
    }

    private function getGetMethodFromKey($key)
    {
        $snake_case = "get_" . $key;
        return $this->ccConverter->denormalize($snake_case);
    }

    public function updatePage(int $pageID, Request $request, $postedVar = false)
    {
        $data = $this->validatePost($request, [], ['name', 'adminDescription', 'live', 'mediaType', 'imagePath', 'videoUrl', 'text', 'forwardToPage'], $postedVar);
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

        // Page will be added, update other page orders to make room for the new page
        $this->updateOrder($page->getSession(), $data['parent'], $data['sort'], true);

        //persist new page the database
        $this->doctrine->persist($pageCopy);
        $this->doctrine->flush();

        return $this->getOKResponse($pageCopy);
    }

    public function movePage(int $pageID, Request $request)
    {
        // Get the post data (sort and parent)
        $data = $this->validatePost($request, ['sort', 'parent']);

        if ($data instanceof JsonResponse) {
            return $data;
        }

        // Get the page being moved
        $page = $this->fetchPage($pageID);
        if (!$page instanceof Page) {
            return $page;
        }
        $movePageId = $page->getId();

        // Set variables for where the page is currently
        $oldInfo = [
            'parent' => (null == $page->getParent() ? null : $page->getParent()->getId()),
            'sort' => $page->getSort()
        ];

        // apply data to page and validate - the page will then be moved, other pages sort need adjusting though
        $validResponse = $this->validateEntity($page, $data);
        if ($validResponse instanceof JsonResponse) {
            return $validResponse;
        }
        $this->doctrine->flush();

        //Update order of OTHER entities where page is moving FROM
        $this->updateOrder($page->getSession(), $oldInfo['parent'], $oldInfo['sort'], false, $movePageId);

        //Update order of OTHER entities where page is moving TO
        $this->updateOrder($page->getSession(), $data['parent'], $data['sort'], true, $movePageId);

        return $this->getOKResponse($page);
    }

    private function updateOrder($session, $parentID, int $currentPageSort, $newInsert = true, int $excludeId = null)
    {
        $changeBy = $newInsert ? 1 : -1;

        $qb = $this->doctrine->createQueryBuilder();

        //Select from the correct session
        $whereStr = 'p.session = :session';
        $qb->setParameter('session', $session);

        //Select from the correct parent
        $whereStr .= ' AND ';
        if (null !== $parentID) {
            $whereStr .= 'p.parent = :parent_id';
            $qb->setParameter('parent_id', $parentID);
        } else {
            $whereStr .= $qb->expr()->isNull('p.parent');
        }

        // Only update relevant
        $whereStr .= ' AND p.sort ' . ($newInsert ? '>=' : '>') . ' :sort';
        $qb->setParameter('sort', $currentPageSort);

        // Exclude page id if defined
        if ($excludeId !== null) {
            $whereStr .= ' AND p.id != :exclude_page_id';
            $qb->setParameter('exclude_page_id', $excludeId);
        }

        // Create query
        $query = $qb->update('AppBundle\Entity\Page', 'p')
            ->set('p.sort', 'p.sort+' . $changeBy)
            ->where($whereStr)
            ->getQuery();
        // Run the update
        $query->execute();

        return true;
    }

    public function deletePage(int $pageID)
    {
        $page = $this->fetchPage($pageID);
        if (!$page instanceof Page) {
            return $page;
        }

        //check it isn't the last root node page of the session
        if (null === $page->getParent()) {
            // it is a root page, so check if there is at least 1 other
            $totalSessionRootNodes = (int)$this->doctrine->createQueryBuilder()
                ->select('COUNT(p.id)')
                ->from('AppBundle\Entity\Page', 'p')
                ->where('p.parent IS NULL AND p.session = :session AND p.type = :pagetype')
                ->setParameter('session', $page->getSession())
                ->setParameter('pagetype', 'page')
                ->getQuery()
                ->getSingleScalarResult();

            if ($totalSessionRootNodes === 1) {
                return $this->getBadRequestResponse("You cannot delete this page because it will result in there being no pages in session " . $page->getSession() . ".");
            }
        }

        // remove the page that was requested
        $this->doctrine->remove($page);
        $this->doctrine->flush();

        // update order of other items so no gaps in the order values
        $parentId = (null == $page->getParent() ? null : $page->getParent()->getId());
        $this->updateOrder($page->getSession(), $parentId, $page->getSort(), false);

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
        if (null === $condition) {
            return $this->getBadRequestResponse("The condition ID '$id' does not exist.");
        }

        // remove the page that was requested
        $this->doctrine->remove($condition);
        $this->doctrine->flush();

        return $this->getOKResponse();
    }

    public function updateQuestion(int $questionID, Request $request, $postedVar = false)
    {
        $data = $this->validatePost($request, [], ['inputType', 'question', 'variable', 'quitPlan', 'minAnswers', 'maxAnswers'], $postedVar);
        if ($data instanceof JsonResponse) {
            return $data;
        }

        $question = $this->fetchQuestion($questionID);
        if (!$question instanceof Question) {
            return $question;
        }

        // apply data to page and validate
        $validResponse = $this->validateEntity($question, $data);
        if ($validResponse instanceof JsonResponse) {
            return $validResponse;
        }

        $this->doctrine->flush();
        return $this->getOKResponse($question);
    }

    public function addAnswer(Request $request)
    {
        $data = $this->validatePost($request, ['question']);
        if ($data instanceof JsonResponse) {
            return $data;
        }

        $answer = new Answer();
        $validResponse = $this->validateEntity(
            $answer,
            $data,
            [
            'AppBundle:Question' => array(
                'question'
            )
        ]
        );
        if ($validResponse instanceof JsonResponse) {
            return $validResponse;
        }

        $this->doctrine->persist($answer);
        $this->doctrine->flush();

        return $this->getOKResponse($answer);
    }

    public function deleteAnswer(int $id)
    {
        $answer = $this->doctrine->getRepository('AppBundle\Entity\Answer')->findOneById($id);
        if (null === $answer) {
            return $this->getBadRequestResponse("The answer ID '$id' does not exist.");
        }

        // remove the page that was requested
        $this->doctrine->remove($answer);
        $this->doctrine->flush();

        return $this->getOKResponse();
    }

    public function updateAnswer(int $id, Request $request)
    {
        $data = $this->validatePost($request, [], ['answer', 'saveValue']);
        if ($data instanceof JsonResponse) {
            return $data;
        }

        $answer = $this->fetchAnswer($id);
        if (!$answer instanceof Answer) {
            return $answer;
        }

        // apply data to page and validate
        $validResponse = $this->validateEntity($answer, $data);
        if ($validResponse instanceof JsonResponse) {
            return $validResponse;
        }

        $this->doctrine->flush();
        return $this->getOKResponse($answer);
    }

    private function validatePost(Request $request, array $requiredKeys = array(), array $optionalKeys = array(), $postedVar = false)
    {
        if (!$postedVar) {
            $decodedJSON = json_decode($request->getContent(), true);
        } else {
            $decodedJSON = $request->request->all();
        }
        $allPossibleKeys = array_merge($requiredKeys, $optionalKeys);

        // Expected post variables only
        foreach ($decodedJSON as $k => $d) {
            if (!in_array($k, $allPossibleKeys)) {
                return $this->getBadRequestResponse('The key `' . $k . '` was submitted but is not permitted');
            }
        }

        // Loop through expected keys, check if they exist in post data
        foreach ($requiredKeys as $rk) {
            if (!array_key_exists($rk, $decodedJSON)) {
                return $this->getBadRequestResponse('The key `' . $rk . '` is required for this action but it was not submitted');
            }
        }

        // finish $anyRequired checks to see if a data key was found from $requiredKeys
        if (sizeof($decodedJSON) === 0) {
            return $this->getBadRequestResponse('Nothing was submitted');
        }

        return $decodedJSON;
    }

    private function validateEntity($entity, $data, $extraEntityRefs = array())
    {
        $fileColumns = array(
            'imagePath'
        );

        $entityReferences = array_merge(
            [
                'AppBundle:Page' => array(
                    'parent',
                    'forwardToPage',
                    'page'
                )
            ],
            $extraEntityRefs
        );

        $unlinkPaths = [];
        $failUnlinkPaths = [];

        $allEntityRefs = [];
        foreach ($entityReferences as $e => $erSet) {
            foreach ($erSet as $er) {
                $allEntityRefs[$er] = $e;
            }
        }
        $entityKeys = array_keys($allEntityRefs);

        // Set everything that is not supposed to be an object
        $entityKeysInData = [];
        //die(dump($data));
        foreach ($data as $k => $d) {
            if (!in_array($k, $entityKeys)) {
                if (in_array($k, $fileColumns)) {
                    $getMethod = $this->getGetMethodFromKey($k);
                    $currentPath = $entity->$getMethod();
                    if ($currentPath) {
                        $unlinkPaths[] = $currentPath;
                    }
                    $failUnlinkPaths[] = $d;
                }

                $setMethod = $this->getSetMethodFromKey($k);
                $entity->$setMethod($d);
            } else {
                $entityKeysInData[] = $k;
            }
        }
        $error = false;
        //Find entity objects for remaining keys and add errors to validation if they do not exist
        foreach ($entityKeysInData as $key) {
            $id = $data[$key];
            $setMethod = $this->getSetMethodFromKey($key);
            try {
                $setEntity = is_null($id) ? null : $this->doctrine->getReference($allEntityRefs[$key], $id);
                $entity->$setMethod($setEntity);
            } catch (\Doctrine\ORM\EntityNotFoundException $e) {
                $error = new ConstraintViolation("ID not found." . $e->getMessage(), '', [], $entity, $key, $id);
                $entity->$setMethod(null);
            }
        }

        //Validate
        $errors = $this->validator->validate($entity);
        if ($error) {
            $errors->add($error);
        }

        if (count($errors) > 0) {
            // remove any uploaded files if validation failed to modify the database
            foreach ($failUnlinkPaths as $unlinkFile) {
                unlink($unlinkFile);
            }
            return $this->getBadRequestResponse($errors);
        } else {
            // remove any files that had been uploaded previously and will now be changed
            foreach ($unlinkPaths as $unlinkFile) {
                unlink($unlinkFile);
            }
        }
        return true;
    }

    private function fetchPage(int $pageID)
    {
        $page = $this->doctrine->getRepository('AppBundle\Entity\Page')->findOneById($pageID);
        if (null === $page) {
            return $this->getBadRequestResponse("The page ID '$pageID' does not exist.");
        }
        return $page;
    }

    private function fetchQuestion(int $questionID)
    {
        $question = $this->doctrine->getRepository('AppBundle\Entity\Question')->findOneById($questionID);
        if (null === $question) {
            return $this->getBadRequestResponse("The question ID '$questionID' does not exist.");
        }
        return $question;
    }

    private function fetchAnswer(int $answerID)
    {
        $answer = $this->doctrine->getRepository('AppBundle\Entity\Answer')->findOneById($answerID);
        if (null === $answer) {
            return $this->getBadRequestResponse("The answer ID '$answerID' does not exist.");
        }
        return $answer;
    }

    private function getOKResponse($data = array('success' => true))
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
        if (is_string($data)) {
            $data = array(
                "message" => $data
            );
        }

        $serialized = $this->serializer->serialize(array("errors" => $data), 'json', ['json_encode_options' => JSON_PRETTY_PRINT]);
        $response->setContent($serialized);
        $response->setStatusCode(JsonResponse::HTTP_BAD_REQUEST);
        return $response;
    }
}
