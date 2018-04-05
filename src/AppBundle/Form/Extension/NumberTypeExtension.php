<?php

namespace AppBundle\Form\Extension;

use Symfony\Component\Form\AbstractTypeExtension;
use Symfony\Component\Form\FormView;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\PropertyAccess\PropertyAccess;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\NumberType;

class NumberTypeExtension extends AbstractTypeExtension
{
    /**
     * Returns the name of the type being extended.
     *
     * @return string The name of the type being extended
     */
    public function getExtendedType()
    {
        return NumberType::class;
    }

    /**
     * Add the custom option
     *
     * @param OptionsResolver $resolver
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefined(['wrapper_class']);
        $resolver->setDefined(['input_group_html']);
        $resolver->setDefined(['input_addon_before']);
    }

    public function buildView(FormView $view, FormInterface $form, array $options)
    {
        if (isset($options['wrapper_class'])) {
            $view->vars['wrapper_class'] = $options['wrapper_class'];
        }

        if (isset($options['input_group_html'])) {
            $view->vars['input_group_html'] = $options['input_group_html'];
        }

        $view->vars['input_addon_before'] = (isset($options['input_addon_before']) && $options['input_addon_before']);
    }
}
