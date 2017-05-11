<?php

namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;

class SessionType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $question = $options['question'];
        $input_ops = [
            'label' => $question->getQuestion(),
            //'translation_domain' => 'contact',
            'required' => true
        ];
        $input_type = $question->getInputType();
        $choice_prefix = 'choice';
        $is_choice = substr($input_type, 0, strlen($choice_prefix))==$choice_prefix;

        switch($input_type)
        {
            case "choice_boolean":
                $input_type_class = ChoiceType::class;

                $input_ops['custom'] = true;
                $input_ops['text_class'] = 'custom-control-description';
                $input_ops['expanded'] = true;
                $input_ops['multiple'] = false;
                $input_ops['choices'] = [
                    'No' => 'bool_0',
                    'Yes' => 'bool_1'
                ];
                $input_ops['label_attr'] = [
                    'class' =>  'custom-control custom-radio text-radio'
                ];
                $input_ops['attr'] = [
                    'class' =>  'radio-wrapper-outer'
                ];
            break;

            case "choice_emotive":
                $input_type_class = ChoiceType::class;

                $input_ops['custom'] = true;
                $input_ops['text_class'] = 'custom-control-emoticon';
                $input_ops['expanded'] = true;
                $input_ops['multiple'] = false;
                $input_ops['choices'] = [
                    'Sad' => 'emot_1',
                    'Neutral' => 'emot_2',
                    'Happy' => 'emot_3'
                ];
                $input_ops['choice_attr'] = function($category, $key, $index) {
                    return ['class' => 'custom-control custom-radio emoticon-radio '.strtolower($key)];
                };
                $input_ops['attr'] = [
                    'class' =>  'radio-wrapper-outer'
                ];
            break;

            case "choice":
                $input_type_class = ChoiceType::class;

                $input_ops['attr'] = [
                    'class' => 'selectpicker col-12',
                    'title' => 'Please select...',
                    'autocomplete' => 'off',
                    'data-dropup-auto' => 'false',
                    'data-size' => 'auto'
                ];
                foreach($question->getAnswerOptions() as $answer)
                {
                    $display_val = $answer->getAnswer();
                    $save_val = $answer->getSaveValue() ?: $display_val;
                    $input_ops['choices'][$display_val] = $save_val;
                }
            break;

            case "text":
                $input_type_class = TextType::class;
                $input_ops['attr'] = [
                    'placeholder' => 'Enter your answer here',
                    'autocomplete' => 'off'
                ];
                $input_ops['wrapper_class'] = 'text-input-outer text';
            break;

            case "float":
                $input_type_class = NumberType::class;
                $input_ops['attr'] = [
                    'placeholder' => 'Enter number',
                    'autocomplete' => 'off'
                ];
                $input_ops['wrapper_class'] = 'text-input-outer number';
            break;

            default:
                if(substr($input_type, 0, strlen('date'))=='date')
                {
                    $input_type_class = TextType::class;
                    $input_ops['attr'] = [
                        'placeholder' => 'Select date',
                        'autocomplete' => 'off',
                        //'id' => 'DateInput'
                    ];
                    $input_ops['wrapper_class'] = 'text-input-outer date';
                    $input_ops['input_group_html'] = '<a class="input-group-addon" href="#" id="calpicker">
                        <img src="{{ asset(\'bundles/app/svg/calendar.svg\') }}" />
                      </a>';
                }
            break;
        }

        $builder
            ->add('var', HiddenType::class, [])
            ->add('value', $input_type_class, $input_ops)
            ->add('save', SubmitType::class, array(
                'attr' => array('class' => 'btn btn-lg btn-success btn-start'),
                'append_arrow' => true,
                'label' => 'Continue'
            ));
    }

    public function setDefaultOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'error_bubbling' => true
        ));
    }

    // Configure options that can be passed - add the 'question' option as required
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setRequired('question');
    }

    public function getName()
    {
        return 'session_form';
    }
}