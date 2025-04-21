// started to write this myself but realized ChatGPT is perfect for this... below is ChatGPT code

function isOpen(schedule) {
    const now = new Date();
    const day = now.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentTime = hour * 60 + minute; // Time in minutes since midnight

    // Match current day to a schedule
    let todaySchedule = [];
    if (day >= 1 && day <= 5 && schedule["Monday-Friday"]) {
        todaySchedule = schedule["Monday-Friday"];
    } else if (day === 6 && schedule["Saturday"]) {
        todaySchedule = schedule["Saturday"];
    } else if (day === 0 && schedule["Sunday"]) {
        todaySchedule = schedule["Sunday"];
    }

    // Check if current time falls within the schedule
    for (const [start, end] of todaySchedule) {
        if (currentTime >= start && currentTime < end) {
            return true; // Open
        }
    }
    return false; // Closed
}

// Updated schedules
const buildingSchedules = {
    bonney: {
        "Monday-Friday": [[7 * 60, 24 * 60]], // 7am - midnight
        Saturday: [[10 * 60, 17 * 60]], // 10am - 5pm
        Sunday: [[12 * 60, 24 * 60]] // noon - midnight
    },
    hathorn: {
        "Monday-Friday": [[7 * 60, 24 * 60]],
        Saturday: [[9 * 60, 17 * 60]],
        Sunday: [[9 * 60, 24 * 60]]
    },
    rogerwilliams: {
        "Monday-Friday": [[7 * 60, 24 * 60]],
        Saturday: [[9 * 60, 17 * 60]],
        Sunday: [[9 * 60, 24 * 60]]
    },
    olin: {
        "Monday-Friday": [[7 * 60, 24 * 60]], // Monday-Friday: 7am - midnight
        Saturday: [[7 * 60, 24 * 60]], // Saturday: 7am - midnight
        Sunday: [[10 * 60, 24 * 60]] // Sunday: 10am - midnight
    },
    hedge: {
        "Monday-Friday": [[7 * 60, 24 * 60]],
        Saturday: [[10 * 60, 17 * 60]],
        Sunday: [[12 * 60, 24 * 60]]
    }
};

// Update the status for each building
document.addEventListener("DOMContentLoaded", () => {
    Object.keys(buildingSchedules).forEach(buildingId => {
        const schedule = buildingSchedules[buildingId];
        const statusElement = document.getElementById(`${buildingId}_open`);
        
        if (statusElement) {
            if (isOpen(schedule)) {
                statusElement.innerHTML = `Currently <strong>OPEN</strong>`;
            } else {
                statusElement.innerHTML = `Currently <strong>CLOSED</strong>`;
            }
        }
    });
});

time_box = document.getElementById("current_time")

// concept from https://stackoverflow.com/a/59793572
function timeUpdater() { // function to update the time every second
    time_box.innerText = new Date().toLocaleTimeString() // set the current time in the time box
    setTimeout(timeUpdater, 1000) // Recursion!
}

timeUpdater() // start updating the time every second

const academic_button = document.getElementById("academic_button"); // get the academic button element

function handleClick() { // function to handle button click
    const new_p = document.getElementById("result"); // get the result paragraph
    new_p.innerText = "Classes Start on September 3, 2025!"; // set the result text
}

academic_button.addEventListener("click", handleClick); // add click event listener to the button