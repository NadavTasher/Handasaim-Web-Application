<?php

/**
 * Copyright (c) 2019 Nadav Tasher
 * https://github.com/NadavTasher/ScheduleSuite/
 **/

include_once __DIR__ . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . "base" . DIRECTORY_SEPARATOR . "api.php";
include_once __DIR__ . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . "authenticate" . DIRECTORY_SEPARATOR . "api.php";

const KEYMAN_DIRECTORY = __DIR__ . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . "files" . DIRECTORY_SEPARATOR . "keyman";
const KEYMAN_KEYS_DATABASE = KEYMAN_DIRECTORY . DIRECTORY_SEPARATOR . "keys.json";
const KEYMAN_SESSIONS_DATABASE = KEYMAN_DIRECTORY . DIRECTORY_SEPARATOR . "sessions.json";
const KEYMAN_API = "keyman";

api(KEYMAN_API, function ($action, $parameters) {
    if ($action === "generate") {
        $user = authenticate();
        if ($user !== null) {
            if (isset($parameters->amount)) {
                $keys = keyman_generate(intval($parameters->amount));
                return [true, $keys];
            }
            return [false, "Missing parameters"];
        }
        return [false, "Authentication failure"];
    } else {
        if ($action === "activate") {
            if (isset($parameters->key)) {
                if (keyman_key_exists($parameters->key)) {
                    $session = keyman_key_activate($parameters->key);
                    return [true, $session];
                }
                return [false, "Key not found"];
            }
            return [false, "Missing parameters"];
        } else if ($action === "verify") {
            if (isset($parameters->session)) {
                return [keyman_session_valid($parameters->session), null];
            }
            return [false, "Missing parameters"];
        }
    }
    return [false, "Unknown action"];
}, true);

echo json_encode($result);

function keyman_generate($amount = 1)
{
    $database = keyman_keys_load();
    $keys = array();
    for ($k = 0; $k < $amount; $k++) {
        $key = random(8);
        array_push($keys, $key);
        $salt = random(256);
        $hashed = authenticate_hash($key, $salt);
        $database->$hashed = $salt;
    }
    keyman_keys_unload($database);
    return $keys;
}

function keyman_key_exists($key)
{
    $database = keyman_keys_load();
    foreach ($database as $hash => $salt) {
        if ($hash === authenticate_hash($key, $salt))
            return true;
    }
    return false;
}

function keyman_key_activate($key)
{
    if (keyman_key_exists($key)) {
        $database = keyman_keys_load();
        foreach ($database as $hash => $salt) {
            if ($hash === authenticate_hash($key, $salt))
                unset($database->$hash);
        }
        keyman_keys_unload($database);
        return keyman_session_generate();
    }
    return null;
}

function keyman_session_generate()
{
    $database = keyman_sessions_load();
    $session = random(512);
    $salt = random(512);
    $hashed = authenticate_hash($session, $salt);
    $database->$hashed = $salt;
    keyman_sessions_unload($database);
    return $session;
}

function keyman_session_valid($session)
{
    $database = keyman_sessions_load();
    foreach ($database as $hash => $salt) {
        if ($hash === authenticate_hash($session, $salt))
            return true;
    }
    return false;
}

function keyman_sessions_load()
{
    return json_decode(file_get_contents(KEYMAN_SESSIONS_DATABASE));
}

function keyman_sessions_unload($database)
{
    file_put_contents(KEYMAN_SESSIONS_DATABASE, json_encode($database));
}

function keyman_keys_load()
{
    return json_decode(file_get_contents(KEYMAN_KEYS_DATABASE));
}

function keyman_keys_unload($database)
{
    file_put_contents(KEYMAN_KEYS_DATABASE, json_encode($database));
}