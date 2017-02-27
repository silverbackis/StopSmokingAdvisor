<?php

namespace PluploadBundle\Exception;

use Symfony\Component\HttpFoundation\JsonResponse;

class PlUploadException extends \RuntimeException implements PlUploadExceptionInterface
{
	const E_DIR_NOT_OPENABLE = 100;
    const E_DIR_NOT_OPENABLE_MESSAGE = 'Failed to open uploads directory';
    const E_FILE_INPUT = 101;
    const E_FILE_INPUT_MESSAGE = 'Failed to open input stream';
    const E_FILE_OUTPUT = 102;
    const E_FILE_OUTPUT_MESSAGE = 'Failed to open output stream';
    const E_FILE_MOVE = 103;
    const E_FILE_MOVE_MESSAGE = 'Failed to move uploaded file';
    const E_DIR_CREATE = 104;
    const E_DIR_CREATE_MESSAGE = 'Upload directory does not exist and could not be created';
    const E_DIR_FIND_PATH = 105;
    const E_DIR_FIND_PATH_MESSAGE = 'Failed to obtain path to upload directory';

	private $httpStatusCode;

	public function __construct($PlUploadErrorCode = 0, $message = null, $httpStatusCode = JsonResponse::HTTP_INTERNAL_SERVER_ERROR, \Exception $previous = null)
    {
        $this->httpStatusCode = $httpStatusCode;
        parent::__construct($message, $PlUploadErrorCode, $previous);
    }

	public function getHttpStatusCode()
    {
        return $this->httpStatusCode;
    }

    public function outputJson()
    {
    	$response = new JsonResponse();
		$response->setData(array(
			"jsonrpc"=>"2.0",
       		"result"=>null,
			"error"=>array(
				"code"=>$this->code,
				"message"=>$this->message
			)
		));
		$response->setStatusCode($this->httpStatusCode);
		return $response;
    }
}