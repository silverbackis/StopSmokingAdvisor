<?php

namespace AppBundle\Form;

use AppBundle\Entity\Question;
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
    private function getQuestionAnswerOps(Question $question) {
        $choices = [];
        $ops = $question->getAnswerOptions();
        foreach ($ops as $answer) {
            $display_val = $answer->getAnswer();
            $save_val = $answer->getSaveValue() ?: $display_val;
            $choices[$display_val] = $save_val;
        }
        return $choices;
    }
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        /** @var Question $question */
        $question = $options['question'];
        $input_ops = [
            'label' => $question->getQuestion(),
            //'translation_domain' => 'contact',
            'required' => true
        ];
        $input_type = $question->getInputType();
        switch ($input_type) {
            case 'choice_boolean':
            case 'choice_boolean_continue':
            case 'choice_multi':
                $input_type_class = ChoiceType::class;

                $input_ops['custom'] = true;
                $input_ops['text_class'] = 'custom-control-description';
                $input_ops['expanded'] = true;
                $input_ops['multiple'] = $input_type === 'choice_multi';
                if ($input_type !== 'choice_multi') {
                    $input_ops['choices'] = [
                        'No' => 'bool_0',
                        'Yes' => 'bool_1'
                    ];
                    $cls = 'custom-radio';
                    $clsOuter = 'radio-wrapper-outer';
                } else {
                    $input_ops['choices'] = $this->getQuestionAnswerOps($question);
                    $cls = 'custom-checkbox';
                    $clsOuter = 'checkbox-wrapper-outer';
                }

                $input_ops['label_attr'] = [
                    'class' =>  'custom-control text-radio ' . $cls
                ];
                $input_ops['attr'] = [
                    'class' =>  $clsOuter
                ];
            break;

            case 'choice_emotive':
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
                $input_ops['choice_attr'] = function ($category, $key, $index) {
                    return ['class' => 'custom-control custom-radio emoticon-radio '.strtolower($key)];
                };
                $input_ops['attr'] = [
                    'class' =>  'radio-wrapper-outer'
                ];
            break;

            case 'choice':
                $input_type_class = ChoiceType::class;

                $input_ops['attr'] = [
                    'class' => 'selectpicker col-12',
                    'title' => 'Please select...',
                    'autocomplete' => 'off',
                    'data-dropup-auto' => 'false',
                    'data-size' => 'auto'
                ];
                $input_ops['choices'] = $this->getQuestionAnswerOps($question);
            break;

            case 'text':
                $input_type_class = TextType::class;
                $input_ops['attr'] = [
                    'placeholder' => 'Enter your answer here',
                    'autocomplete' => 'off'
                ];
                $input_ops['wrapper_class'] = 'text-input-outer text';
            break;

            case 'float':
            case 'float_spend_weekly':
                $input_type_class = NumberType::class;
                $input_ops['attr'] = [
                    'placeholder' => 'Enter number',
                    'autocomplete' => 'off'
                ];
                $input_ops['wrapper_class'] = 'text-input-outer number';
                if ($input_type==='float_spend_weekly') {
                    $input_ops['attr']['class'] = 'money';
                    $input_ops['attr']['step'] = '0.01';
                    $input_ops['input_group_html'] = '<span class="input-group-addon text-pre">
                        &pound;
                      </span>';
                    $input_ops['input_addon_before'] = true;
                }
            break;

            default:
                if (0 === strpos($input_type, 'date')) {
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
            ->add('value', $input_type_class ?? '', $input_ops)
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
