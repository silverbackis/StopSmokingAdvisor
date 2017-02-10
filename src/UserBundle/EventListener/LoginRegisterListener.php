<?php

namespace UserBundle\EventListener;

use FOS\UserBundle\FOSUserEvents;
use FOS\UserBundle\Event\FormEvent;

use Symfony\Component\Form\Form;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormErrorIterator;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

/**
 * Listener responsible to change the redirection at the end of the password resetting
 */
class LoginRegisterListener implements EventSubscriberInterface
{
    protected $serializer, $requestStack;

    public function __construct($requestStack)
    {
        $encoders = array(new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        $this->serializer = new Serializer($normalizers, $encoders);
        $this->requestStack = $requestStack;
    }

    /**
     * {@inheritdoc}
     */
    public static function getSubscribedEvents()
    {
        return array(
            FOSUserEvents::REGISTRATION_SUCCESS => 'onRegisterSuccess',
            FOSUserEvents::REGISTRATION_FAILURE => 'onRegisterFailure',
        );
    }

    public function onRegisterSuccess(FormEvent $event){
        $data = array();
        $response = new Response($this->serializer->serialize($data, 'json'), Response::HTTP_CREATED);
        $this->setResponse($response, $event);
    }

    public function onRegisterFailure(FormEvent $event){
        $HTTPCode = Response::HTTP_BAD_REQUEST;

        $request = $this->requestStack->getCurrentRequest();
        //FormInterface
        $form = $event->getForm();
        $data = [];
        $task = $request->request->get('task');
        //would always fail registering on input validation because not all fields have been submitted - so let's check the field in question
        if( $task['submit']=='no' ){
            $fieldID = $task['input'];
            $inputRef = explode("_",str_replace("fos_user_registration_form_", "", $fieldID));
            $formField = $form;
            foreach($inputRef as $inputRefPart){
                $formField = $formField[$inputRefPart];
            }
            $currentError = $formField->getErrors()->current();
            if($currentError){
                $data[$fieldID] = $currentError->getMessage();
            }else{
                $HTTPCode = Response::HTTP_ACCEPTED;   
            }
                    
        }else{
            //FormErrorIterator
            $errorIterator = $form->getErrors(true);            
            while($errorIterator->valid()){
                $currentError = $errorIterator->current();
                $currentOrigin = $currentError->getOrigin();

                $currentField = [ $currentOrigin->getName() ];
                while( $p = $currentOrigin->getParent() ) {
                    array_unshift($currentField, $p->getName() );
                    $currentOrigin = $p;
                }

                $fieldID = join("_",$currentField);
                
                if(!isset($data[$fieldID])){
                    $data[$fieldID] = $currentError->getMessage();
                }
                //$data[$fieldName][] = 
                $errorIterator->next();
            }
        }
        $response = new Response($this->serializer->serialize($data, 'json'), $HTTPCode);
        $this->setResponse($response, $event);
    }

    private function setResponse(Response $response, FormEvent $event){
        $response->headers->set('Content-Type', 'application/json');
        $event->setResponse($response);
    }
}