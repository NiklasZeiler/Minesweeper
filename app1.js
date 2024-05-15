// Dislpay/UI

import { TILE_STATUSES, createBoard, markTile, revealTile, checkWin, checkLose } from "./minesweeper.js";



// const BORD_SIZE = 9;
// const NUMBER_OF_MINES = 10;


let board;
let size = document.querySelector("#size");
const boardElement = document.querySelector(".board");
const minesLeft = document.querySelector("[data-mine-count]")
const buttonImage = document.querySelector('#newGame');
let timer = document.querySelector("#timer");
let interval;

const STANDARD_BORD_SIZE = 9;
const STANDARD_NUMBER_OF_MINES = 10;


const clickHandler = () => {
    let s = 0;
    timer.innerHTML = s;
    interval = setInterval(() => {
        timer.innerHTML = ++s;
    }, 1000);

    boardElement.removeEventListener("click", clickHandler);
};

boardElement.addEventListener("click", clickHandler);

// boardElement.addEventListener("click", () => {
//     let s = 0
//     timer.innerHTML = s;
//     setInterval(() => {
//         timer.innerHTML = ++s;
//     }, 1000)
// })


// Initialize the standard board on page load
document.addEventListener("DOMContentLoaded", () => {
    setupBoard(STANDARD_BORD_SIZE, STANDARD_NUMBER_OF_MINES);
});


// create and disply the board
function setupBoard(BORD_SIZE, NUMBER_OF_MINES) {
    // clear the existing board elements
    while (boardElement.firstChild) {
        boardElement.removeChild(boardElement.firstChild);
    }

    // create a new board
    board = createBoard(BORD_SIZE, NUMBER_OF_MINES);
    board.forEach(row => {
        row.forEach(tile => {
            boardElement.append(tile.element);
            tile.element.addEventListener("click", () => {
                revealTile(board, tile);
                checkGameEnd();
            });
            tile.element.addEventListener("contextmenu", e => {
                e.preventDefault();
                markTile(tile);
                listMinesLeft();
            });
        });
    });
    // Update the board size and mines left display
    boardElement.style.setProperty("--size", BORD_SIZE);
    minesLeft.textContent = NUMBER_OF_MINES;
}


// set the size of board with the value from inptu field
size.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        let newSize;
        if (size.value.trim() === "") {
            newSize = STANDARD_BORD_SIZE;
        } else {
            newSize = parseInt(size.value);
        }

        if (newSize === 9) {
            const newNumberOfMines = 10
            setupBoard(newSize, newNumberOfMines)
        } else {
            const newNumberOfMines = Math.floor(newSize * newSize * 0.16);
            setupBoard(newSize, newNumberOfMines)
        }
        ;
    }
});


// reload the page if you click on the smiley
buttonImage.addEventListener("click", () => {
    location.reload();
})

// showes how many mines are left
function listMinesLeft() {
    const markedTilesCount = board.reduce((count, row) => {
        return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
    }, 0)
    minesLeft.textContent = NUMBER_OF_MINES - markedTilesCount;
}


// check if the game is finished
function checkGameEnd() {
    const win = checkWin(board);
    const lose = checkLose(board);

    if (win || lose) {
        boardElement.addEventListener("click", stopProp, { capture: true });
        boardElement.addEventListener("contextmenu", stopProp, { capture: true });
    }
    if (win) {
        buttonImage.innerHTML = "&#x1F60E;"
        clearInterval(interval);

    }

    if (lose) {
        buttonImage.innerHTML = "&#x1F635"
        board.forEach(row => {
            row.forEach(tile => {
                if (tile.status === TILE_STATUSES.MARKED) markTile(tile)
                if (tile.mine) revealTile(board, tile)
            })
        })
        clearInterval(interval);
    }
}


// if the game is finished you can`t click on the board
function stopProp(e) {
    e.stopPropagation();
}




