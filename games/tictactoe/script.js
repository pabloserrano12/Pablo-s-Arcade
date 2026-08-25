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

let board=[];

let currentPlayer="X";

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

    board=[

        "","","",

        "","","",

        "","",""

    ];

    currentPlayer="X";

    gameOver=false;

    turnText.textContent="X";

    drawBoard();

}

/*=========================================
DRAW
=========================================*/

function drawBoard(){

    boardElement.innerHTML="";

    for(let i=0;i<9;i++){

        const cell=document.createElement("div");

        cell.className="cell";

        cell.textContent=board[i];

        cell.onclick=()=>play(i);

        boardElement.appendChild(cell);

    }

}

/*=========================================
WIN
=========================================*/

const wins=[

[0,1,2],
[3,4,5],
[6,7,8],

[0,3,6],
[1,4,7],
[2,5,8],

[0,4,8],
[2,4,6]

];

function checkWin(player){

    for(const line of wins){

        if(

            board[line[0]]===player &&

            board[line[1]]===player &&

            board[line[2]]===player

        ){

            return true;

        }

    }

    return false;

}

function checkDraw(){

    return !board.includes("");

}

/*=========================================
PLAY
=========================================*/

function play(index){

    if(gameOver) return;

    if(board[index]!="") return;

    board[index]=currentPlayer;

    drawBoard();

    if(checkWin(currentPlayer)){

        gameOver=true;

        setTimeout(()=>{

            alert(

                currentPlayer+" Wins!"

            );

        },100);

        return;

    }

    if(checkDraw()){

        gameOver=true;

        setTimeout(()=>{

            alert("Draw!");

        },100);

        return;

    }

    currentPlayer=

        currentPlayer==="X"

        ?

        "O"

        :

        "X";

    turnText.textContent=currentPlayer;

    if(

        gameMode==="ai" &&

        currentPlayer==="O" &&

        !gameOver

    ){

        setTimeout(

            aiMove,

            300

        );

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
AI
=========================================*/

function aiMove(){

    if(gameOver) return;

    const empty=[];

    for(let i=0;i<9;i++){

        if(board[i]===""){

            empty.push(i);

        }

    }

    if(empty.length===0) return;

    const move=

        empty[

            Math.floor(

                Math.random()*empty.length

            )

        ];

    play(move);

}