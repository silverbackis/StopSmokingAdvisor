<?php

namespace PlUploadBundle\Utils;

use PlUploadBundle\Exception\PlUploadException;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;
use Symfony\Component\Finder\SplFileInfo;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Filesystem\Exception\IOException;

class PlUploadHandler
{
    protected $cleanUp = true;
    protected $cleanUpMaxFileAge = 60 * 60; // 1 hour
    protected $createUploadDir = true;
    protected $tempSuffix = '.part';

    /**
     * @var string
     */
    protected $uploadDir;

    /**
     * @var Symfony\Component\HttpFoundation\Request
     */
    protected $request;

    /**
     * @var Symfony\Component\Filesystem\Filesystem
     */
    protected $filesystem;

    /**
     * @param Symfony\Component\HttpFoundation\Request $request
     * @param Symfony\Component\Filesystem\Filesystem $filesystem
     * @param string $uploadDir
     */
    public function __construct(Filesystem $filesystem, $uploadDir = "uploads")
    {
        $this->uploadDir  = rtrim($uploadDir, "/");
        $this->filesystem = $filesystem;
    }

    /**
     * @param boolean $cleanUp
     */
    public function setCleanUp($cleanUp)
    {
        $this->cleanUp = $cleanUp;
    }

    /**
     * @param boolean $createUploadDir
     */
    public function setCreateUploadDir($createUploadDir)
    {
        $this->createUploadDir = $createUploadDir;
    }

    /**
     * Update script time limit if not configured in php ini
     * @param int $minutes
     */
    public function setTimeLimit($minutes = 5)
    {
        set_time_limit($minutes * 60);
    }

    /**
     * Make the upload directory
     * @return PlUploadHandler
     */
    public function createUploadDir()
    {
        $this->filesystem->mkdir($this->uploadDir);
        return $this;
    }

    /**
     * Extract file name from request - from sample upload.php provided by plupload
     *
     * @return string
     */
    public function extractFileName()
    {
        if ($this->request->get('name')) {
            $fileName = $this->request->get('name');
        } elseif ($this->request->files->get('file')) {
            $fileName = $this->request->files->get('file')->getFilename();
        } else {
            $fileName = uniqid('file_');
        }
        return $fileName;
    }

    /**
     * Remove all old partially uploaded files
     */
    public function cleanUp()
    {
        $finder = new Finder();
        $finder->files()->in($this->uploadDir)->name('*.'.$this->tempSuffix);
        /**
         * @var Symfony\Component\Finder\SplFileInfo
         */
        foreach ($finder as $file) {
            if ($file->getMTime() < time() - $this->maxFileAge) {
                $file = null;
                unlink($file->getRelativePath());
            }
        }
    }

    /**
     * Handle uploaded file
     * @return JsonResponse or string
     * @throws PlUploadException
     */
    public function handle(Request $request)
    {
        $this->request = $request;
        if ($this->createUploadDir) {
            try {
                $this->createUploadDir();
            } catch (IOException $e) {
            }
        }
        if (!is_dir($this->uploadDir)) {
            throw new PlUploadException(
                PlUploadException::E_DIR_CREATE,
                PlUploadException::E_DIR_CREATE_MESSAGE
            );
        }
        if (!is_readable($this->uploadDir)) {
            throw new PlUploadException(
                PlUploadException::E_DIR_NOT_OPENABLE,
                PlUploadException::E_DIR_NOT_OPENABLE_MESSAGE
            );
        }

        $fileName = null;
        $extractedName = $this->extractFileName();
        $nameParts = pathinfo($extractedName);
        // Get a file name
        // do not overwrite files
        $count = -1;
        while (null === $fileName || file_exists($uploadedFilePath)) {
            $count++;
            $fileName = $nameParts['filename']."-$count.".$nameParts['extension'];
            $uploadedFilePath = $this->uploadDir . DIRECTORY_SEPARATOR . $fileName;
        }

        // Check if chunking is enabled
        $chunk  = $this->request->get('chunk') ? (int) $this->request->get('chunk') : 0;
        $chunks = $this->request->get('chunks') ? (int) $this->request->get('chunks') : 0;

        // Open temp file - output stream.
        // Append if chunked, otherwise will be writing a new file
        $handleFlag        = $chunks ? "ab" : "wb";
        $partialFileHandle = fopen($uploadedFilePath . $this->tempSuffix, $handleFlag);
        if (!$partialFileHandle) {
            throw new PlUploadException(
                PlUploadException::E_FILE_OUTPUT,
                PlUploadException::E_FILE_OUTPUT_MESSAGE
            );
        }

        if ($this->request->files->count() > 0) {
            /*
             * Handle HTML4-style non-chunked file upload
             */
            
            // We have the entire file - check if all is OK with it
            $file = $this->request->files->get('file');
            if ($file->getError() || !file_exists($file->getPathname())) {
                throw new PlUploadException(
                    PlUploadException::E_FILE_MOVE,
                    PlUploadException::E_FILE_MOVE_MESSAGE
                );
            }

            // Input stream is the temporary file
            $inputHandle = fopen($file->getPathname(), "rb");
            if (!$inputHandle) {
                throw new PlUploadException(
                    PlUploadException::E_FILE_INPUT,
                    PlUploadException::E_FILE_INPUT_MESSAGE
                );
            }
        } else {
            // Real input stream
            $inputHandle = @fopen("php://input", "rb");
            if (!$inputHandle) {
                throw new PlUploadException(
                    PlUploadException::E_FILE_INPUT,
                    PlUploadException::E_FILE_INPUT_MESSAGE
                );
            }
        }
        
        /**
         * Read input stream and write to partial file
         */
        while ($buff = fread($inputHandle, 4096)) {
            fwrite($partialFileHandle, $buff);
        }
        fclose($partialFileHandle);
        fclose($inputHandle);
        
        /*
         * Rename the file from .part to real file if this is either
         * the last chunk or it is not a chunked upload
         */
        if (!$chunks || $chunk == $chunks - 1) {
            rename($uploadedFilePath . $this->tempSuffix, $uploadedFilePath);

            // Remove old temp files - only when we have a completed file upload
            // Don't want it taking up resources on every chunk upload
            if ($this->cleanUp) {
                $this->cleanUp();
            }
            return $uploadedFilePath;
        }

        // Return success response
        $response = new JsonResponse(array(
               "jsonrpc"=>"2.0",
               "result"=>null,
               "id"=>"pluploader"
           ), JsonResponse::HTTP_OK);
        return $response;
    }
}
