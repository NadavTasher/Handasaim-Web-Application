const MESSAGE_REFRESH_INTERVAL = 5 * 1000;

const SCHEDULE_LONGEST_DAY = 15;

const SCHEDULE_SUBJECTS = "subjects";
const SCHEDULE_MESSAGES = "messages";
const SCHEDULE_TEACHERS = "teachers";
const SCHEDULE_TIMES = "times";
const SCHEDULE_GRADES = "grades";
const SCHEDULE_GRADE = "grade";
const SCHEDULE_NAME = "name";
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
const TOP_COLOR = "[ColorTop]";
const BOTTOM_COLOR = "[ColorBottom]";

const MOOVIT_ENDPOINT = "moovit://directions?";
const WHATSAPP_ENDPOINT = "whatsapp://send?text=";

function global_schedule_load(callback) {
    fetch(SCHEDULE_FILE, {
        method: "get"
    }).then(response => {
        response.text().then((result) => {
            callback(JSON.parse(result));
        });
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
    if (day < SCHEDULE_DAYS.length)
        return SCHEDULE_DAYS[day];
}

function global_times_to_text(schedule, hour) {
    if (schedule.length > hour)
        return global_minute_to_text(schedule[hour]) + " - " + global_minute_to_text(schedule[hour] + 45);

    return "";
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
        setInterval(next, MESSAGE_REFRESH_INTERVAL);
        show(view);
    } else {
        hide(view);
    }
}

function global_background_load() {
    document.body.style.backgroundImage = "linear-gradient(to bottom," + TOP_COLOR + ", " + BOTTOM_COLOR + ")";
    document.body.style.backgroundColor = TOP_COLOR;
    if ("android" in window && "colors" in window.android) {
        window.android.colors(TOP_COLOR, BOTTOM_COLOR);
    }
}

function global_external_callback(endpoint, extra) {
    return function () {
        window.location = endpoint + extra;
    };
}