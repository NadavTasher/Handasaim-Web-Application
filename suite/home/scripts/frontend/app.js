

const ORIENTATION = screen.width > screen.height;
const ORIENTATION_HORIZONTAL = true;
const ORIENTATION_VERTICAL = false;

function load() {
    view("home");
    global_background_load();
    global_schedule_load((schedule) => {
        if (ORIENTATION === ORIENTATION_HORIZONTAL) {
            view("desktop");
            desktop_load(schedule);
        } else {
            view("mobile");
            mobile_load(schedule);
        }
    });

}