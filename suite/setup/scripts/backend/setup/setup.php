<?php

/**
 * Copyright (c) 2019 Nadav Tasher
 * https://github.com/NadavTasher/ScheduleSuite/
 **/

include_once __DIR__ . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . "base" . DIRECTORY_SEPARATOR . "api.php";

const HOME_PATH = __DIR__ . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . "home";
const ICON_REGULAR = HOME_PATH . DIRECTORY_SEPARATOR . "images" . DIRECTORY_SEPARATOR . "icons" . DIRECTORY_SEPARATOR . "app" . DIRECTORY_SEPARATOR . "icon.png";
const ICON_IOS = HOME_PATH . DIRECTORY_SEPARATOR . "images" . DIRECTORY_SEPARATOR . "icons" . DIRECTORY_SEPARATOR . "app" . DIRECTORY_SEPARATOR . "icon_apple.png";

api("setup", function ($action, $parameters) {
    if ($action === "setup") {
        if (isset($_FILES["icon-regular"]) && isset($_FILES["icon-ios"])) {
            if (isset($parameters->AppName) &&
                isset($parameters->AppShort) &&
                isset($parameters->AppDescription) &&
                isset($parameters->ColorTop) &&
                isset($parameters->ColorBottom) &&
                isset($parameters->EnabledStudents) &&
                isset($parameters->EnabledTeachers)) {
                // Write the uploaded file to their place
                move_uploaded_file($_FILES["icon-regular"]["tmp_name"], ICON_REGULAR);
                move_uploaded_file($_FILES["icon-ios"]["tmp_name"], ICON_IOS);
                // Make replacements
                replace_in_path("[AppName]", $parameters->AppName, HOME_PATH);
                replace_in_path("[AppShort]", $parameters->AppShort, HOME_PATH);
                replace_in_path("[AppDescription]", $parameters->AppDescription, HOME_PATH);
                replace_in_path("[ColorTop]", $parameters->ColorTop, HOME_PATH);
                replace_in_path("[ColorBottom]", $parameters->ColorBottom, HOME_PATH);
                replace_in_path("[EnabledStudents]", $parameters->EnabledStudents, HOME_PATH);
                replace_in_path("[EnabledTeachers]", $parameters->EnabledTeachers, HOME_PATH);
                return [true, null];
            }
            return [false, "Missing parameters"];
        }
        return [false, "Missing icons"];
    }
    return [false, "Unknown action"];
}, true);

echo json_encode($result);

function replace_in_path($search, $replacement, $path)
{
    if (is_dir($path)) {
        foreach (glob($path . DIRECTORY_SEPARATOR . "*") as $file) {
            replace_in_path($search, $replacement, $file);
        }
    } else {
        replace_in_file($search, $replacement, $path);
    }
}

function replace_in_file($search, $replacement, $file)
{
    $contents = file_get_contents($file);
    $replaced = str_replace($search, $replacement, $contents);
    if ($contents !== $replaced) {
        file_put_contents($file, $replaced);
    }
}