const LONGEST_DAY = 15;

const SCHEDULE_TIMES = "times";
const SCHEDULE_GRADES = "grades";
const SCHEDULE_GRADE = "grade";
const SCHEDULE_NAME = "name";
const SCHEDULE_SUBJECTS = "subjects";
const SCHEDULE_DAY = "day";

const SCHEDULE_FILE = "files/schedule.json";

const SCHEDULE_DAYS = [
    "יום כלשהו",
    "ראשון",
    "שני",
    "שלישי",
    "רביעי",
    "חמישי",
    "שישי",
    "שבת"
];

const TRANSIT_DESTINATION = "[TransitDestination]";

const MOOVIT_ENDPOINT = "moovit://directions?";
const WHATSAPP_ENDPOINT = "whatsapp://send?text=";

function schedule_load(callback) {
    fetch(SCHEDULE_FILE, {
        method: "get"
    }).then(response => {
        response.text().then((result) => {
            callback(JSON.parse(result));
        });
    });
}

function schedule_time(minute) {
    const minutes = minute % 60;
    let time = "";
    time += (minute - minutes) / 60;
    time += ":";
    time += (minutes < 10) ? "0" : "";
    time += minutes;
    return time;
}

function schedule_day(day) {
    if (day < SCHEDULE_DAYS.length)
        return SCHEDULE_DAYS[day];
}

function schedule_has_cookie(name) {
    return schedule_pull_cookie(name) !== null;
}

function schedule_pull_cookie(name) {
    name += "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return decodeURIComponent(cookie.substring(name.length, cookie.length));
        }
    }
    return null;
}

function schedule_push_cookie(name, value) {
    const date = new Date();
    date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
    document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + date.toUTCString() + ";domain=" + window.location.hostname + ";path=/";
}

function global_teachers_text(subject) {
    let teachers = "";
    if (subject.hasOwnProperty("teachers")) {
        for (let t = 0; t < subject.teachers.length; t++) {
            let teacher = subject.teachers[t].split(" ")[0];
            if (teachers.length === 0) {
                teachers = teacher;
            } else {
                teachers += " · ";
                teachers += teacher;
            }
        }
    }
    return teachers;
}

function global_time_text(schedule, hour) {
    if (schedule.length > hour)
        return schedule_time(schedule[hour]) + " - " + schedule_time(schedule[hour] + 45);

    return "";
}

function global_messages_load(schedule) {
    // Set message overflow behaviour
    if (ORIENTATION === ORIENTATION_VERTICAL) {
        get("message").style.overflowY = "scroll";
    } else {
        get("message").style.overflowY = "hidden";
    }
    // Check for messages in schedule
    if (schedule.hasOwnProperty("messages")) {
        if (schedule.messages.length > 0) {
            // Sets an interval to switch messages every X(MessageRefreshInterval) seconds
            let index = 0;
            let next = () => {
                if (schedule.messages.length > 0) {
                    get("message").innerText = schedule.messages[index];
                    if (index < schedule.messages.length - 1) {
                        index++;
                    } else {
                        index = 0;
                    }
                }
            };
            next();
            setInterval(next, MESSAGE_REFRESH_INTERVAL);
            show("message");
        } else {
            hide("message");
        }
    } else {
        hide("message");
    }
}

function global_background_load(top, bottom) {
    document.body.style.backgroundImage = "linear-gradient(to bottom," + top + ", " + bottom + ")";
    document.body.style.backgroundColor = top;
    if (window.hasOwnProperty("android")) {
        window.android.colors(top, bottom);
    }
}

function external_callback(endpoint, extra) {
    return function () {
        window.location = endpoint + endpoint;
    };
}