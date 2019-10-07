const UPLOAD_ENDPOINT = "scripts/backend/upload/upload.php";
const UPLOAD_API = "upload";

function load() {
    view("home");
}

/**
 * This function pops up a file select dialog, then uploads the file.
 */
function submit() {
    upload((file, contents) => {
        hide("choose");
        api(UPLOAD_ENDPOINT, UPLOAD_API, "upload", {contents: btoa(contents)}, (success, result, error) => {
            show("choose");
            popup(success ? "Schedule uploaded successfully" : error, 0, success ? "#00AA00E0" : "#AA0000E0");
        }, authenticate());
    }, true);
}