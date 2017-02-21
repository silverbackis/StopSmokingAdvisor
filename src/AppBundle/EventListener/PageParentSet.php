<?php

namespace AppBundle\EventListener;

use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Event\LifecycleEventArgs;
use AppBundle\Entity\Page;

class PageParentSet implements EventSubscriber
{

    public function getSubscribedEvents()
    {
        return array(
            'prePersist',
            'preUpdate'
        );
    }

    private function setPageParent(LifecycleEventArgs $args)
    {
        $entity = $args->getEntity();

        // only act on "Page" entity
        if (!$entity instanceof Page) {
            return;
        }

        // set the parent if the parentID is set
        if(!is_null($entity->parentID))
        {
            $entityManager = $args->getEntityManager();
            $parentPage = $entityManager->getRepository('AppBundle\Entity\Page')->findById($entity->parentID);
            $entity->setParent($parentPage[0]);
        }
    }

    public function prePersist(LifecycleEventArgs $args)
    {
        $this->setPageParent($args);
    }

    public function preUpdate(LifecycleEventArgs $args)
    {
        $this->setPageParent($args);
    }
}