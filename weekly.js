const week = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
let today;
let routines = {};
let archive = [];

// Make string out of date using local time zone
Date.prototype.string = function () {
    let yyyy = this.getFullYear();
    let mm = this.getMonth() + 1;
    let dd = this.getDate();
    let string = [yyyy, ("0"+mm).slice(-2), ("0" + dd).slice(-2)].join("-");
    
    return string;
}

// Date of today
function parseURL()
{
    let url = document.location.href;
    let todays = url.split('?date=')[1];
    if (!todays) {
        today = new Date();
        todays = [today.getFullYear(), today.getMonth()+1, today.getDate()];
    }
    else {
        todays = todays.split('-');
        today = new Date(todays[0], todays[1]-1, todays[2]);
    }

    document.querySelector(".today").textContent =
        todays[0] + " " + todays[1] + " " + week[today.getDay()];
}

// Correct records of this week in case the user didn't logged in for a while
function correctRecord(firstDate)
{
    let date, dateValue = firstDate.getDate();

    for (let i = 0; i < 30; i++) {
        date = new Date(firstDate);
        date.setDate(dateValue--);
        
        let routine = localStorage.getItem(date.string());
        console.log(date.string());
        if (routine) {
            archive = JSON.parse(routine);
            archive.forEach(habit => habit.stat = 0);
            
            routines[firstDate.string()] = archive;
            return;
        }
    }
    routines[firstDate.string()] = [];
}

// Load data when window is loaded
function loadHabits(date)
{
    let routine = localStorage.getItem(date);
    if (!routine) {
        routines[date] = archive;
        return;
    }
    routines[date] = JSON.parse(routine);
    archive = JSON.parse(routine);
    archive.forEach(habit => habit.stat = 0);
}

function buildWeek()
{
    let dateValue = today.getDate() - today.getDay();
    let date = new Date(today);
    date.setDate(dateValue++);
    correctRecord(date);

    ///date = new Date(today);
    for (let i = 0; i < 6; i++) {
        date = new Date(today);
        date.setDate(dateValue++);
        loadHabits(date.string());
    }
    archive = Object.keys(routines);
    archive.forEach(saveHabits);
    routines[today.string()].forEach(addHabit);
}

function addToStorage(habit) {
    let date = new Date(today);
    dateValue = today.getDate();
    for (let i = 0; i < 7 - today.getDay(); i++) {
        date.setDate(dateValue++);
        let string = date.string();
        routines[string].push(habit);
        
        saveHabits(string);
    }
    console.log(routines);
}

// Save habits to local storage
function saveHabits(date) {
    localStorage.setItem(date, JSON.stringify(routines[date]));
}

window.addEventListener("load", () => {
    parseURL();
    buildWeek();
});

// Accomplishment status
const Status = {
    Empty: 0,
    Done: 1
};

// Create habit element and append to .contents
function addHabit(habit) {
    /*
    <div class="habit-group">
        <div class="habit">habit_name</div>
        <div class="weekly-accomplishment">
            <button class="btn btn-danger" id="delete-button"></button>
            <div class="checkbox 0"></div>
            <div class="checkbox 1"></div>
            <div class="checkbox 2"></div>
            <div class="checkbox 3"></div>
            <div class="checkbox 4"></div>
            <div class="checkbox 5"></div>
            <div class="checkbox 6"></div>
        </div>
    </div>
    */

    // Create habit-group element
    // .habit-group
    let div = document.createElement("div");
    div.className = "habit-group";

    // .habit
    let divHabit = document.createElement("div");
    divHabit.className = "habit";
    divHabit.innerText = habit.name;
    div.appendChild(divHabit);

    // .weekly-accomplishment
    let divWeek = document.createElement("div");
    divWeek.className = "weekly-accomplishment";

    // delete button
    let deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-danger";
    deleteButton.id = "delete-button";
    deleteButton.addEventListener("click", () => {
        div.remove();

        let date = new Date(today);
        dateValue = today.getDate();
        for (let i = 0; i < 7 - today.getDay(); i++) {
            date.setDate(dateValue++);
            let string = date.string();
            let name = div.firstChild.textContent;

            let array = routines[string];
            for (let k = 0; k < array.length; k++) {
                element = array[k];
                if (element.name === name) {
                    array.splice(k, 1); break;
                }
            }
            saveHabits(string);
        }
    });

    // Make button visible when hovered
    let span = document.createElement("span");
    span.appendChild(deleteButton);
    divWeek.appendChild(span);
    //divWeek.appendChild(deleteButton);

    
    // .checkbox
    for (let day = 0; day < 7; day++) {
        let checkbox = document.createElement("div");
        
        // add 0~6 to distinguish days
        checkbox.className = "checkbox " + day;
        
        // status of the day (done or failed)
        let array = routines[archive[day]];
        let element, DNE = true;
        for (let i = 0; i < array.length; i++) {
            element = array[i];
            if (element.name === habit.name) {
                if (element.stat === Status.Done) {
                    checkbox.classList.add("done");
                }
                else if (element.stat === Status.Empty && day < today.getDay()) {
                    checkbox.classList.add("failed");
                }
                DNE = false; break;
            }
        } if (DNE) checkbox.classList.add("disabled");
        
        // Add eventlistener
        // Click to change status : empty->done->failed
        checkbox.addEventListener("click", () => {
            if (checkbox.classList.contains("done")) {
                checkbox.classList.replace("done", "failed");
                element.stat = Status.Empty;
            } else if (checkbox.classList.contains("failed")) {
                checkbox.classList.remove("failed");
            } else {
                checkbox.classList.add("done");
                element.stat = Status.Done;
            }

            // Save status
            saveHabits(archive[day]);
        });

        divWeek.appendChild(checkbox); // Append to weekly-accomplishment class
    }
    div.appendChild(divWeek);

    // Append to .contents
    let contents = document.querySelector(".contents");
    contents.appendChild(div);
}

// Add eventlistener to Add button
let addButton = document.querySelector(".button.add");
let inputArea = document.querySelector(".inputArea");

addButton.addEventListener("click", () => {
    inputArea.hidden ? inputArea.hidden = false : inputArea.hidden = true;
    //inputArea.hidden = false;
});

// Add eventlistener to Submit button
let submitButton = document.querySelector("#submit");
submitButton.addEventListener("click", () => {
    let textInput = document.getElementById("nameText").value;
    if (textInput === "") return;

    // Create new habit object
    let newHabit = {
        name: textInput,
        stat: 0
    };
    // Clear the text
    document.getElementById("nameText").value = "";
    inputArea.hidden = true;

    addToStorage(newHabit);
    addHabit(newHabit);
});