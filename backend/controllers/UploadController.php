<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Utils\FileUpload;
use Backend\Utils\Response;

require_once __DIR__ . '/BaseController.php';
require_once __DIR__ . '/../utils/FileUpload.php';
require_once __DIR__ . '/../utils/Response.php';

final class UploadController extends BaseController
{
    public function upload(array $params = []): void
    {
        $folder = (string) ($_POST['folder'] ?? 'misc');
        $oldPath = isset($_POST['old_path']) ? (string) $_POST['old_path'] : null;
        $file = $_FILES['file'] ?? null;

        if (!is_array($file)) {
            Response::error('file is required', 422);
        }

        $uploaded = FileUpload::upload($file, $folder, $oldPath);

        Response::success($uploaded, 'File uploaded successfully', 201);
    }
}
