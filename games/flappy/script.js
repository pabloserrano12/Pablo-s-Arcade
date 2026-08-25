"use strict";

/*=========================================
    CANVAS
=========================================*/

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const bestElement = document.getElementById("best");

const restartButton = document.getElementById("restartButton");
const backButton = document.getElementById("backButton");
const jumpButton = document.getElementById("jumpButton");

/*=========================================
    CONSTANTS
=========================================*/

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const GROUND = 80;

const GRAVITY = 0.45;
const JUMP = -8.5;

const PIPE_WIDTH = 70;
const PIPE_GAP = 180;
const PIPE_SPEED = 3;

/*=========================================
    GAME
=========================================*/

let started = false;
let gameOver = false;

let score = 0;

let best = Number(

    localStorage.getItem("flappyBest")

) || 0;

bestElement.textContent = best;

/*=========================================
    BIRD
=========================================*/

const bird = {

    x:120,

    y:HEIGHT/2,

    radius:18,

    velocity:0

};

/*=========================================
    PIPES
=========================================*/

const pipes=[];

let pipeSpawn=0;

/*=========================================
    RESET
=========================================*/

function resetGame(){

    started=false;

    gameOver=false;

    score=0;

    scoreElement.textContent=0;

    bird.y=HEIGHT/2;

    bird.velocity=0;

    pipes.length=0;

    pipeSpawn=0;

}

/*=========================================
    INPUT
=========================================*/

function jump(){

    if(gameOver) return;

    started=true;

    bird.velocity=JUMP;

}

document.addEventListener("keydown",e=>{

    if(e.code==="Space"){

        e.preventDefault();

        jump();

    }

});

canvas.addEventListener("click",jump);

jumpButton.onclick=jump;

/*=========================================
    BIRD
=========================================*/

function updateBird(){

    if(!started) return;

    bird.velocity+=GRAVITY;

    bird.y+=bird.velocity;

}

function drawBird(){

    ctx.save();

    ctx.translate(bird.x,bird.y);

    ctx.rotate(
        Math.max(
            -0.5,
            Math.min(0.8,bird.velocity/10)
        )
    );

    // Body
    ctx.fillStyle="#FFD93D";

    ctx.beginPath();

    ctx.ellipse(
        0,
        0,
        20,
        16,
        0,
        0,
        Math.PI*2
    );

    ctx.fill();

    // Wing
    ctx.fillStyle="#F4C542";

    ctx.beginPath();

    ctx.ellipse(
        -4,
        2,
        9,
        6,
        -0.4,
        0,
        Math.PI*2
    );

    ctx.fill();

    // Eye
    ctx.fillStyle="white";

    ctx.beginPath();

    ctx.arc(
        8,
        -5,
        4,
        0,
        Math.PI*2
    );

    ctx.fill();

    // Pupil
    ctx.fillStyle="black";

    ctx.beginPath();

    ctx.arc(
        9,
        -5,
        1.8,
        0,
        Math.PI*2
    );

    ctx.fill();

    // Beak
    ctx.fillStyle="#FF8C00";

    ctx.beginPath();

    ctx.moveTo(18,-2);
    ctx.lineTo(28,2);
    ctx.lineTo(18,6);

    ctx.closePath();

    ctx.fill();

    ctx.restore();

}

/*=========================================
    BACKGROUND
=========================================*/

function drawBackground(){

    ctx.fillStyle="#87CEEB";

    ctx.fillRect(

        0,

        0,

        WIDTH,

        HEIGHT

    );

    ctx.fillStyle="#5cb85c";

    ctx.fillRect(

        0,

        HEIGHT-GROUND,

        WIDTH,

        GROUND

    );

}

/*=========================================
    DRAW
=========================================*/

function draw(){

    drawBackground();

    drawPipes();

    drawBird();

    if(!started){

        ctx.fillStyle="white";

        ctx.font="30px Arial";

        ctx.textAlign="center";

        ctx.fillText(

            "Press SPACE or TAP",

            WIDTH/2,

            120

        );

    }

}
/*=========================================
    LOOP
=========================================*/

function loop(){

    if(!gameOver){

        updateBird();

        updatePipes();

        updateScore();

        checkCollision();

    }

    draw();

    if(gameOver){

        ctx.fillStyle="rgba(0,0,0,.55)";

        ctx.fillRect(

            0,

            0,

            WIDTH,

            HEIGHT

        );

        ctx.fillStyle="white";

        ctx.textAlign="center";

        ctx.font="42px Arial";

        ctx.fillText(

            "GAME OVER",

            WIDTH/2,

            HEIGHT/2-20

        );

        ctx.font="24px Arial";

        ctx.fillText(

            "Press Restart",

            WIDTH/2,

            HEIGHT/2+30

        );

    }

    requestAnimationFrame(loop);

}

restartButton.onclick=resetGame;

backButton.onclick=()=>history.back();

resetGame();

loop();
/*=========================================
    PIPES
=========================================*/



function createPipe(){

    const minTop=60;

    const maxTop=

        HEIGHT-GROUND-

        PIPE_GAP-60;

    const top=

        Math.random()*

        (maxTop-minTop)

        +minTop;

    pipes.push({

        x:WIDTH,

        top,

        bottom:top+PIPE_GAP,

        scored:false

    });

}

function updatePipes(){

    if(!started) return;

    pipeSpawn++;

    if(pipeSpawn>=95){

        pipeSpawn=0;

        createPipe();

    }

    for(let i=pipes.length-1;i>=0;i--){

        pipes[i].x-=PIPE_SPEED;

        if(

            pipes[i].x+PIPE_WIDTH<0

        ){

            pipes.splice(i,1);

        }

    }

}

function drawPipes(){

    ctx.fillStyle="#2ecc71";

    pipes.forEach(pipe=>{

        ctx.fillRect(

            pipe.x,

            0,

            PIPE_WIDTH,

            pipe.top

        );

        ctx.fillRect(

            pipe.x,

            pipe.bottom,

            PIPE_WIDTH,

            HEIGHT-pipe.bottom-GROUND

        );

        ctx.fillStyle="#27ae60";

        ctx.fillRect(

            pipe.x-4,

            pipe.top-18,

            PIPE_WIDTH+8,

            18

        );

        ctx.fillRect(

            pipe.x-4,

            pipe.bottom,

            PIPE_WIDTH+8,

            18

        );

        ctx.fillStyle="#2ecc71";

    });

}
/*=========================================
    COLLISIONS
=========================================*/

function checkCollision(){

    if(

        bird.y-bird.radius<=0

    ){

        gameOver=true;

    }

    if(

        bird.y+bird.radius>=

        HEIGHT-GROUND

    ){

        gameOver=true;

    }

    for(const pipe of pipes){

        if(

            bird.x+bird.radius>pipe.x &&

            bird.x-bird.radius<pipe.x+PIPE_WIDTH

        ){

            if(

                bird.y-bird.radius<pipe.top ||

                bird.y+bird.radius>pipe.bottom

            ){

                gameOver=true;

            }

        }

    }

}

/*=========================================
    SCORE
=========================================*/

function updateScore(){

    for(const pipe of pipes){

        if(

            !pipe.scored &&

            pipe.x+PIPE_WIDTH<bird.x

        ){

            pipe.scored=true;

            score++;

            scoreElement.textContent=score;

            if(score>best){

                best=score;

                bestElement.textContent=best;

                localStorage.setItem(

                    "flappyBest",

                    best

                );

            }

        }

    }

}