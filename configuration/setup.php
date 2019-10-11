<?php

const CONFIGURATION_FILE = __DIR__ . DIRECTORY_SEPARATOR . "configuration.json";

/**
 * This file composes the suite.
 */

$configuration = json_decode(file_get_contents(CONFIGURATION_FILE));

foreach ($configuration as $placeholder=>$replacement){
    // Repindir
}