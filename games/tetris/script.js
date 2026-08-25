"use strict";

/* ==========================================
   TETRIS
   PART 1
========================================== */

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
const linesElement = document.getElementById("lines");

const restartButton = document.getElementById("restart");
const pauseButton = document.getElementById("pause");
const backButton = document.getElementById("backButton");

const COLS = 10;
const ROWS = 20;
const BLOCK = 30;

ctx.scale(BLOCK, BLOCK);

let board = [];

let score = 0;
let level = 1;
let clearedLines = 0;

let paused = false;
let gameOver = false;

let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;

/* ==========================================
   COLORS
========================================== */

const colors = [
    null,
    "#00FFFF",
    "#FFFF00",
    "#AA00FF",
    "#00FF00",
    "#FF0000",
    "#0000FF",
    "#FF8800"
];

/* ==========================================
   PIECES
========================================== */

function createPiece(type){

    switch(type){

        case "T":

            return [

                [0,0,0],
                [1,1,1],
                [0,1,0]

            ];

        case "O":

            return [

                [2,2],
                [2,2]

            ];

        case "L":

            return [

                [0,3,0],
                [0,3,0],
                [0,3,3]

            ];

        case "J":

            return [

                [0,4,0],
                [0,4,0],
                [4,4,0]

            ];

        case "I":

            return [

                [0,5,0,0],
                [0,5,0,0],
                [0,5,0,0],
                [0,5,0,0]

            ];

        case "S":

            return [

                [0,6,6],
                [6,6,0],
                [0,0,0]

            ];

        case "Z":

            return [

                [7,7,0],
                [0,7,7],
                [0,0,0]

            ];

    }

}

/* ==========================================
   BOARD
========================================== */

function createBoard(){

    board=[];

    for(let y=0;y<ROWS;y++){

        board.push(

            new Array(COLS).fill(0)

        );

    }

}

createBoard();

/* ==========================================
   PLAYER
========================================== */

const player={

    pos:{

        x:0,

        y:0

    },

    matrix:null

};

/* ==========================================
   RANDOM PIECE
========================================== */

function randomPiece(){

    const pieces="TJLOSZI";

    return createPiece(

        pieces[

            Math.floor(

                Math.random()*pieces.length

            )

        ]

    );

}

/* ==========================================
   RESET PLAYER
========================================== */

function resetPlayer(){

    player.matrix=randomPiece();

    player.pos.y=0;

    player.pos.x=

        Math.floor(

            COLS/2

        )-

        Math.floor(

            player.matrix[0].length/2

        );

}

/* ==========================================
   DRAW MATRIX
========================================== */

function drawMatrix(matrix,offset){

    matrix.forEach((row,y)=>{

        row.forEach((value,x)=>{

            if(value!==0){

                ctx.fillStyle=

                    colors[value];

                ctx.fillRect(

                    x+offset.x,

                    y+offset.y,

                    1,

                    1

                );

            }

        });

    });

}

/* ==========================================
   DRAW
========================================== */

function draw(){

    ctx.fillStyle="#111827";

    ctx.fillRect(

        0,

        0,

        COLS,

        ROWS

    );

    drawMatrix(

        board,

        {

            x:0,

            y:0

        }

    );

    drawMatrix(

        player.matrix,

        player.pos

    );

}
/* ==========================================
   COLLISION
========================================== */

function collide(board, player){

    const matrix = player.matrix;
    const pos = player.pos;

    for(let y = 0; y < matrix.length; y++){

        for(let x = 0; x < matrix[y].length; x++){

            if(

                matrix[y][x] !== 0 &&

                (
                    board[y + pos.y] &&
                    board[y + pos.y][x + pos.x]

                ) !== 0

            ){

                return true;

            }

        }

    }

    return false;

}

/* ==========================================
   MERGE
========================================== */

function merge(board, player){

    player.matrix.forEach((row,y)=>{

        row.forEach((value,x)=>{

            if(value!==0){

                board[y+player.pos.y][x+player.pos.x]=value;

            }

        });

    });

}

/* ==========================================
   MOVE
========================================== */

function playerMove(dir){

    player.pos.x+=dir;

    if(collide(board,player)){

        player.pos.x-=dir;

    }

}

/* ==========================================
   DROP
========================================== */

function playerDrop(){

    player.pos.y++;

    if(collide(board,player)){

        player.pos.y--;

        merge(board,player);

        resetPlayer();

        arenaSweep();

        updateScore();

        if(collide(board,player)){

            gameOver=true;

        }

    }

    dropCounter=0;

}

/* ==========================================
   ROTATE
========================================== */

function rotate(matrix){

    for(let y=0;y<matrix.length;y++){

        for(let x=0;x<y;x++){

            [

                matrix[x][y],

                matrix[y][x]

            ]=[

                matrix[y][x],

                matrix[x][y]

            ];

        }

    }

    matrix.forEach(row=>row.reverse());

}

function playerRotate(){

    const pos=player.pos.x;

    let offset=1;

    rotate(player.matrix);

    while(collide(board,player)){

        player.pos.x+=offset;

        offset=-(offset+(offset>0?1:-1));

        if(offset>player.matrix[0].length){

            rotate(player.matrix);
            rotate(player.matrix);
            rotate(player.matrix);

            player.pos.x=pos;

            return;

        }

    }

}

/* ==========================================
   UPDATE LOOP
========================================== */

function update(time=0){

    if(paused||gameOver){

        draw();

        if(gameOver){

            drawGameOver();

        }

        requestAnimationFrame(update);

        return;

    }

    const delta=time-lastTime;

    lastTime=time;

    dropCounter+=delta;

    if(dropCounter>dropInterval){

        playerDrop();

    }

    draw();

    requestAnimationFrame(update);

}

/* ==========================================
   CONTROLS
========================================== */

document.addEventListener("keydown",event=>{

    switch(event.key){

        case "ArrowLeft":

            playerMove(-1);

        break;

        case "ArrowRight":

            playerMove(1);

        break;

        case "ArrowDown":

            playerDrop();

        break;

        case "ArrowUp":

            playerRotate();

        break;

    }

});

/* ==========================================
   MOBILE
========================================== */

document.getElementById("left").onclick=()=>playerMove(-1);

document.getElementById("right").onclick=()=>playerMove(1);

document.getElementById("down").onclick=()=>playerDrop();

document.getElementById("rotate").onclick=()=>playerRotate();

pauseButton.onclick=()=>{

    paused=!paused;

    pauseButton.textContent=

        paused ?

        "▶ Resume"

        :

        "⏸ Pause";

};

backButton.onclick=()=>history.back();
/* ==========================================
   CLEAR LINES
========================================== */

function arenaSweep(){

    let rowCount = 1;

    outer:
    for(let y = board.length - 1; y >= 0; y--){

        for(let x = 0; x < board[y].length; x++){

            if(board[y][x] === 0){

                continue outer;

            }

        }

        const row = board.splice(y,1)[0].fill(0);

        board.unshift(row);

        y++;

        clearedLines++;

        score += rowCount * 100;

        rowCount *= 2;

    }

    level = Math.floor(clearedLines / 10) + 1;

    dropInterval = Math.max(

        150,

        1000 - (level - 1) * 80

    );

}

/* ==========================================
   SCORE
========================================== */

function updateScore(){

    scoreElement.textContent = score;
    levelElement.textContent = level;
    linesElement.textContent = clearedLines;

}

/* ==========================================
   GAME OVER
========================================== */

function drawGameOver(){

    ctx.save();

    ctx.scale(1 / BLOCK, 1 / BLOCK);

    ctx.fillStyle = "rgba(0,0,0,.75)";

    ctx.fillRect(

        0,

        0,

        canvas.width,

        canvas.height

    );

    ctx.fillStyle = "white";

    ctx.textAlign = "center";

    ctx.font = "bold 42px Arial";

    ctx.fillText(

        "GAME OVER",

        canvas.width / 2,

        canvas.height / 2 - 20

    );

    ctx.font = "22px Arial";

    ctx.fillText(

        "Press Restart",

        canvas.width / 2,

        canvas.height / 2 + 30

    );

    ctx.restore();

}

/* ==========================================
   RESTART
========================================== */

restartButton.onclick = ()=>{

    createBoard();

    score = 0;

    level = 1;

    clearedLines = 0;

    dropInterval = 1000;

    paused = false;

    gameOver = false;

    resetPlayer();

    updateScore();

};

/* ==========================================
   START
========================================== */

resetPlayer();

updateScore();

requestAnimationFrame(update);
/* ==========================================
   HIGH SCORE
========================================== */

const HIGH_SCORE_KEY = "tetrisHighScore";

let highScore = Number(

    localStorage.getItem(HIGH_SCORE_KEY)

) || 0;

function saveHighScore(){

    if(score > highScore){

        highScore = score;

        localStorage.setItem(

            HIGH_SCORE_KEY,

            highScore

        );

    }

}

/* ==========================================
   IMPROVED DROP
========================================== */

const oldPlayerDrop = playerDrop;

playerDrop = function(){

    oldPlayerDrop();

    updateScore();

    saveHighScore();

};

/* ==========================================
   MOBILE HOLD
========================================== */

function holdButton(id,callback){

    let interval;

    const button=document.getElementById(id);

    button.addEventListener("touchstart",()=>{

        callback();

        interval=setInterval(callback,120);

    });

    button.addEventListener("touchend",()=>{

        clearInterval(interval);

    });

    button.addEventListener("mouseleave",()=>{

        clearInterval(interval);

    });

}

holdButton("left",()=>playerMove(-1));

holdButton("right",()=>playerMove(1));

holdButton("down",()=>playerDrop());

/* ==========================================
   SPACE = HARD DROP
========================================== */

document.addEventListener("keydown",event=>{

    if(event.code==="Space"){

        while(!collide(board,player)){

            player.pos.y++;

        }

        player.pos.y--;

        playerDrop();

    }

});

/* ==========================================
   ESC = PAUSE
========================================== */

document.addEventListener("keydown",event=>{

    if(event.key==="Escape"){

        paused=!paused;

        pauseButton.textContent=

            paused ?

            "▶ Resume"

            :

            "⏸ Pause";

    }

});

/* ==========================================
   AUTO SAVE SCORE
========================================== */

window.addEventListener(

    "beforeunload",

    saveHighScore

);

/* ==========================================
   READY
========================================== */

console.log(

    "🧩 Tetris Loaded"

);

console.log(

    "🏆 High Score:",

    highScore

);