<?php


include_once __DIR__ . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . "base" . DIRECTORY_SEPARATOR . "api.php";
include_once __DIR__ . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . "authenticate" . DIRECTORY_SEPARATOR . "api.php";

const HOME_SCHEDULE_FILE = __DIR__ . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . "home" . DIRECTORY_SEPARATOR . "files" . DIRECTORY_SEPARATOR . "schedule.json";
const EMBED_WORKING_DIRECTORY = __DIR__ . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . "embed";
const UPLOAD_WORKING_DIRECTORY = __DIR__ . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . "files" . DIRECTORY_SEPARATOR . "temporary";

const UPLOAD_API = "upload";

api(UPLOAD_API, function ($action, $parameters) {
    $userID = authenticate();
    if ($userID !== null) {
        if ($action === "upload") {
            if (isset($parameters->contents)) {
                // Write the uploaded file to a proper temporary file
                file_put_contents(UPLOAD_WORKING_DIRECTORY . DIRECTORY_SEPARATOR . "input.bin", base64_decode($parameters->contents));

//                shell_exec("libreoffice --convert-to xlsx --outdir " . WORKING_DIRECTORY . " " . EXCEL_FILE . " --headless");

            }
        }
    }
}, false);