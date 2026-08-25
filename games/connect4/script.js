"use strict";

/*=========================================
    ELEMENTS
=========================================*/

const menu=document.getElementById("menu");
const game=document.getElementById("game");

const aiButton=document.getElementById("aiButton");
const playerButton=document.getElementById("playerButton");

const boardElement=document.getElementById("board");

const turnText=document.getElementById("turn");

const restartButton=document.getElementById("restartButton");
const menuButton=document.getElementById("menuButton");
const backButton=document.getElementById("backButton");

/*=========================================
    GAME
=========================================*/

const ROWS=6;
const COLS=7;

let board=[];

let currentPlayer=1;

let gameMode="players";

let gameOver=false;

/*=========================================
    START
=========================================*/

aiButton.onclick=()=>{

    gameMode="ai";

    startGame();

};

playerButton.onclick=()=>{

    gameMode="players";

    startGame();

};

function startGame(){

    menu.classList.add("hidden");

    game.classList.remove("hidden");

    resetGame();

}

/*=========================================
    RESET
=========================================*/

function resetGame(){

    board=[];

    for(let r=0;r<ROWS;r++){

        board.push([]);

        for(let c=0;c<COLS;c++){

            board[r].push(0);

        }

    }

    currentPlayer=1;

    gameOver=false;

    turnText.textContent="Red";

    drawBoard();

}

/*=========================================
    DRAW
=========================================*/

function drawBoard(){

    boardElement.innerHTML="";

    for(let r=0;r<ROWS;r++){

        for(let c=0;c<COLS;c++){

            const cell=document.createElement("div");

            cell.className="cell";

            if(board[r][c]===1){

                cell.classList.add("red");

            }

            if(board[r][c]===2){

                cell.classList.add("yellow");

            }

            cell.onclick=()=>dropPiece(c);

            boardElement.appendChild(cell);

        }

    }

}

/*=========================================
    DROP
=========================================*/

function dropPiece(col){

    if(gameOver) return;

    const player=currentPlayer;

    for(let row=ROWS-1;row>=0;row--){

        if(board[row][col]!==0){

            continue;

        }

        board[row][col]=player;

        drawBoard();

        if(checkWin(player)){

            gameOver=true;

            setTimeout(()=>{

                alert(

                    player===1

                    ?

                    "🔴 Red Wins!"

                    :

                    "🟡 Yellow Wins!"

                );

            },100);

            return;

        }

        if(checkDraw()){

            gameOver=true;

            setTimeout(()=>{

                alert("🤝 Draw!");

            },100);

            return;

        }

        currentPlayer=

            player===1

            ?

            2

            :

            1;

        turnText.textContent=

            currentPlayer===1

            ?

            "Red"

            :

            "Yellow";

        drawBoard();

        if(

            gameMode==="ai" &&

            currentPlayer===2 &&

            !gameOver

        ){

            setTimeout(

                aiMove,

                350

            );

        }

        return;

    }

}

/*=========================================
    BUTTONS
=========================================*/

restartButton.onclick=resetGame;

menuButton.onclick=()=>{

    game.classList.add("hidden");

    menu.classList.remove("hidden");

};

backButton.onclick=()=>history.back();
/*=========================================
    WIN CHECK
=========================================*/

function checkWin(player){

    // Horizontal

    for(let r=0;r<ROWS;r++){

        for(let c=0;c<COLS-3;c++){

            if(

                board[r][c]===player &&
                board[r][c+1]===player &&
                board[r][c+2]===player &&
                board[r][c+3]===player

            ){

                return true;

            }

        }

    }

    // Vertical

    for(let c=0;c<COLS;c++){

        for(let r=0;r<ROWS-3;r++){

            if(

                board[r][c]===player &&
                board[r+1][c]===player &&
                board[r+2][c]===player &&
                board[r+3][c]===player

            ){

                return true;

            }

        }

    }

    // Diagonal ↘

    for(let r=0;r<ROWS-3;r++){

        for(let c=0;c<COLS-3;c++){

            if(

                board[r][c]===player &&
                board[r+1][c+1]===player &&
                board[r+2][c+2]===player &&
                board[r+3][c+3]===player

            ){

                return true;

            }

        }

    }

    // Diagonal ↗

    for(let r=3;r<ROWS;r++){

        for(let c=0;c<COLS-3;c++){

            if(

                board[r][c]===player &&
                board[r-1][c+1]===player &&
                board[r-2][c+2]===player &&
                board[r-3][c+3]===player

            ){

                return true;

            }

        }

    }

    return false;

}

/*=========================================
    DRAW CHECK
=========================================*/

function checkDraw(){

    for(let r=0;r<ROWS;r++){

        for(let c=0;c<COLS;c++){

            if(board[r][c]===0){

                return false;

            }

        }

    }

    return true;

}
/*=========================================
    AI
=========================================*/

function aiMove(){

    if(gameOver) return;

    const valid=[];

    for(let c=0;c<COLS;c++){

        if(board[0][c]===0){

            valid.push(c);

        }

    }

    if(valid.length===0) return;

    const column=

        valid[

            Math.floor(

                Math.random()*valid.length

            )

        ];

    dropPiece(column);

}