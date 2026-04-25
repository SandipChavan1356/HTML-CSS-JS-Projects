const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const resetBtn = document.getElementById('reset-btn');

let board = ["","","","","","","","",""];
let gameActive = true;
let user = "X";

const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

const clickSound = new Audio("https://www.fesliyanstudios.com/play-mp3/387");
const winSound = new Audio("https://www.fesliyanstudios.com/play-mp3/6675");

cells.forEach(cell => {
    cell.addEventListener('click', handleClick);
});

function handleClick(e) {
    const index = e.target.dataset.index;

    if (board[index] !== "" || !gameActive || user !== "X") return;

    makeMove(index, "X");
    clickSound.play();

    if (checkWin("X")) return;

    user = "O";
    status.innerText = "AI thinking... 🤖";

    setTimeout(aiMove, 400);
}

function aiMove() {
    if (!gameActive) return;

    let empty = [];

    board.forEach((val, i) => {
        if (val === "") empty.push(i);
    });

    if (empty.length === 0) return;

    let move = empty[Math.floor(Math.random() * empty.length)];

    makeMove(move, "O");
    clickSound.play();

    if (checkWin("O")) return;

    user = "X";
    status.innerText = "Your turn (X)";
}

function makeMove(i, player) {
    board[i] = player;
    cells[i].textContent = player;
}

function checkWin(player) {
    for (let [a,b,c] of winPatterns) {
        if (
            board[a] &&
            board[a] === board[b] &&
            board[b] === board[c]
        ) {
            gameActive = false;

            status.innerText = `${player} Wins 🎉`;

            winSound.play();
            return true;
        }
    }

    if (!board.includes("")) {
        gameActive = false;
        status.innerText = "Draw 🤝";
        return true;
    }

    return false;
}

resetBtn.addEventListener('click', () => {
    board = ["","","","","","","","",""];
    gameActive = true;
    user = "X";

    cells.forEach(cell => cell.textContent = "");

    status.innerText = "Your turn (X)";
});