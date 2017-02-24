<?php

namespace AppBundle\Validator\Constraints;

use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Constraint;

use Symfony\Component\Validator\Exception\UnexpectedTypeException;

class VimeoUrlValidator extends ConstraintValidator
{	
	// Modified from URL Validator
	const PATTERN = '~^
		https:\/\/(vimeo\.com\/)(\d{9,12})
	$~ixu';

	/**
     * {@inheritdoc}
     */
	public function validate($value, Constraint $constraint)
    {
    	if (!$constraint instanceof VimeoUrl) {
            throw new UnexpectedTypeException($constraint, __NAMESPACE__.'\Url');
        }

        if (null === $value) {
            return;
        }

        if (!is_scalar($value) && !(is_object($value) && method_exists($value, '__toString'))) {
            throw new UnexpectedTypeException($value, 'string');
        }

        $value = (string) $value;
        if ('' === $value) {
            return;
        }

        if (!preg_match(static::PATTERN, $value)) {
            $this->context->buildViolation($constraint->message)
                ->setParameter('{{ value }}', $this->formatValue($value))
                ->addViolation();

            return;
        }
        $httpcode = false;
        // check it isn't a 404 page
        $ch = curl_init($value);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_VERBOSE, 0);
        curl_setopt($ch, CURLOPT_HEADER, 1);
        curl_setopt($ch, CURLOPT_NOBODY, 1); 
        $output = curl_exec($ch);
		$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		curl_close($ch);

		if($httpcode!==200) {
			$this->context->buildViolation($constraint->httpcodeMessage)
                ->setParameter('{{ value }}', $this->formatValue($value))
                ->setParameter('{{ httpcode }}', $this->formatValue($httpcode))
                ->addViolation();

            return;
		}
    }
}