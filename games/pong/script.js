"use strict";

/*=========================================
    PONG V2
    PART 1
=========================================*/

const menu = document.getElementById("menu");
const game = document.getElementById("game");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const playAI = document.getElementById("vsAI");
const playPlayers = document.getElementById("vsPlayer");

const pauseButton = document.getElementById("pauseButton");
const restartButton = document.getElementById("restartButton");
const menuButton = document.getElementById("menuButton");
const backButton = document.getElementById("backButton");

const leftScoreText = document.getElementById("leftScore");
const rightScoreText = document.getElementById("rightScore");

const WIN_SCORE = 10;

let gameMode = "ai";

let paused = false;
let running = false;
let gameFinished = false;

/*=========================================
    OBJECTS
=========================================*/

const paddle = {

    width:16,
    height:110,
    speed:7

};

const left = {

    x:25,
    y:195,
    dy:0,
    score:0

};

const right = {

    x:canvas.width-25-paddle.width,
    y:195,
    dy:0,
    score:0

};

const ball = {

    x:canvas.width/2,
    y:canvas.height/2,

    radius:10,

    dx:5,
    dy:3,

    speed:5

};

/*=========================================
    START GAME
=========================================*/

playAI.onclick=()=>{

    gameMode="ai";

    menu.classList.add("hidden");
    game.classList.remove("hidden");

    resetMatch();

};

playPlayers.onclick=()=>{

    gameMode="players";

    menu.classList.add("hidden");
    game.classList.remove("hidden");

    resetMatch();

};

/*=========================================
    DRAW
=========================================*/

function drawRect(x,y,w,h,color){

    ctx.fillStyle=color;

    ctx.fillRect(x,y,w,h);

}

function drawBall(){

    ctx.beginPath();

    ctx.arc(

        ball.x,
        ball.y,
        ball.radius,
        0,
        Math.PI*2

    );

    ctx.fillStyle="white";

    ctx.fill();

}

function drawMiddle(){

    ctx.fillStyle="#555";

    for(let y=0;y<canvas.height;y+=30){

        ctx.fillRect(

            canvas.width/2-2,

            y,

            4,

            18

        );

    }

}

function draw(){

    ctx.fillStyle="black";

    ctx.fillRect(

        0,
        0,
        canvas.width,
        canvas.height

    );

    drawMiddle();

    drawRect(

        left.x,

        left.y,

        paddle.width,

        paddle.height,

        "white"

    );

    drawRect(

        right.x,

        right.y,

        paddle.width,

        paddle.height,

        "white"

    );

    drawBall();

}

/*=========================================
    PLAYER MOVEMENT
=========================================*/

function movePlayers(){

    left.y+=left.dy;
    right.y+=right.dy;

    left.y=Math.max(

        0,

        Math.min(

            canvas.height-paddle.height,

            left.y

        )

    );

    right.y=Math.max(

        0,

        Math.min(

            canvas.height-paddle.height,

            right.y

        )

    );

}
/*=========================================
    BALL
=========================================*/

function resetBall(){

    ball.x = canvas.width/2;
    ball.y = canvas.height/2;

    ball.speed = 5;

    const angle = (Math.random()*Math.PI/3)-(Math.PI/6);

    const direction = Math.random()<0.5 ? -1 : 1;

    ball.dx = Math.cos(angle)*ball.speed*direction;
    ball.dy = Math.sin(angle)*ball.speed;

}

function moveBall(){

    ball.x += ball.dx;
    ball.y += ball.dy;

    if(ball.y-ball.radius<=0){

        ball.y=ball.radius;
        ball.dy*=-1;

    }

    if(ball.y+ball.radius>=canvas.height){

        ball.y=canvas.height-ball.radius;
        ball.dy*=-1;

    }

}

/*=========================================
    COLLISION
=========================================*/

function paddleCollision(player){

    return (

        ball.x-ball.radius<player.x+paddle.width &&
        ball.x+ball.radius>player.x &&
        ball.y+ball.radius>player.y &&
        ball.y-ball.radius<player.y+paddle.height

    );

}

function bounce(player){

    const hit =

        (ball.y-(player.y+paddle.height/2))

        /(paddle.height/2);

    const angle = hit*(Math.PI/3);

    const dir =

        player===left ? 1 : -1;

    ball.speed += 0.25;

    ball.dx =

        Math.cos(angle)

        *ball.speed

        *dir;

    ball.dy =

        Math.sin(angle)

        *ball.speed;

}

/*=========================================
    AI
=========================================*/

function moveAI(){

    if(gameMode!=="ai") return;

    if(ball.dx>0){

        const target =

            ball.y-paddle.height/2;

        const diff =

            target-right.y;

        const aiSpeed = 5.5;

        if(Math.abs(diff)>4){

            right.y +=

                Math.sign(diff)

                *aiSpeed;

        }

    }

    right.y=Math.max(

        0,

        Math.min(

            canvas.height-paddle.height,

            right.y

        )

    );

}

/*=========================================
    SCORE
=========================================*/

function checkScore(){

    if(ball.x<0){

        right.score++;

        rightScoreText.textContent=

            right.score;

        resetBall();

    }

    if(ball.x>canvas.width){

        left.score++;

        leftScoreText.textContent=

            left.score;

        resetBall();

    }

}

/*=========================================
    UPDATE
=========================================*/

function updatePhysics(){

    movePlayers();

    moveAI();

    moveBall();

    if(paddleCollision(left)){

        bounce(left);

    }

    if(paddleCollision(right)){

        bounce(right);

    }

    checkScore();

}
/*=========================================
    GAME LOOP
=========================================*/

function drawWinner(){

    ctx.fillStyle="rgba(0,0,0,.7)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle="white";
    ctx.textAlign="center";

    ctx.font="bold 48px Arial";

    if(left.score>=WIN_SCORE){

        ctx.fillText(

            "LEFT PLAYER WINS!",

            canvas.width/2,

            canvas.height/2

        );

    }else{

        ctx.fillText(

            gameMode==="ai"

            ?

            "AI WINS!"

            :

            "RIGHT PLAYER WINS!",

            canvas.width/2,

            canvas.height/2

        );

    }

    ctx.font="24px Arial";

    ctx.fillText(

        "Press Restart",

        canvas.width/2,

        canvas.height/2+50

    );

}

function gameLoop(){

    if(running){

        if(!paused && !gameFinished){

            updatePhysics();

        }

        draw();

        if(gameFinished){

            drawWinner();

        }

    }

    requestAnimationFrame(gameLoop);

}

/*=========================================
    WIN CHECK
=========================================*/

const oldCheckScore = checkScore;

checkScore=function(){

    oldCheckScore();

    if(

        left.score>=WIN_SCORE ||

        right.score>=WIN_SCORE

    ){

        gameFinished=true;

    }

};

/*=========================================
    RESET
=========================================*/

function resetMatch(){

    left.score=0;
    right.score=0;

    leftScoreText.textContent=0;
    rightScoreText.textContent=0;

    left.y=195;
    right.y=195;

    paused=false;
    gameFinished=false;

    pauseButton.textContent="⏸ Pause";

    resetBall();

    running=true;

}

restartButton.onclick=resetMatch;

/*=========================================
    MENU
=========================================*/

menuButton.onclick=()=>{

    running=false;

    game.classList.add("hidden");

    menu.classList.remove("hidden");

};

backButton.onclick=()=>{

    history.back();

};

/*=========================================
    PAUSE
=========================================*/

pauseButton.onclick=()=>{

    paused=!paused;

    pauseButton.textContent=

        paused

        ?

        "▶ Resume"

        :

        "⏸ Pause";

};

/*=========================================
    KEYBOARD
=========================================*/

document.addEventListener("keydown",e=>{

    switch(e.key){

        case "w":
        case "W":

            left.dy=-paddle.speed;

        break;

        case "s":
        case "S":

            left.dy=paddle.speed;

        break;

        case "ArrowUp":

            if(gameMode==="players")

                right.dy=-paddle.speed;

        break;

        case "ArrowDown":

            if(gameMode==="players")

                right.dy=paddle.speed;

        break;

    }

});

document.addEventListener("keyup",e=>{

    switch(e.key){

        case "w":
        case "W":
        case "s":
        case "S":

            left.dy=0;

        break;

        case "ArrowUp":
        case "ArrowDown":

            right.dy=0;

        break;

    }

});

/*=========================================
    MOBILE
=========================================*/

function hold(id,callback,stop){

    const button=document.getElementById(id);

    button.addEventListener("touchstart",e=>{

        e.preventDefault();

        callback();

    });

    button.addEventListener("touchend",stop);

}

hold(

    "leftUp",

    ()=>left.dy=-paddle.speed,

    ()=>left.dy=0

);

hold(

    "leftDown",

    ()=>left.dy=paddle.speed,

    ()=>left.dy=0

);

hold(

    "rightUp",

    ()=>{

        if(gameMode==="players")

            right.dy=-paddle.speed;

    },

    ()=>right.dy=0

);

hold(

    "rightDown",

    ()=>{

        if(gameMode==="players")

            right.dy=paddle.speed;

    },

    ()=>right.dy=0

);

/*=========================================
    START
=========================================*/

draw();

resetBall();

gameLoop();