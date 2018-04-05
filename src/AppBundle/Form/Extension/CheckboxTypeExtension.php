<?php

namespace AppBundle\Form\Extension;

use Symfony\Component\Form\AbstractTypeExtension;
use Symfony\Component\Form\FormView;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\PropertyAccess\PropertyAccess;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;

class CheckboxTypeExtension extends AbstractTypeExtension
{
    /**
     * Returns the name of the type being extended.
     *
     * @return string The name of the type being extended
     */
    public function getExtendedType()
    {
        return CheckboxType::class;
    }

    /**
     * Add the custom option
     *
     * @param OptionsResolver $resolver
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefined(['custom']);
        $resolver->setDefined(['text_class']);
        $resolver->setDefined(['indicator_class']);
    }

    /**
     * Pass the image URL to the view
     *
     * @param FormView $view
     * @param FormInterface $form
     * @param array $options
     */
    public function buildView(FormView $view, FormInterface $form, array $options)
    {
        /*if (isset($options['custom'])) {
            //$parentData = $form->getParent()->getData();

            //$imageUrl = null;
            //if (null !== $parentData) {
            //    $accessor = PropertyAccess::createPropertyAccessor();
            //    $imageUrl = $accessor->getValue($parentData, $options['image_path']);
            //}

            // set an "image_url" variable that will be available when rendering this field
            $view->vars['custom'] = $options['custom'];
        }
        else
        {
            $view->vars['custom'] = false;
        }*/

        $view->vars['custom'] = (isset($options['custom']) && $options['custom']);
        if (isset($options['text_class'])) {
            $view->vars['text_class'] = $options['text_class'];
        }
        if (isset($options['indicator_class'])) {
            $view->vars['indicator_class'] = $options['indicator_class'];
        }
    }
}
