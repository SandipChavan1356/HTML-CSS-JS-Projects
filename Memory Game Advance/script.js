let icons = ["🍎","🍌","🍇","🍉","🍓","🍒"];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let time = 0;
let timerInterval = null;

const gameBoard = document.getElementById("game-board");
const timeText = document.getElementById("time");
const movesText = document.getElementById("moves");
const popup = document.getElementById("win-popup");

function startGame() {
    popup.classList.add("hidden");
    gameBoard.innerHTML = "";
    moves = 0;
    time = 0;
    firstCard = secondCard = null;
    movesText.textContent = moves;
    timeText.textContent = time;

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        time++;
        timeText.textContent = time;
    }, 1000);

    let totalIcons = [...icons, ...icons];
    totalIcons.sort(() => Math.random() - 0.5);

    totalIcons.forEach(icon => createCard(icon));
}

function createCard(icon) {
    const card = document.createElement("div");
    card.classList.add("cards");
    card.setAttribute("data-icon", icon);

    card.innerHTML = `
        <div class="inner">
            <div class="front"></div>
            <div class="back">${icon}</div>
        </div>
    `;

    card.addEventListener("click", () => handleFlip(card));
    gameBoard.appendChild(card);
}

function handleFlip(card) {
    if (lockBoard || card === firstCard) return;

    card.classList.add("flipped");

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    moves++;
    movesText.textContent = moves;

    lockBoard = true;

    checkMatch();
}

function checkMatch() {
    let match =
        firstCard.dataset.icon === secondCard.dataset.icon;

    if (match) {
        firstCard.onclick = null;
        secondCard.onclick = null;

        resetTurn();
        checkWin();
    } else {
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            resetTurn();
        }, 800);
    }
}

function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function checkWin() {
    let flippedCards = document.querySelectorAll(".flipped");
    if (flippedCards.length === icons.length * 2) {
        clearInterval(timerInterval);
        document.getElementById("final-time").textContent = time;
        document.getElementById("final-moves").textContent = moves;
        popup.classList.remove("hidden");
    }
}

document.getElementById("restart").addEventListener("click", startGame);

startGame();