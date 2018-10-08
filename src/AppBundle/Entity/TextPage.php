<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity()
 * @author Daniel West <daniel@silverback.is>
 */
class TextPage
{
    /**
     * @ORM\Id()
     * @ORM\Column()
     * @var string|null
     */
    private $id;

    /**
     * @ORM\Column(type="text")
     * @var string|null;
     */
    private $htmlContent;

    /**
     * TestPage constructor.
     * @param null|string $id
     * @param null|string $htmlContent
     */
    public function __construct(?string $id = null, ?string $htmlContent = null)
    {
        $this->id = $id;
        $this->htmlContent = $htmlContent;
    }

    /**
     * @return null|string
     */
    public function getId(): ?string
    {
        return $this->id;
    }

    /**
     * @return null|string
     */
    public function getHtmlContent(): ?string
    {
        return $this->htmlContent;
    }

    /**
     * @param null|string $id
     * @return self
     */
    public function setId(?string $id): self
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @param null|string $htmlContent
     * @return self
     */
    public function setHtmlContent(?string $htmlContent): self
    {
        $this->htmlContent = $htmlContent;
        return $this;
    }
}
