
const targetDate = new Date("july 18, 2026 00:00:00").getTime();

const daySpan = document.querySelectorAll(".value")[0];
const hourSpan = document.querySelectorAll(".value")[1];
const minSpan = document.querySelectorAll(".value")[2];
const secSpan = document.querySelectorAll(".value")[3];

const progressFill = document.querySelector(".fill");


const startDate = new Date().getTime();
const totalTime = targetDate - startDate;

setInterval(() => {

    let now = new Date().getTime();
    let distance = targetDate - now;

    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daySpan.innerText = days.toString().padStart(2, "0");
    hourSpan.innerText = hours.toString().padStart(2, "0");
    minSpan.innerText = minutes.toString().padStart(2, "0");
    secSpan.innerText = seconds.toString().padStart(2, "0");

    let passed = targetDate - distance - startDate;
    let progressPercent = (passed / totalTime) * 100;

    if (progressPercent < 0) progressPercent = 0;
    if (progressPercent > 100) progressPercent = 100;

    progressFill.style.width = progressPercent + "%";

    if (distance < 0) {
        daySpan.innerText = "00";
        hourSpan.innerText = "00";
        minSpan.innerText = "00";
        secSpan.innerText = "00";
        progressFill.style.width = "100%";
    }

}, 1000);