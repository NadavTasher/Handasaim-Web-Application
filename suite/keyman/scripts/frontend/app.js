/**
 * Copyright (c) 2019 Nadav Tasher
 * https://github.com/NadavTasher/ScheduleSuite/
 **/

const KEYMAN_ENDPOINT = "scripts/backend/keyman/keyman.php";
const KEYMAN_API = "keyman";

function load() {
    view("home");
    view("inputs");
}

function submit() {
    hide("inputs");
    api(KEYMAN_ENDPOINT, KEYMAN_API, "generate", {amount: parseInt(get("amount").value)}, (success, result, error) => {
        if (success) {
            let text = "";
            for (let i = 0; i < result.length; i++) {
                if (text.length > 0)
                    text += "\n";
                text += result[i];
            }
            get("output").value = text;
            view("outputs");
        } else {
            show("inputs");
        }
    }, authenticate());
}
