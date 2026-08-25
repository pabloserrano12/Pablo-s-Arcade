"use strict";

/* ===========================================
   SNAKE - PARTE 1
=========================================== */

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");

const restartButton = document.getElementById("restart");
const pauseButton = document.getElementById("pause");
const backButton = document.getElementById("backButton");

const GRID_SIZE = 20;
const TILE_COUNT = canvas.width / GRID_SIZE;

let snake = [
    {x:10,y:10}
];

let direction = {x:1,y:0};
let nextDirection = {x:1,y:0};

let apple = {};

let score = 0;
let paused = false;
let gameOver = false;

let gameLoop;

/* ===========================================
   MANZANA
=========================================== */

function spawnApple(){

    apple.x = Math.floor(Math.random()*TILE_COUNT);
    apple.y = Math.floor(Math.random()*TILE_COUNT);

    for(const part of snake){

        if(part.x===apple.x && part.y===apple.y){

            spawnApple();
            return;

        }

    }

}

/* ===========================================
   DIBUJAR
=========================================== */

function drawBoard(){

    ctx.fillStyle="#0f172a";
    ctx.fillRect(0,0,canvas.width,canvas.height);

}

function drawSnake(){

    ctx.fillStyle="#22c55e";

    snake.forEach((part,index)=>{

        if(index===0){

            ctx.fillStyle="#4ade80";

        }else{

            ctx.fillStyle="#22c55e";

        }

        ctx.fillRect(

            part.x*GRID_SIZE,

            part.y*GRID_SIZE,

            GRID_SIZE-2,

            GRID_SIZE-2

        );

    });

}

function drawApple(){

    ctx.fillStyle="#ef4444";

    ctx.beginPath();

    ctx.arc(

        apple.x*GRID_SIZE+GRID_SIZE/2,

        apple.y*GRID_SIZE+GRID_SIZE/2,

        GRID_SIZE/2.5,

        0,

        Math.PI*2

    );

    ctx.fill();

}

/* ===========================================
   MOVIMIENTO
=========================================== */

function moveSnake(){

    direction = nextDirection;

    const head={

        x:snake[0].x+direction.x,

        y:snake[0].y+direction.y

    };

    snake.unshift(head);

    if(head.x===apple.x && head.y===apple.y){

        score++;

        scoreElement.textContent=score;

        spawnApple();

    }else{

        snake.pop();

    }

}

/* ===========================================
   COLISIONES
=========================================== */

function checkCollision(){

    const head=snake[0];

    if(

        head.x<0 ||

        head.y<0 ||

        head.x>=TILE_COUNT ||

        head.y>=TILE_COUNT

    ){

        gameOver=true;

    }

    for(let i=1;i<snake.length;i++){

        if(

            head.x===snake[i].x &&

            head.y===snake[i].y

        ){

            gameOver=true;

        }

    }

}

/* ===========================================
   UPDATE
=========================================== */

function update(){

    if(paused) return;

    if(gameOver) return;

    moveSnake();

    checkCollision();

    drawBoard();

    drawApple();

    drawSnake();

}

/* ===========================================
   CONTROLES
=========================================== */

function changeDirection(dir){

    switch(dir){

        case "up":

            if(direction.y!==1)

                nextDirection={x:0,y:-1};

        break;

        case "down":

            if(direction.y!==-1)

                nextDirection={x:0,y:1};

        break;

        case "left":

            if(direction.x!==1)

                nextDirection={x:-1,y:0};

        break;

        case "right":

            if(direction.x!==-1)

                nextDirection={x:1,y:0};

        break;

    }

}

document.addEventListener("keydown",event=>{

    switch(event.key){

        case "ArrowUp":
        case "w":
        case "W":

            changeDirection("up");

        break;

        case "ArrowDown":
        case "s":
        case "S":

            changeDirection("down");

        break;

        case "ArrowLeft":
        case "a":
        case "A":

            changeDirection("left");

        break;

        case "ArrowRight":
        case "d":
        case "D":

            changeDirection("right");

        break;

    }

});

/* ===========================================
   BOTONES MÓVIL
=========================================== */

document.getElementById("up").onclick=()=>changeDirection("up");
document.getElementById("down").onclick=()=>changeDirection("down");
document.getElementById("left").onclick=()=>changeDirection("left");
document.getElementById("right").onclick=()=>changeDirection("right");

/* ===========================================
   PAUSA
=========================================== */

pauseButton.onclick=()=>{

    paused=!paused;

    pauseButton.textContent=

        paused ?

        "▶ Continue"

        :

        "⏸ Pause";

};

/* ===========================================
   VOLVER
=========================================== */

backButton.onclick=()=>{

    window.history.back();

};

/* ===========================================
   INICIO
=========================================== */

spawnApple();

drawBoard();

drawApple();

drawSnake();

gameLoop=setInterval(update,120);
/* ===========================================
   RECORD
=========================================== */

const RECORD_KEY = "snakeHighScore";

let highScore = Number(

    localStorage.getItem(RECORD_KEY)

) || 0;

/* ===========================================
   GAME OVER
=========================================== */

function drawGameOver(){

    ctx.fillStyle="rgba(0,0,0,.65)";

    ctx.fillRect(

        0,

        0,

        canvas.width,

        canvas.height

    );

    ctx.fillStyle="white";

    ctx.textAlign="center";

    ctx.font="bold 42px Arial";

    ctx.fillText(

        "GAME OVER",

        canvas.width/2,

        canvas.height/2-30

    );

    ctx.font="24px Arial";

    ctx.fillText(

        "Score: "+score,

        canvas.width/2,

        canvas.height/2+15

    );

    ctx.font="18px Arial";

    ctx.fillText(

        "Press Restart",

        canvas.width/2,

        canvas.height/2+60

    );

}

/* ===========================================
   UPDATE (MEJORADO)
=========================================== */

clearInterval(gameLoop);

function gameTick(){

    if(paused){

        return;

    }

    if(gameOver){

        drawGameOver();

        clearInterval(gameLoop);

        return;

    }

    moveSnake();

    checkCollision();

    drawBoard();

    drawApple();

    drawSnake();

    if(gameOver){

        if(score>highScore){

            highScore=score;

            localStorage.setItem(

                RECORD_KEY,

                highScore

            );

        }

    }

}

gameLoop=setInterval(

    gameTick,

    120

);

/* ===========================================
   REINICIAR
=========================================== */

restartButton.onclick=()=>{

    snake=[

        {

            x:10,

            y:10

        }

    ];

    direction={x:1,y:0};

    nextDirection={x:1,y:0};

    score=0;

    paused=false;

    gameOver=false;

    scoreElement.textContent=0;

    pauseButton.textContent="⏸ Pause";

    spawnApple();

    clearInterval(gameLoop);

    drawBoard();

    drawApple();

    drawSnake();

    gameLoop=setInterval(

        gameTick,

        120

    );

};

/* ===========================================
   DOBLE CLICK PARA PAUSAR
=========================================== */

canvas.addEventListener(

    "dblclick",

    ()=>{

        paused=!paused;

        pauseButton.textContent=

            paused ?

            "▶ Continue"

            :

            "⏸ Pause";

    }

);

/* ===========================================
   EVITAR SCROLL EN MÓVIL
=========================================== */

document.addEventListener(

    "keydown",

    event=>{

        if(

            [

                "ArrowUp",

                "ArrowDown",

                "ArrowLeft",

                "ArrowRight"

            ].includes(event.key)

        ){

            event.preventDefault();

        }

    }

);

/* ===========================================
   MENSAJE DE BIENVENIDA
=========================================== */

console.log(

    "🐍 Snake loaded correctly"

);

console.log(

    "🏆 High Score:",

    highScore

);