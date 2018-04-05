<?php

namespace AppBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class VimeoUrl extends Constraint
{
    public $message = 'Sorry, {{ value }} is not a valid Vimeo share URL. It should be something like https://vimeo.com/123456789';
    public $httpcodeMessage = 'Sorry, the URL {{ value }} seems to be the correct format for a link, but Vimeo returned HTTP code {{ httpcode }} and it should be 200. It is likely the video is not publically available or has been removed.';
}
