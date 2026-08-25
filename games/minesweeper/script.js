"use strict";

/*=========================================
ELEMENTS
=========================================*/

const board = document.getElementById("board");

const minesText = document.getElementById("mines");

const timeText = document.getElementById("time");

const message = document.getElementById("message");

const startButton = document.getElementById("startButton");

const restartButton = document.getElementById("restartButton");

const backButton = document.getElementById("backButton");


/*=========================================
GAME VARIABLES
=========================================*/

const rows = 9;

const columns = 9;

const mineCount = 10;

let cells = [];

let mines = [];

let gameStarted = false;

let gameOver = false;

let flags = 0;

let time = 0;

let timer = null;


/*=========================================
CREATE BOARD
=========================================*/

function createBoard(){

    board.innerHTML = "";

    cells = [];

    mines = [];

    flags = 0;

    for(let row = 0; row < rows; row++){

        cells[row] = [];

        for(let column = 0; column < columns; column++){

            const cell =
                document.createElement("button");

            cell.className = "cell";

            cell.dataset.row = row;

            cell.dataset.column = column;

            cell.onclick = () => {

                revealCell(row,column);

            };

            cell.oncontextmenu = event => {

                event.preventDefault();

                toggleFlag(row,column);

            };

            board.appendChild(cell);

            cells[row][column] = {

                element: cell,

                mine: false,

                revealed: false,

                flagged: false,

                number: 0

            };

        }

    }

}


/*=========================================
PLACE MINES
=========================================*/

function placeMines(){

    let placed = 0;

    while(placed < mineCount){

        const row =
            Math.floor(
                Math.random() * rows
            );

        const column =
            Math.floor(
                Math.random() * columns
            );

        if(cells[row][column].mine){

            continue;

        }

        cells[row][column].mine = true;

        mines.push([row,column]);

        placed++;

    }

}


/*=========================================
COUNT NUMBERS
=========================================*/

function calculateNumbers(){

    for(let row = 0; row < rows; row++){

        for(let column = 0; column < columns; column++){

            if(cells[row][column].mine){

                continue;

            }

            let count = 0;

            for(let r = row - 1; r <= row + 1; r++){

                for(
                    let c = column - 1;
                    c <= column + 1;
                    c++
                ){

                    if(

                        r >= 0 &&
                        r < rows &&
                        c >= 0 &&
                        c < columns &&
                        cells[r][c].mine

                    ){

                        count++;

                    }

                }

            }

            cells[row][column].number = count;

        }

    }

}


/*=========================================
START GAME
=========================================*/

function startGame(){

    clearInterval(timer);

    time = 0;

    flags = 0;

    gameStarted = true;

    gameOver = false;

    timeText.textContent = 0;

    minesText.textContent = mineCount;

    message.textContent =
        "Find all the mines!";

    createBoard();

    placeMines();

    calculateNumbers();

    timer = setInterval(() => {

        time++;

        timeText.textContent = time;

    },1000);

}


/*=========================================
INITIAL BOARD
=========================================*/

createBoard();
/*=========================================
REVEAL CELL
=========================================*/

function revealCell(row,column){

    if(gameOver) return;

    const cell = cells[row][column];

    if(cell.revealed || cell.flagged) return;

    /* First click starts the game */

    if(!gameStarted){

        startGame();

        revealCell(row,column);

        return;

    }

    /* Mine */

    if(cell.mine){

        cell.element.classList.add("mine");

        cell.element.textContent = "💣";

        revealAllMines();

        endGame(false);

        return;

    }

    /* Reveal */

    cell.revealed = true;

    cell.element.classList.add("revealed");

    if(cell.number > 0){

        cell.element.textContent =
            cell.number;

    }

    /* Open empty area */

    if(cell.number === 0){

        for(
            let r = row - 1;
            r <= row + 1;
            r++
        ){

            for(
                let c = column - 1;
                c <= column + 1;
                c++
            ){

                if(

                    r >= 0 &&
                    r < rows &&
                    c >= 0 &&
                    c < columns

                ){

                    revealCell(r,c);

                }

            }

        }

    }

    checkWin();

}


/*=========================================
FLAG
=========================================*/

function toggleFlag(row,column){

    if(gameOver) return;

    const cell = cells[row][column];

    if(cell.revealed) return;

    if(cell.flagged){

        cell.flagged = false;

        flags--;

        cell.element.classList.remove("flagged");

        cell.element.textContent = "";

    }else{

        if(flags >= mineCount) return;

        cell.flagged = true;

        flags++;

        cell.element.classList.add("flagged");

        cell.element.textContent = "🚩";

    }

    minesText.textContent =
        mineCount - flags;

}


/*=========================================
REVEAL ALL MINES
=========================================*/

function revealAllMines(){

    mines.forEach(([row,column]) => {

        const cell = cells[row][column];

        cell.element.classList.add("mine");

        cell.element.textContent = "💣";

    });

}


/*=========================================
CHECK WIN
=========================================*/

function checkWin(){

    let safeCells = 0;

    for(let row = 0; row < rows; row++){

        for(let column = 0; column < columns; column++){

            if(

                !cells[row][column].mine &&
                cells[row][column].revealed

            ){

                safeCells++;

            }

        }

    }

    if(safeCells === rows * columns - mineCount){

        endGame(true);

    }

}


/*=========================================
END GAME
=========================================*/

function endGame(won){

    gameOver = true;

    gameStarted = false;

    clearInterval(timer);

    if(won){

        message.textContent =
            "🎉 You Win! Time: " + time + "s";

        mines.forEach(([row,column]) => {

            const cell =
                cells[row][column];

            if(!cell.flagged){

                cell.flagged = true;

                cell.element.classList.add("flagged");

                cell.element.textContent = "🚩";

            }

        });

    }else{

        message.textContent =
            "💥 Game Over!";

    }

}


/*=========================================
BUTTONS
=========================================*/

startButton.onclick = () => {

    startGame();

};

restartButton.onclick = () => {

    startGame();

};

backButton.onclick = () => {

    history.back();

};