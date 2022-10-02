const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('coundownForm');
const dateEl = document.getElementById('date-picker');
const dateCalendar = document.getElementById('date');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

let countdownTitle = '';
let countdownDate = '';
let countdownValue = Date;
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// set date input min with today's date
dateCalendar.value = new Date().toISOString().slice(0, 10)
dateCalendar.min = new Date().toISOString().slice(0, 10)

// populate countdown  / complete ui
function updateDom() {
countdownActive = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownValue - now;
        //console.log(distance);

        const days = Math.floor(distance / day);
        const hours = Math.floor((distance % day) / hour);
        const minutes = Math.floor((distance % hour) / minute);
        const seconds = Math.floor((distance % minute) / second);
        console.log(days, hours, minutes, seconds);

        // hide input
        inputContainer.hidden = true;

        // if the countdwn has ended, show complete
        if (distance < 0) {
            countdownEl.hidden = true;
            clearInterval(countdownActive);
            completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
            completeEl.hidden = false;
        } else {
            // else show countdown in progress
            countdownElTitle.textContent = `${countdownTitle}`;
            timeElements[0].textContent = `${days}`;
            timeElements[1].textContent = `${hours}`;
            timeElements[2].textContent = `${minutes}`;
            timeElements[3].textContent = `${seconds}`;
            completeEl.hidden = true;
            countdownEl.hidden = false;
        }


    }, second);


}

// take values from form
function updateCountdown(e) {
    e.preventDefault();
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    savedCountdown = {
        title: countdownTitle,
        date: countdownDate,
    };
    localStorage.setItem('countdown', JSON.stringify(savedCountdown));

    // check for valid date
    if (countdownDate === '') {
        alert('please select a date for the countdown.');
    } else {
        // get number version of current date
        countdownValue = new Date(countdownDate).getTime();
        updateDom();
    }

}

// Reset all values
function reset() {
    // hide countown and show input
    countdownEl.hidden = true;
    completeEl.hidden = true;
    inputContainer.hidden = false;

    // stop countdown
    clearInterval(countdownActive);

    // reset values
    countdownTitle = '';
    countdownDate = '';
    localStorage.removeItem('countdown');
}

function restorePreviousCountdown() {
    // get from local storage if available
    if(localStorage.getItem('countdown')) {
        inputContainer.hideen = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDom();
    }
}

// event listeners
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

// on load check local storage
restorePreviousCountdown();