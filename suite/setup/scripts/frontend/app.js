/**
 * Copyright (c) 2019 Nadav Tasher
 * https://github.com/NadavTasher/ScheduleSuite/
 **/

let regularIconFile = null, iOSIconFile = null;

function load() {
    page("welcome");
    setup_colors_changed();
}

function setup() {
    if (regularIconFile !== null &&
        iOSIconFile !== null) {
        if (get("setup-application-name").value.length > 0 &&
            get("setup-application-short").value.length > 0 &&
            get("setup-application-description").value.length > 0 &&
            get("setup-application-access-students").value.length > 0 &&
            get("setup-application-access-teachers").value.length > 0) {
            if (get("setup-access-user").value.length > 0 &&
                get("setup-access-password").value.length > 0) {
                if (get("setup-access-password").value.length >= 8) {
                    // All ok, send request
                    let form = new FormData();
                    // Add icons
                    form.append("icon-regular", regularIconFile);
                    form.append("icon-ios", iOSIconFile);
                    // Create parameters
                    let parameters = {
                        AppName: get("setup-application-name").value,
                        AppShort: get("setup-application-short").value,
                        AppDescription: get("setup-application-description").value,
                        EnabledStudents: get("setup-application-access-students").value,
                        EnabledTeachers: get("setup-application-access-teachers").value,
                        ColorTop: get("setup-colors-top").value,
                        ColorBottom: get("setup-colors-bottom").value,
                        User: get("setup-access-user").value,
                        Password: get("setup-access-password").value
                    };
                    api("scripts/backend/setup/setup.php", "setup", "setup", parameters, (success, result, error) => {
                        if (success) {
                            window.location = "../home";
                        }
                    }, form);
                } else {
                    let dismiss = popup("Passwords must be at least 8 characters. Click to inspect.", 4, "#AA0000DD", () => {
                        page("setup-access");
                        dismiss();
                    });
                }
            } else {
                let dismiss = popup("Authentication information must not be empty. Click to inspect.", 4, "#AA0000DD", () => {
                    page("setup-access");
                    dismiss();
                });
            }
        } else {
            let dismiss = popup("Missing information. Click to inspect.", 4, "#AA0000DD", () => {
                page("setup-application");
                dismiss();
            });
        }
    } else {
        let dismiss = popup("One or more icons missing. Click to inspect.", 4, "#AA0000DD", () => {
            page("setup-icon");
            dismiss();
        });
    }
}

function setup_colors_changed() {
    get("setup-colors-device").style.background = "linear-gradient(to bottom," + get("setup-colors-top").value + ", " + get("setup-colors-bottom").value + ")";
}

function setup_icon_pick_regular() {
    upload((file) => {
        regularIconFile = file;
    });
}

function setup_icon_pick_ios() {
    upload((file) => {
        iOSIconFile = file;
    });
}