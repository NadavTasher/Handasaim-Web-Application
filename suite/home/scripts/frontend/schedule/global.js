const GLOBAL_KEYMAN_ENDPOINT = "../keyman/scripts/backend/keyman/keyman,php", GLOBAL_KEYMAN_API = "keyman", GLOBAL_KEYMAN_SESSION_COOKIE = "keyman";
const GLOBAL_MESSAGE_INTERVAL = 5 * 1000;
const GLOBAL_COLOR_TOP = "[ColorTop]";
const GLOBAL_COLOR_BOTTOM = "[ColorBottom]";
const GLOBAL_ENABLED_STUDENTS = [EnabledStudents];
const GLOBAL_ENABLED_TEACHERS = [EnabledTeachers];

const SCHEDULE_LONGEST_DAY = 15;
const SCHEDULE_SUBJECTS = "subjects";
const SCHEDULE_MESSAGES = "messages";
const SCHEDULE_TEACHERS = "teachers";
const SCHEDULE_TIMES = "times";
const SCHEDULE_GRADES = "grades";
const SCHEDULE_GRADE = "grade";
const SCHEDULE_NAME = "name";
const SCHEDULE_DAY = "day";

function global_enabled_students(callback) {
    callback(GLOBAL_ENABLED_STUDENTS);
}

function global_enabled_teachers(callback) {
    if (GLOBAL_ENABLED_TEACHERS) {
        callback(true);
    } else {
        if (global_has_cookie(GLOBAL_KEYMAN_SESSION_COOKIE)) {
            global_keyman_verify(callback);
        } else {
            callback(false);
        }
    }
}

function global_keyman_activate(key) {
    api(GLOBAL_KEYMAN_ENDPOINT, GLOBAL_KEYMAN_API, "activate", {key: key}, (success, session, error) => {
        if (success) {
            global_push_cookie(GLOBAL_KEYMAN_SESSION_COOKIE, session);
            popup("Activated! Click here to reload.", 0, "#00AA00DD", () => window.location.reload());
        } else {
            popup(error, 4000, "#AA0000DD");
        }
    });
}

function global_keyman_verify(callback) {
    api(GLOBAL_KEYMAN_ENDPOINT, GLOBAL_KEYMAN_API, "verify", {session: global_pull_cookie(GLOBAL_KEYMAN_SESSION_COOKIE)}, (success, result, error) => {
        callback(success);
    });
}

function global_has_cookie(name) {
    return global_pull_cookie(name) !== null;
}

function global_pull_cookie(name) {
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

function global_push_cookie(name, value) {
    const date = new Date();
    date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
    document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + date.toUTCString() + ";domain=" + window.location.hostname + ";path=/";
}

function global_teachers_to_text(teachers) {
    let text = "";
    for (let t = 0; t < teachers.length; t++) {
        let teacher = teachers[t].split(" ")[0];
        if (text.length === 0) {
            text = teacher;
        } else {
            text += " · ";
            text += teacher;
        }
    }
    return text;
}

function global_minute_to_text(minute) {
    const minutes = minute % 60;
    let time = "";
    time += (minute - minutes) / 60;
    time += ":";
    time += (minutes < 10) ? "0" : "";
    time += minutes;
    return time;
}

function global_day_to_text(day) {
    let days = [
        "יום כלשהו",
        "ראשון",
        "שני",
        "שלישי",
        "רביעי",
        "חמישי",
        "שישי",
        "שבת"
    ];
    if (day < days.length)
        return days[day];
}

function global_times_to_text(schedule, hour) {
    if (schedule.length > hour)
        return global_minute_to_text(schedule[hour]) + " - " + global_minute_to_text(schedule[hour] + 45);

    return "";
}

function global_schedule_load(callback) {
    fetch("files/schedule.json", {
        method: "get"
    }).then(response => {
        response.text().then((result) => {
            callback(JSON.parse(result));
        });
    });
}

function global_messages_load(messages, view) {
    // Check for messages in schedule
    if (messages.length > 0) {
        // Sets an interval to switch messages every X(MessageRefreshInterval) seconds
        let next = () => {
            let message = messages.shift();
            view.innerText = message;
            messages.push(message);
        };
        next();
        setInterval(next, GLOBAL_MESSAGE_INTERVAL);
        show(view);
    } else {
        hide(view);
    }
}

function global_background_load() {
    document.body.style.backgroundImage = "linear-gradient(to bottom," + GLOBAL_COLOR_TOP + ", " + GLOBAL_COLOR_BOTTOM + ")";
    document.body.style.backgroundColor = GLOBAL_COLOR_TOP;
    if ("android" in window && "colors" in window.android) {
        window.android.colors(GLOBAL_COLOR_TOP, GLOBAL_COLOR_BOTTOM);
    }
}

function global_share_callback(extra) {
    return function () {
        window.location = "whatsapp://send?text=" + extra;
    };
}