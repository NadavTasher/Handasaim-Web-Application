const DESKTOP_SCROLL_INTERVAL = 7 * 1000;
const MESSAGE_REFRESH_INTERVAL = 5 * 1000;
const CLOCK_REFRESH_INTERVAL = 10 * 1000;
const GRADE_COOKIE = "grade";
const
    BOTTOM_COLOR = "[BottomColor]",
    TOP_COLOR = "[TopColor]";

const ORIENTATION = screen.width > screen.height;
const ORIENTATION_HORIZONTAL = true;
const ORIENTATION_VERTICAL = false;

function load() {
    view("home");
    background_load(TOP_COLOR, BOTTOM_COLOR);
    schedule_load((schedule) => {
        messages_load(schedule);
        grades_load(schedule, null);
        if (ORIENTATION === ORIENTATION_HORIZONTAL) {
            desktop_load(schedule);
        } else {
            mobile_load(schedule);
        }
    });

}





function grades_load(schedule) {
    clear("subjects");
    clear("grades");
    if (schedule.hasOwnProperty("schedule") &&
        schedule.hasOwnProperty("day") &&
        schedule.hasOwnProperty("grades")) {
        // Figure out day's length
        let dayLength = 0;
        for (let c = 0; c < schedule.grades.length; c++) {
            let grade = schedule.grades[c];
            if (grade.hasOwnProperty("subjects")) {
                for (let h = 0; h < 15; h++) {
                    if (h > dayLength && grade.subjects.hasOwnProperty(h)) {
                        dayLength = h;
                    }
                }
            }
        }
        // Desktop only, add empty cell to grades and lesson number column
        if (ORIENTATION === ORIENTATION_HORIZONTAL) {
            get("grades").appendChild(make("div", make("p", null), ["padded", "coasted", "minimal"]));
            let column = make("div", null);
            for (let h = 0; h <= dayLength; h++) {
                column.appendChild(make("div", make("p", h.toString()), ["padded", "coasted", "minimal"]));
            }
            get("subjects").appendChild(column);
        }
        // Scan grades
        for (let c = 0; c < schedule.grades.length; c++) {
            let grade = schedule.grades[c];
            let name = make("div", make("p", grade.name), ["padded", "coasted", "minimal"]);
            if (grade.hasOwnProperty("subjects")) {
                if (ORIENTATION === ORIENTATION_HORIZONTAL) {
                    let current = make("div");
                    column(current);
                    subjects_load(schedule.schedule, grade.subjects, current, dayLength);
                    get("subjects").appendChild(current);
                } else {
                    name.onclick = () => {
                        grade_load(schedule, schedule.day, grade);
                    };
                }
            }
            get("grades").appendChild(name);
        }
    }
}




function subjects_load(schedule, subjects, v, dayLength = null) {
    let minimal = dayLength !== null;
    let scan = (!minimal) ? 15 : dayLength;
    clear(v);
    for (let h = 0; h <= scan; h++) {
        let subject;
        if (subjects.hasOwnProperty(h)) {
            let current = subjects[h];
            if (minimal) {
                subject = make("div", null, ["padded", "coasted", "minimal"]);
                subject.appendChild(make("p", "\u200F" + current.name));
            } else {
                subject = make("div", null, ["padded", "coasted", "maximal"]);
                let bottom = make("div");
                hide(bottom);
                row(bottom);
                bottom.appendChild(make("p", teachers_text(current)));
                bottom.appendChild(make("p", time_text(schedule, h)));
                subject.appendChild(make("p", "\u200F" + h.toString() + ". " + current.name));
                subject.appendChild(bottom);
                subject.onclick = () => {
                    if (!visible(bottom)) {
                        show(bottom);
                    } else {
                        hide(bottom);
                    }
                };
            }
        } else if (minimal) {
            // Add an empty square to make the grid complete.
            subject = make("div", null, ["padded", "minimal"]);
        }
        if (subjects.hasOwnProperty(h) || minimal)
            get(v).appendChild(subject);
    }
}





function switcher_open() {
    show("grades");
    get("subjects").style.height = "0";
}

function switcher_close() {
    show("dashboard");
    hide("grades");
    get("subjects").style.height = "100%";
}