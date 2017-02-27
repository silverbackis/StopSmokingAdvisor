<?php

namespace PluploadBundle\Exception;

interface PlUploadExceptionInterface
{
	/**
     * Returns the status code.
     *
     * @return int An HTTP response status code
     */
    public function getStatusCode();

    /**
     * Returns error as JSON for PlUploader
     *
     * @return Symfony\Component\HttpFoundation\JsonResponse
     */
    public function outputJson();
}