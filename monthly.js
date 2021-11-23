const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let today = new Date();
let routines = {};

function loadStorage(date)
{
    let routine = localStorage.getItem(date);
    if (!routine) return "";
    
    routines[date] = JSON.parse(routine);
    let status = routines[date].reduce((acc, element) => (acc + element.done), 0) / routines[date].length;
        
    if (status < 0.33) return "red";
    else if (status < 0.66) return "orange";
    else if (status < 0.99) return "yellow";
    else return "green";
}

function saveStorage(date)
{
    //let routine = [{task: "take a walk", done: 1}, {task: "exercise", done: 1}, {task: "exercise", done: 1}, {task: "exercise", done: 1}];
    localStorage.setItem(date, JSON.stringify(routine));
}

function buildCalendar()
{
    let date = today.toJSON().slice(0,8), i;

    //check if current today is in future
    const actualToday = new Date();
    let forward = document.querySelector("#forward");
    if (date >= actualToday.toJSON().slice(0, 8)) {
        today = actualToday;
        forward.disabled = true;
    }
    else forward.disabled = false;
    

    //make the shape of calendar
    let month = document.querySelector(".month");
    let bound = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
    for (let i = bound; i > 0; i--) {
        let day = document.createElement("div");
        month.appendChild(day);
    }
    bound = new Date(today.getFullYear(), today.getMonth()+1, 0).getDate();
    for (i = 1; i <= today.getDate(); i++) {
        let day = document.createElement("div");
        let status = loadStorage(date+i);
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


    //calculate how many days the user has finished routine for in row
    let days = [ ...document.querySelectorAll(".days span") ];
    bound = today.getDate() - 1;
    for (i = bound; i >= 0; i--) {
        if (!days[i].classList.contains("green")) break;
    }
    let notice = document.querySelector("#notice");
    if (i === bound) notice.innerHTML = '<i class="bi bi-chat-right-quote pe-2"></i>Hurry up! Let\'s kick start getting things done!';
    else if (i === 0) notice.innerHTML = '<i class="bi bi-award pe-2"></i>Completed all your plans this month. Keep up!';
    else if (i === bound - 1) notice.innerHTML = '<i class="bi bi-calendar-check pe-2"></i>Lovely! You finshed everything you planned today.';
    else notice.innerHTML = `<i class="bi bi-emoji-heart-eyes pe-2"></i>Lovely! You have been killing the plans for ${bound-i} days.`;
    
    
    //print today's month & year and mark today with border
    document.querySelector("#month-info").textContent = months[today.getMonth()];
    document.querySelector("#year-info").textContent = today.getFullYear();
    days[bound].parentElement.setAttribute("id", "today");
}

window.addEventListener("load", () => {
    //saveStorage("2021-11-25");
    buildCalendar();
    
    //move to weekly view
    document.querySelectorAll(".days").forEach(day => {
        day.addEventListener("click", () => {
            window.location.href = "weekly.html?date=" + today.toJSON().slice(0,8) + day.textContent;
        });
    });

    //move backwards or forwards in month
    document.querySelector("#backward").addEventListener("click", () => {
        let month = document.querySelector(".month");
        while (month.firstChild) {
            month.removeChild(month.firstChild);
        }
        today.setDate(0);
        buildCalendar();
    });
    document.querySelector("#forward").addEventListener("click", () => {
        let month = document.querySelector(".month");
        while (month.firstChild) {
            month.removeChild(month.firstChild);
        }
        today.setMonth(today.getMonth()+2, 0);
        buildCalendar();
    });
});