<?php

namespace UserBundle\Controller;

use FOS\UserBundle\Controller\ChangePasswordController as BaseController;
use Symfony\Component\HttpFoundation\Request;

class ChangePasswordController extends BaseController
{
    public function changePasswordAction(Request $request)
    {
        return $this->forward('AppBundle:Account:settings');
        ;
    }
}
