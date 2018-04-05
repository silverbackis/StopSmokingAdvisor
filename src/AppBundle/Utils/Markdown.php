<?php

namespace AppBundle\Utils;

class Markdown
{
    private $parser;

    public function __construct()
    {
        $this->parser = new \Parsedown();
    }

    public function toHtml($text)
    {
        $html = $this->parser->setBreaksEnabled(true)->text($text);

        return $html;
    }
}
