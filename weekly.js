let date, day;

// Date of today
function parseURL()
{
    let url = document.location.href;
    let todays = url.split('?date=')[1].split('-');

    let today = new Date(todays[0], todays[1]-1, todays[2]);
    let day = today.getDay();
    const week = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    document.querySelector(".today-d").textContent =
        todays[1] + " " + todays[1] + " " + week[day];
    
    date = today.toJSON().slice(0, 8);
}

/*
LoadHabits
1. 요일값 이용해서 for문으로 이번주에 load해야 하는 date 7개 찾기
2. 찾으면 date로 getItem
3. let archive[date] = JSON.parse로 저장

값 설정
0. 그날을 기준으로 하는 거니까 오늘의 key만 받아오기

1. 그냥 만들었을 때: 0
2. 체크 안 해줬을 때: 0
3. 체크했을 때: 1
4. 지웠을 때 오늘 이후로: undefined => add("disabled")
5. 새로 만들었을 때 오늘 전으로: undefiend => add("disabled")
6. 체크 안 하고 하루 이상 지나갔을 때: 2로 수정해주기!!

save-load 방식 수정
*/

// Accomplishment status
const Status = {
    Empty: 0,
    Done: 1,
    Failed: 2       //필요한지?
};

// Habit object
let habit = {
    name: "",
    status: 0,
};

// Load data when window is loaded
function loadHabits() {
    let archive = [], keys = Object.keys(localStorage), i = 0, key;

    for (; (key = keys[i]); i++) {
        archive.push(JSON.parse(localStorage.getItem(key)));
    }
    archive.forEach(addHabit);
}

window.addEventListener("load", () => {
    loadHabits();
});

// Save habit object to local storage
function saveHabit(habit) {
    // Use name of the habit as key
    localStorage.setItem(habit.name, JSON.stringify(habit));
}

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
        localStorage.removeItem(habit.name); // Remove data from local storage
    });

    let span = document.createElement("span"); // to make it visible when hovered
    span.appendChild(deleteButton);
    //divWeek.appendChild(deleteButton);
    divWeek.appendChild(span);

    // .checkbox
    for (day in week) {
        let checkbox = document.createElement("div");
        checkbox.className = "checkbox " + day; // add 0~6 to distinguish days
        // status of the day (done or failed)
        if (habit.weeklyStatus[day] === Status.Done) {
            checkbox.classList.add("done");
        } else if (habit.weeklyStatus[day] === Status.Failed) {
            checkbox.classList.add("failed");
        }

        // Add eventlistener
        // Click to change status : empty->done->failed
        checkbox.addEventListener("click", () => {
            if (checkbox.classList.contains("done")) {
                checkbox.classList.replace("done", "failed");
                habit.weeklyStatus[checkbox.classList[1]] =
                    Status.Failed; // Update weeklyStatus of habit object
            } else if (checkbox.classList.contains("failed")) {
                checkbox.classList.remove("failed");
                habit.weeklyStatus[checkbox.classList[1]] =
                    Status.Empty;
            } else {
                checkbox.classList.add("done");
                habit.weeklyStatus[checkbox.classList[1]] =
                    Status.Done;
            }

            // Save status
            saveHabit(habit);
        });

        divWeek.appendChild(checkbox); // Append to weekly-accomplishment class
    }

    div.appendChild(divWeek);

    // Append to .contents
    let contents = document.querySelector(".contents");
    contents.appendChild(div);

    saveHabit(habit); // Save to local storage
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

    if(textInput==="") return;

    // Create new habit object
    let newHabit = {
        name: textInput,
        weeklyStatus: [0, 0, 0, 0, 0, 0, 0],
    };
    document.getElementById("nameText").value = ""; // Clear the text
    inputArea.hidden = true;
    addHabit(newHabit);
});