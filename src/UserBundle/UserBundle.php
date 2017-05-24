<?php

namespace UserBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use UserBundle\DependencyInjection\Compiler\OverrideFOSMailerCompilerPass;

class UserBundle extends Bundle
{
    public function build(ContainerBuilder $container)
    {
        parent::build($container);

        $container->addCompilerPass(new OverrideFOSMailerCompilerPass());
    }

    public function getParent()
    {
        return 'FOSUserBundle';
    }
}
