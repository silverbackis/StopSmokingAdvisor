<?php

namespace UserBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use UserBundle\Mailer\TwigSwiftMailer;

class OverrideFOSMailerCompilerPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        $definition = $container->getDefinition('fos_user.mailer.twig_swift');
        $definition->setClass(TwigSwiftMailer::class);
    }
}