const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let today = new Date();
let records = [], archive = [];

// Convert Date object into string local time
Date.prototype.string = function () {
    let yyyy = this.getFullYear();
    let mm = this.getMonth() + 1;
    let dd = this.getDate();

    return [yyyy, ("0" + mm).slice(-2), ("0" + dd).slice(-2)].join("-");
}

let definedHabit = {
    name: "",
    stat : 0
}

// Load data when new calendar of a month is needed
function loadStorage(date, dayValue)
{
    let data = localStorage.getItem(date);
    if (data) records = JSON.parse(data);
    else {
        records = [];
        archive.forEach(habit => {
            if (habit.days[dayValue] && habit.created <= date && habit.deleted > date) {
                definedHabit.name = habit.name;
                records.push(definedHabit);
            }
        });
    }
    if (records.length === 0) return "";
    let status = records.reduce((acc, record) => (acc + record.stat), 0) / records.length;
    
    if (status < 0.33) return "red";
    else if (status < 0.66) return "orange";
    else if (status < 0.99) return "yellow";
    else return "green";
}

function saveStorage(date)
{
    let data = [{name: "take a walk", days: [1, 1, 1, 1, 1, 1, 1], created: "2021-10-29", deleted:"3", category:"운동=#f00000"},
                    {name: "exercise", days: [1, 1, 1, 1, 1, 1, 1], created: "2021-10-29", deleted:"3",  category:"운동=#f00000"},
                    {name: "mylove", days: [1, 1, 1, 1, 1, 1, 1], created: "2021-10-29", deleted:"3",  category:"운동=#f00000"},
                    {name: "youare", days: [1, 1, 1, 1, 1, 1, 1], created: "2021-10-29", deleted:"3",  category:"운동=#f00000"}];
    localStorage.setItem("habits", JSON.stringify(data));
}

// Build the page of monthly view
function buildMonth()
{
    let date = today.string().slice(0,8), i;

    // Check if current today is in future
    const actualToday = new Date();
    let forward = document.querySelector("#forward");
    if (date >= actualToday.string().slice(0, 8)) {
        today = actualToday;
        forward.disabled = true;
    }
    else forward.disabled = false;
    
    // Correct records of this week in case the user didn't logged in for a while
    let data = localStorage.getItem("habits");
    if (data) archive = JSON.parse(data);

    // Make the shape of calendar
    let month = document.querySelector(".month");
    let bound = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
    for (let i = bound; i > 0; i--) {
        let day = document.createElement("div");
        month.appendChild(day);
    }
    let dayValue = bound;
    bound = new Date(today.getFullYear(), today.getMonth()+1, 0).getDate();
    for (i = 1; i <= today.getDate(); i++, dayValue++) {
        let day = document.createElement("div");
        let status = loadStorage(date+("0" + i).slice(-2), dayValue % 7);
        day.classList.add("days");
        day.innerHTML = `<span class="${status}">${i}</span>`;
        month.appendChild(day);
    }
    for (; i <= bound; i++) {
        let day = document.createElement("div");
        day.classList.add("days");
        day.innerHTML = `<span>${i}</span>`;
        month.appendChild(day);
    }


    // Calculate how many days the user has finished routine for in row
    let days = [ ...document.querySelectorAll(".days span") ];
    bound = today.getDate() - 1;
    for (i = bound; i >= 0; i--) {
        if (!days[i].classList.contains("green")) break;
    }

    // Show user different messages according to status
    let notice = document.querySelector("#notice");
    if (i === bound) notice.innerHTML = '<i class="bi bi-chat-right-quote pe-2"></i>Hurry up! Let\'s kick start getting things done!';
    else if (i === 0) notice.innerHTML = '<i class="bi bi-award pe-2"></i>Completed all your plans this month. Keep up!';
    else if (i === bound - 1) notice.innerHTML = '<i class="bi bi-calendar-check pe-2"></i>Lovely! You finshed everything you planned today.';
    else notice.innerHTML = `<i class="bi bi-emoji-heart-eyes pe-2"></i>Lovely! You have been killing the plans for ${bound-i} days.`;
    
    
    // Print today's month & year and mark today with border
    document.querySelector("#month-info").textContent = months[today.getMonth()];
    document.querySelector("#year-info").textContent = today.getFullYear();
    days[bound].parentElement.setAttribute("id", "current");


    // Move to weekly view
    document.querySelectorAll(".days").forEach(day => {
        day.addEventListener("click", () => {
            window.location.href = "weekly.html?date=" + today.string().slice(0,8) + ("0" + day.textContent).slice(-2);
        });
    });
}

window.addEventListener("load", () => {
    //saveStorage("2021-10-30");
    buildMonth();
});

// Move backwards or forwards in month
document.querySelector("#backward").addEventListener("click", () => {
    let month = document.querySelector(".month");
    while (month.firstChild) {
        month.removeChild(month.firstChild);
    }
    today.setDate(0);
    buildMonth();
});
document.querySelector("#forward").addEventListener("click", () => {
    let month = document.querySelector(".month");
    while (month.firstChild) {
        month.removeChild(month.firstChild);
    }
    today.setMonth(today.getMonth()+2, 0);
    buildMonth();
});