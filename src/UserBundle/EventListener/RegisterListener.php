<?php

namespace UserBundle\EventListener;

use FOS\UserBundle\FOSUserEvents;
use FOS\UserBundle\Event\FormEvent;
use FOS\UserBundle\Event\GetResponseNullableUserEvent;
use FOS\UserBundle\Event\GetResponseUserEvent;

use Symfony\Component\Form\Form;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormErrorIterator;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

use Symfony\Component\Translation\TranslatorInterface;
/**
 * Listener responsible to change the redirection at the end of the password resetting
 */
class RegisterListener implements EventSubscriberInterface
{
    protected $requestStack, $resetting_ttl, $translator;

    public function __construct($requestStack, $resetting_ttl, TranslatorInterface $translator)
    {
        $this->requestStack = $requestStack;
        $this->resetting_ttl = $resetting_ttl;
        $this->translator = $translator;
    }

    /**
     * {@inheritdoc}
     */
    public static function getSubscribedEvents()
    {
        return array(
            FOSUserEvents::REGISTRATION_SUCCESS => 'onRegisterSuccess',
            FOSUserEvents::REGISTRATION_FAILURE => 'onRegisterFailure',
            FOSUserEvents::RESETTING_SEND_EMAIL_INITIALIZE => 'onResettingEmailInit',
            FOSUserEvents::RESETTING_SEND_EMAIL_COMPLETED => 'onResettingEmailCompleted'
        );
    }

    public function onResettingEmailInit(GetResponseNullableUserEvent $event)
    {
        $user = $event->getUser();
        if (null == $user || $user->isPasswordRequestNonExpired($this->resetting_ttl)) {
            $response = new JsonResponse();
            $response->setStatusCode(Response::HTTP_BAD_REQUEST);
            $errKey = (null == $user) ? 'resetting.nouser_error' : 'resetting.ttl_error';
            $errMessage = $this->translator->trans($errKey, array(), 'FOSUserBundle');
            $errMessage = str_replace("%tokenLifetime%", ceil($this->resetting_ttl / 3600), $errMessage);
            $response->setData(array(
                'username' => nl2br($errMessage)
            ));
            $event->setResponse($response);
        }
    }

    public function onResettingEmailCompleted(GetResponseUserEvent $event)
    {
        $response = new JsonResponse();
        $response->setStatusCode(Response::HTTP_ACCEPTED);
        $response->setData(array(
            'message' => nl2br($this->translator->trans('resetting.check_email', array(), 'FOSUserBundle'))
        ));
        $event->setResponse($response);
    }  

    public function onRegisterSuccess(FormEvent $event)
    {
        $data = array();

        $response = new JsonResponse($data, Response::HTTP_CREATED);
        $event->setResponse($response);
    }

    public function onRegisterFailure(FormEvent $event)
    {
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
        $response = new JsonResponse($data, $HTTPCode);
        $event->setResponse($response);
    }
}