<?php

namespace UserBundle;

use Symfony\Component\Security\Http\Authentication\AuthenticationFailureHandlerInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;

use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\HttpFoundation\Session\Session;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;

use Symfony\Component\Translation\TranslatorInterface;
use Symfony\Component\Security\Core\Role\RoleHierarchy;
use Symfony\Component\Security\Core\Security;

class AuthenticationHandler implements AuthenticationSuccessHandlerInterface, AuthenticationFailureHandlerInterface
{
	private $router,
	$session,
	$login_path,
	$translator,
	$admin_login_path;

	public function __construct(RouterInterface $router, Session $session, TranslatorInterface $translator, $login_path, $admin_login_path)
	{
		$this->router  = $router;
		$this->session = $session;
		$this->login_path = $login_path;
		$this->translator = $translator;
		$this->admin_login_path = $admin_login_path;
	}

	public function onAuthenticationSuccess( Request $request, TokenInterface $token )
	{
		$nextURL = $this->login_path;
		$roles = $token->getUser()->getRoles();
		if(in_array('ROLE_ADMIN', $roles)){
			$nextURL = $this->admin_login_path;
		}

		if( $request->isXmlHttpRequest() ){
			$array = array( 
				'href' => $nextURL
			);
			$response = new Response( json_encode( $array ), Response::HTTP_OK );
			$response->headers->set( 'Content-Type', 'application/json' );
			return $response;
		}else{
			return new RedirectResponse( $nextURL );
		}
	}

	public function onAuthenticationFailure( Request $request, AuthenticationException $exception )
	{
		if ( $request->isXmlHttpRequest() ) {
			$errorMessage = (string)$exception->getMessage();

			$array = array( 
				'message' => $this->translator->trans($errorMessage, array(), 'validators') 
			);
			$response = new Response( json_encode( $array ), Response::HTTP_UNAUTHORIZED );
			$response->headers->set( 'Content-Type', 'application/json' );
			return $response;
		} else {
			// set authentication exception to session
			$request->getSession()->set(Security::AUTHENTICATION_ERROR, $exception);
			return new RedirectResponse( $this->router->generate( 'login_route' ) );
		}
	}
}