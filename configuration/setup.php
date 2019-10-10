<?php

const CONFIGURATION_FILE = __DIR__ . DIRECTORY_SEPARATOR . "suite.json";

/**
 * This file composes the suite.
 */

$configuration = json_decode(file_get_contents(CONFIGURATION_FILE));

$replacements = [];


function uppercase($input)
{
    return uppercase($input[0]) . substr($input, 1);
}

function list_replacements($object = null)
{
    global $configuration;
    if ($object === null)
        $object = $configuration;
    $replacements = new stdClass();
    foreach ($object as $name => $value) {
        if (is_string($value)) {
            $replacements->$name = $value;
        } else {
            foreach (list_replacements($value) as $nameR => $valueR) {
//                $replacements->
            }
        }
    }
}