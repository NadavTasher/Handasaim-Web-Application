<?php


include_once __DIR__ . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . "base" . DIRECTORY_SEPARATOR . "api.php";
include_once __DIR__ . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . "authenticate" . DIRECTORY_SEPARATOR . "api.php";

const HOME_SCHEDULE_FILE = __DIR__ . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . "home" . DIRECTORY_SEPARATOR . "files" . DIRECTORY_SEPARATOR . "schedule.json";
const PARSER_EXECUTABLE_FILE = __DIR__ . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . "parser" . DIRECTORY_SEPARATOR . "parser.jar";
const EMBED_WORKING_DIRECTORY = __DIR__ . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . "embed";
const UPLOAD_WORKING_DIRECTORY = __DIR__ . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . "files" . DIRECTORY_SEPARATOR . "temporary";

const UPLOAD_API = "upload";

api(UPLOAD_API, function ($action, $parameters) {
    $userID = authenticate();
    if ($userID !== null) {
        if ($action === "upload") {
            if (isset($parameters->extension)) {
                if ($parameters->extension === "xls" || $parameters->extension === "xlsx") {
                    if (isset($_FILES["excel"])) {
                        // Write the uploaded file to a proper temporary file
                        $file = UPLOAD_WORKING_DIRECTORY . DIRECTORY_SEPARATOR . "index." . $parameters->extension;
                        move_uploaded_file($_FILES["excel"]["tmp_name"], $file);
                        // Create the schedule.json file
                        shell_exec("java -jar " . PARSER_EXECUTABLE_FILE . " " . $file . " " . HOME_SCHEDULE_FILE);
                        // Create the iframe files
                        $htmlFile = EMBED_WORKING_DIRECTORY . DIRECTORY_SEPARATOR . "index.html";
                        shell_exec("libreoffice --headless --convert-to html --outdir " . EMBED_WORKING_DIRECTORY . " " . $file);
                        file_put_contents($htmlFile, str_replace("<html>", "<html dir='rtl'>", file_get_contents($htmlFile)));
                        return [true, null];
                    }
                    return [false, "No file"];
                }
                return [false, "Wrong file type"];
            }
            return [false, "Missing parameters"];
        }
        return [false, "Unknown action"];
    }
    return [false, "Authentication failure"];
}, false);

echo json_encode($result);