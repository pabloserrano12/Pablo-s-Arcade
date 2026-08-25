"use strict";

/*=========================================
    2048
    PART 1
=========================================*/

const boardElement = document.getElementById("board");
const scoreElement = document.getElementById("score");

const restartButton = document.getElementById("restartButton");
const backButton = document.getElementById("backButton");

const SIZE = 4;

let score = 0;

let board = [];

/*=========================================
    CREATE BOARD
=========================================*/

function createBoard(){

    board=[];

    for(let r=0;r<SIZE;r++){

        board[r]=[];

        for(let c=0;c<SIZE;c++){

            board[r][c]=0;

        }

    }

}

/*=========================================
    RANDOM TILE
=========================================*/

function addTile(){

    const empty=[];

    for(let r=0;r<SIZE;r++){

        for(let c=0;c<SIZE;c++){

            if(board[r][c]===0){

                empty.push({r,c});

            }

        }

    }

    if(empty.length===0) return;

    const cell=

        empty[

            Math.floor(

                Math.random()*empty.length

            )

        ];

    board[cell.r][cell.c]=

        Math.random()<0.9

        ?

        2

        :

        4;

}

/*=========================================
    DRAW
=========================================*/

function drawBoard(){

    boardElement.innerHTML="";

    for(let r=0;r<SIZE;r++){

        for(let c=0;c<SIZE;c++){

            const tile=document.createElement("div");

            tile.className="tile";

            if(board[r][c]!==0){

                tile.classList.add(

                    "n"+board[r][c]

                );

                tile.textContent=

                    board[r][c];

            }

            boardElement.appendChild(tile);

        }

    }

    scoreElement.textContent=score;

}

/*=========================================
    RESET
=========================================*/

function resetGame(){

    score=0;

    createBoard();

    addTile();

    addTile();

    drawBoard();

}

restartButton.onclick=resetGame;

backButton.onclick=()=>{

    history.back();

};

/*=========================================
    START
=========================================*/

resetGame();
/*=========================================
    MOVE LOGIC
=========================================*/

function slide(row){

    row = row.filter(v => v !== 0);

    for(let i=0;i<row.length-1;i++){

        if(row[i]===row[i+1]){

            row[i] *= 2;

            score += row[i];

            row[i+1] = 0;

        }

    }

    row = row.filter(v => v !== 0);

    while(row.length < SIZE){

        row.push(0);

    }

    return row;

}

function boardsEqual(a,b){

    return JSON.stringify(a)===JSON.stringify(b);

}

/*=========================================
    MOVES
=========================================*/

function moveLeft(){

    const before=JSON.stringify(board);

    for(let r=0;r<SIZE;r++){

        board[r]=slide(board[r]);

    }

    if(before!==JSON.stringify(board)){

        addTile();

        drawBoard();

    }

}

function moveRight(){

    const before=JSON.stringify(board);

    for(let r=0;r<SIZE;r++){

        board[r]=

            slide(

                [...board[r]].reverse()

            ).reverse();

    }

    if(before!==JSON.stringify(board)){

        addTile();

        drawBoard();

    }

}

function moveUp(){

    const before=JSON.stringify(board);

    for(let c=0;c<SIZE;c++){

        let col=[];

        for(let r=0;r<SIZE;r++){

            col.push(board[r][c]);

        }

        col=slide(col);

        for(let r=0;r<SIZE;r++){

            board[r][c]=col[r];

        }

    }

    if(before!==JSON.stringify(board)){

        addTile();

        drawBoard();

    }

}

function moveDown(){

    const before=JSON.stringify(board);

    for(let c=0;c<SIZE;c++){

        let col=[];

        for(let r=0;r<SIZE;r++){

            col.push(board[r][c]);

        }

        col=

            slide(

                col.reverse()

            ).reverse();

        for(let r=0;r<SIZE;r++){

            board[r][c]=col[r];

        }

    }

    if(before!==JSON.stringify(board)){

        addTile();

        drawBoard();

    }

}
/*=========================================
    GAME STATE
=========================================*/

function checkWin(){

    for(let r=0;r<SIZE;r++){

        for(let c=0;c<SIZE;c++){

            if(board[r][c]===2048){

                alert("🎉 You Win!");

                return true;

            }

        }

    }

    return false;

}

function canMove(){

    for(let r=0;r<SIZE;r++){

        for(let c=0;c<SIZE;c++){

            if(board[r][c]===0){

                return true;

            }

            if(

                c<SIZE-1 &&

                board[r][c]===board[r][c+1]

            ){

                return true;

            }

            if(

                r<SIZE-1 &&

                board[r][c]===board[r+1][c]

            ){

                return true;

            }

        }

    }

    return false;

}

function afterMove(){

    drawBoard();

    if(checkWin()) return;

    if(!canMove()){

        setTimeout(()=>{

            alert("💀 Game Over");

        },100);

    }

}

/*=========================================
    KEYBOARD
=========================================*/

document.addEventListener("keydown",e=>{

    switch(e.key){

        case "ArrowLeft":

            moveLeft();

        break;

        case "ArrowRight":

            moveRight();

        break;

        case "ArrowUp":

            moveUp();

        break;

        case "ArrowDown":

            moveDown();

        break;

        default:

            return;

    }

    afterMove();

});

/*=========================================
    MOBILE
=========================================*/

document.getElementById("left").onclick=()=>{

    moveLeft();

    afterMove();

};

document.getElementById("right").onclick=()=>{

    moveRight();

    afterMove();

};

document.getElementById("up").onclick=()=>{

    moveUp();

    afterMove();

};

document.getElementById("down").onclick=()=>{

    moveDown();

    afterMove();

};

/*=========================================
    RESTART
=========================================*/

restartButton.onclick=()=>{

    resetGame();

};

/*=========================================
    FIRST DRAW
=========================================*/

drawBoard();