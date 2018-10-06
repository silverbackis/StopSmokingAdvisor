<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Class Faq
 * @package AppBundle\Entity
 * @ORM\Entity()
 */
class Faq
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     * @var int|null
     */
    private $id;

    /**
     * @ORM\Column()
     * @var string|null
     */
    private $question;

    /**
     * @ORM\Column(type="text")
     * @var string|null
     */
    private $answer;

    /**
     * @ORM\Column(type="integer")
     * @var int|null
     */
    private $sortOrder;

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return null|string
     */
    public function getQuestion(): ?string
    {
        return $this->question;
    }

    /**
     * @param null|string $question
     */
    public function setQuestion(?string $question): void
    {
        $this->question = $question;
    }

    /**
     * @return null|string
     */
    public function getAnswer(): ?string
    {
        return $this->answer;
    }

    /**
     * @param null|string $answer
     */
    public function setAnswer(?string $answer): void
    {
        $this->answer = $answer;
    }

    /**
     * @return int|null
     */
    public function getSortOrder(): ?int
    {
        return $this->sortOrder;
    }

    /**
     * @param int|null $sortOrder
     */
    public function setSortOrder(?int $sortOrder): void
    {
        $this->sortOrder = $sortOrder;
    }
}
