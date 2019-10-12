/**
 * Copyright (c) 2019 Nadav Tasher
 * https://github.com/NadavTasher/ScheduleSuite/
 **/

const DESKTOP_SUBJECT_LENGTH_CLAMP = 10;
const DESKTOP_SCROLL_INTERVAL = 7 * 1000;

function desktop_load(schedule) {
    desktop_scroll_load();
    desktop_schedule_load(schedule);
}

function desktop_schedule_load(schedule) {
    let titles = desktop_get("titles");
    let subjects = desktop_get("subjects");
    // Find last hour of day
    let lastHour = 0;
    if (SCHEDULE_GRADES in schedule) {
        for (let g = 0; g < schedule[SCHEDULE_GRADES].length; g++) {
            if (SCHEDULE_SUBJECTS in schedule[SCHEDULE_GRADES][g]) {
                for (let h = 0; h < SCHEDULE_LONGEST_DAY; h++) {
                    if (h.toString() in schedule[SCHEDULE_GRADES][g][SCHEDULE_SUBJECTS])
                        if (lastHour < h)
                            lastHour = h;
                }
            }
        }
    }

    function desktop_schedule_add_column(title, list) {
        let currentColumn = make("div");
        column(currentColumn);
        titles.appendChild(make("div", make("p", title)));
        for (let s = 0; s <= lastHour; s++) {
            currentColumn.appendChild(make("p", (s.toString() in list) ? list[s][SCHEDULE_NAME].substr(0, DESKTOP_SUBJECT_LENGTH_CLAMP) : ""));
        }
        subjects.appendChild(currentColumn);
    }

    // Add a time column
    let timeSubjects = [];
    for (let t = 0; t <= lastHour; t++) {
        let timeSubject = {};
        timeSubject[SCHEDULE_NAME] = t.toString();
        timeSubjects.push(timeSubject);
    }
    desktop_schedule_add_column("", timeSubjects);
    // Add grades
    if (SCHEDULE_GRADES in schedule) {
        for (let g = 0; g < schedule[SCHEDULE_GRADES].length; g++) {
            if (SCHEDULE_NAME in schedule[SCHEDULE_GRADES][g] &&
                SCHEDULE_SUBJECTS in schedule[SCHEDULE_GRADES][g]) {
                desktop_schedule_add_column(schedule[SCHEDULE_GRADES][g][SCHEDULE_NAME], schedule[SCHEDULE_GRADES][g][SCHEDULE_SUBJECTS]);
            }
        }
    }
}

function desktop_scroll_load() {
    let scrollable = desktop_get("subjects");
    let height = parseInt(getComputedStyle(scrollable).height);
    let min = 0;
    let max = scrollable.scrollHeight - height;
    let desktopScrollDirection = true, desktopScrollPaused = false;
    let targetScroll = scrollable.scrollTop;
    setInterval(() => {
        if (!desktopScrollPaused) {
            if (targetScroll >= max ||
                targetScroll <= min)
                desktopScrollDirection = !(targetScroll >= max);
            let toAdd = (desktopScrollDirection ? 1 : -1) * height;
            targetScroll += toAdd;
            scrollable.scrollBy(0, toAdd);
        }
    }, DESKTOP_SCROLL_INTERVAL);
}

function desktop_get(v) {
    return get("desktop-" + v);
}