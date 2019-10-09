function mobile_load_grade(grade) {

}

function mobile_grade_load(schedule, name) {
    let grade = null;
    if (SCHEDULE_TIMES in schedule) {
        for (let g = 0; g < schedule[SCHEDULE_TIMES].length; g++) {
            if (SCHEDULE_NAME in schedule[SCHEDULE_TIMES][g] && SCHEDULE_SUBJECTS in schedule[SCHEDULE_TIMES][g]) {
                if (schedule[SCHEDULE_TIMES][g][SCHEDULE_NAME] === name) grade = schedule[SCHEDULE_TIMES][g];
            }
        }
    }
    if (grade !== null) {
        if (SCHEDULE_DAY in schedule &&
            SCHEDULE_SUBJECTS in grade) {
            mobile_glance(grade[SCHEDULE_NAME], schedule_day(schedule[SCHEDULE_DAY]));
            switcher_close();
            mobile_buttons_load(schedule, grade);
            mobile_subjects_load(schedule[SCHEDULE_TIMES], grade[SCHEDULE_SUBJECTS]);
            schedule_push_cookie(GRADE_COOKIE, grade[SCHEDULE_NAME]);
        }
    }
}

function mobile_glance(name, day) {
    mobile_get("name").innerText = name;
    mobile_get("day").innerText = day;
}

function mobile_load(schedule) {
    if (SCHEDULE_GRADES in schedule) {
        if (schedule_has_cookie(GRADE_COOKIE)) {
            mobile_grade_load(schedule_pull_cookie(GRADE_COOKIE));
        } else {
            mobile_grade_load(schedule[SCHEDULE_GRADES][g].name[0]);
        }
    }
    // Nudge iOS users to install the app
    instruct();
}

function mobile_share(text) {
    return () => {
        window.location = "whatsapp://send?text=" + encodeURIComponent(text);
    };
}

function mobile_buttons_load(schedule, grade, separator = "\n") {

    function mobile_export_grade(grade, separator = "\n") {
        if (SCHEDULE_NAME in grade && SCHEDULE_SUBJECTS in grade) {
            let text = grade[SCHEDULE_NAME] + separator;
            for (let h = 0; h <= LONGEST_DAY; h++) {
                if (h.toString() in grade[SCHEDULE_SUBJECTS]) {
                    if (SCHEDULE_NAME in grade[SCHEDULE_SUBJECTS][h]) {
                        text += "\u200F" + h.toString() + ". " + grade[SCHEDULE_SUBJECTS][h][SCHEDULE_NAME] + separator;
                    }
                }
            }
            return text;
        }
        return "";
    }

    let grades = "";
    if (SCHEDULE_GRADES in schedule) {
        for (let g = 0; g < schedule[SCHEDULE_GRADES].length; g++) {
            if (SCHEDULE_GRADE in schedule[SCHEDULE_GRADES][g] && SCHEDULE_GRADE in grade) {
                if (schedule[SCHEDULE_GRADES][g][SCHEDULE_GRADE] === grade[SCHEDULE_GRADE]) {
                    grades += mobile_export_grade(schedule[SCHEDULE_GRADES][g], separator) + separator + separator;
                }
            }
        }
    }
    mobile_get("external-share-grade").addEventListener("click", external_callback(WHATSAPP_ENDPOINT, mobile_export_grade(grade, separator)));
    mobile_get("external-share-grades").addEventListener("click", external_callback(WHATSAPP_ENDPOINT, grades));
    mobile_get("external-transit").addEventListener("click", external_callback(MOOVIT_ENDPOINT, TRANSIT_DESTINATION));
}

function mobile_subjects_load(schedule, subjects) {
    // Clear subjects list
    clear(mobile_get("subjects"));
    // Loop through hours
    for (let h = 0; h <= LONGEST_DAY; h++) {
        // Check if hour exists in subjects
        if (subjects.hasOwnProperty(h)) {
            // Create the subject view
            let subject = make("div", null, ["padded", "coasted", "maximal"]);
            // Create the bottom view
            let bottom = make("div");
            // Make the bottom view a row
            row(bottom);
            // Add teacher names to the bottom view
            bottom.appendChild(make("p", global_teachers_text(subjects[h])));
            // Add beginning and ending times to bottom view
            bottom.appendChild(make("p", global_time_text(schedule, h)));
            // Add subject name and hour to the subject view
            subject.appendChild(make("p", "\u200F" + h.toString() + ". " + subjects[h].name));
            // Add bottom view to subject view
            subject.appendChild(bottom);
            // Hide bottom view
            hide(bottom);
            // Set onclick listener of subject
            subject.addEventListener("click", () => {
                // Check visibility of bottom
                if (!visible(bottom)) {
                    // If not visible, show it
                    show(bottom);
                } else {
                    // If visible, hide it
                    hide(bottom);
                }
            });
            // Add subject to subjects list
            mobile_get("subjects").appendChild(subject);
        }
    }
}

function mobile_get(v) {
    return get("mobile-" + v);
}
