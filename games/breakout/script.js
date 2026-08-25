"use strict";

/*=========================================
    BREAKOUT
    PART 1
=========================================*/

const canvas=document.getElementById("gameCanvas");
const ctx=canvas.getContext("2d");

const scoreText=document.getElementById("score");
const livesText=document.getElementById("lives");

const pauseButton=document.getElementById("pauseButton");
const restartButton=document.getElementById("restartButton");
const backButton=document.getElementById("backButton");

let paused=false;
let gameOver=false;
let win=false;

/*=========================================
    PLAYER
=========================================*/

const paddle={

    width:130,
    height:16,

    x:385,
    y:570,

    speed:8,
    dx:0

};

/*=========================================
    BALL
=========================================*/

const ball={

    x:450,
    y:450,

    radius:9,

    dx:4,
    dy:-4

};

/*=========================================
    SCORE
=========================================*/

let score=0;
let lives=3;

/*=========================================
    BRICKS
=========================================*/

const brick={

    rows:8,
    cols:10,

    width:78,
    height:24,

    padding:8,

    offsetTop:50,

    offsetLeft:28

};

const bricks=[];

const colors={

    3:"#ff2d2d", // Red
    2:"#ff9500", // Orange
    1:"#ffd60a"  // Yellow

};

function createBricks(){

    bricks.length = 0;

    for(let r=0;r<brick.rows;r++){

        bricks[r]=[];

        for(let c=0;c<brick.cols;c++){

            let health;

            if(r<2){

                health=3;

            }else if(r<5){

                health=2;

            }else{

                health=1;

            }

            bricks[r][c]={

                x:

                    brick.offsetLeft+

                    c*(brick.width+brick.padding),

                y:

                    brick.offsetTop+

                    r*(brick.height+brick.padding),

                health,

                broken:false

            };

        }

    }

}

createBricks();

/*=========================================
    DRAW
=========================================*/

function drawPaddle(){

    ctx.fillStyle="#ffffff";

    ctx.fillRect(

        paddle.x,

        paddle.y,

        paddle.width,

        paddle.height

    );

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

function drawBricks(){

    for(let r=0;r<brick.rows;r++){

        for(let c=0;c<brick.cols;c++){

            const b=bricks[r][c];

            if(b.broken) continue;

            ctx.fillStyle=

                colors[b.health];

            ctx.fillRect(

                b.x,

                b.y,

                brick.width,

                brick.height

            );

        }

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

    drawBricks();

    drawPowerUps();

    drawPaddle();

    drawBall();

}

/*=========================================
    PLAYER MOVE
=========================================*/

function movePaddle(){

    paddle.x+=paddle.dx;

    if(paddle.x<0)

        paddle.x=0;

    if(

        paddle.x+paddle.width>

        canvas.width

    ){

        paddle.x=

        canvas.width-

        paddle.width;

    }

}
/*=========================================
    BALL MOVEMENT
=========================================*/

function moveBall(){

    ball.x += ball.dx;
    ball.y += ball.dy;

    // Left / Right walls
    if(ball.x - ball.radius <= 0){

        ball.x = ball.radius;
        ball.dx *= -1;

    }

    if(ball.x + ball.radius >= canvas.width){

        ball.x = canvas.width - ball.radius;
        ball.dx *= -1;

    }

    // Top wall
    if(ball.y - ball.radius <= 0){

        ball.y = ball.radius;
        ball.dy *= -1;

    }

}

/*=========================================
    PADDLE COLLISION
=========================================*/

function paddleCollision(){

    if(

        ball.y + ball.radius >= paddle.y &&
        ball.y - ball.radius <= paddle.y + paddle.height &&
        ball.x >= paddle.x &&
        ball.x <= paddle.x + paddle.width

    ){

        const hit =

            (ball.x - (paddle.x + paddle.width/2))

            /(paddle.width/2);

        const angle = hit * (Math.PI/3);

        const speed =

            Math.sqrt(

                ball.dx*ball.dx +

                ball.dy*ball.dy

            ) + 0.12;

        ball.dx = speed * Math.sin(angle);

        ball.dy = -speed * Math.cos(angle);

    }

}

/*=========================================
    BRICK COLLISION
=========================================*/

function brickCollision(){

    for(let r=0;r<brick.rows;r++){

        for(let c=0;c<brick.cols;c++){

            const b = bricks[r][c];

            if(b.broken) continue;

            if(

                ball.x + ball.radius > b.x &&
                ball.x - ball.radius < b.x + brick.width &&
                ball.y + ball.radius > b.y &&
                ball.y - ball.radius < b.y + brick.height

            ){

                b.health--;

ball.dy*=-1;

if(b.health<=0){

    b.broken=true;

spawnPowerUp(

    b.x+

    brick.width/2-13,

    b.y

);

score+=

    doubleScore

    ?

    20

    :

    10;

scoreText.textContent=score;

}

            }

         }
    }

}
/*=========================================
    POWER UPS
=========================================*/

const powerUps=[];

const POWER_CHANCE=0.15;

const TYPES=[

    "big",

    "slow",

    "life",

    "double"

];

let doubleScore=false;
let slowTimer=null;
let bigTimer=null;
let doubleTimer=null;

let normalBallSpeed=4;

let paddleNormalWidth=130;
/*=========================================
    LIVES
=========================================*/

function checkBottom(){

    if(ball.y - ball.radius > canvas.height){

        lives--;

        livesText.textContent = lives;

        if(lives <= 0){

            gameOver = true;

            return;

        }

        resetBall();

    }

}

/*=========================================
    WIN
=========================================*/

function checkWin(){

    let remaining = 0;

    for(let r=0;r<brick.rows;r++){

        for(let c=0;c<brick.cols;c++){

            if(!bricks[r][c].broken){

                remaining++;

            }

        }

    }

    if(remaining===0){

        win=true;

    }

}

/*=========================================
    RESET BALL
=========================================*/

function resetBall(){

    ball.x = canvas.width/2;
    ball.y = 450;

    ball.dx = 4 * (Math.random()<0.5 ? -1 : 1);
    ball.dy = -4;

}
/*=========================================
    SPAWN POWERUP
=========================================*/

function spawnPowerUp(x,y){

    if(Math.random()>POWER_CHANCE) return;

    powerUps.push({

        x,

        y,

        width:26,

        height:26,

        speed:3,

        type:

            TYPES[

                Math.floor(

                    Math.random()

                    *TYPES.length

                )

            ]

    });

}

/*=========================================
    DRAW POWERUPS
=========================================*/

function drawPowerUps(){

    powerUps.forEach(p=>{

        switch(p.type){

            case "big":

                ctx.fillStyle="#22c55e";

            break;

            case "slow":

                ctx.fillStyle="#3b82f6";

            break;

            case "life":

                ctx.fillStyle="#ef4444";

            break;

            case "double":

                ctx.fillStyle="#a855f7";

            break;

        }

        ctx.fillRect(

            p.x,

            p.y,

            p.width,

            p.height

        );

    });

}
/*=========================================
    UPDATE POWERUPS
=========================================*/

function updatePowerUps(){

    for(let i=powerUps.length-1;i>=0;i--){

        const p=powerUps[i];

        p.y+=p.speed;

        if(

            p.x+p.width>paddle.x &&
            p.x<paddle.x+paddle.width &&
            p.y+p.height>paddle.y &&
            p.y<paddle.y+paddle.height

        ){

            activatePowerUp(p.type);

            powerUps.splice(i,1);

            continue;

        }

        if(p.y>canvas.height){

            powerUps.splice(i,1);

        }

    }

}

/*=========================================
    ACTIVATE
=========================================*/

function activatePowerUp(type){

    switch(type){

        case "big":

            clearTimeout(bigTimer);

            paddle.width=200;

            bigTimer=setTimeout(()=>{

                paddle.width=130;

            },10000);

        break;

        case "slow":

            clearTimeout(slowTimer);

            ball.dx*=0.65;
            ball.dy*=0.65;

            slowTimer=setTimeout(()=>{

                ball.dx/=0.65;
                ball.dy/=0.65;

            },8000);

        break;

        case "life":

            lives=Math.min(5,lives+1);

            livesText.textContent=lives;

        break;

        case "double":

            clearTimeout(doubleTimer);

            doubleScore=true;

            doubleTimer=setTimeout(()=>{

                doubleScore=false;

            },10000);

        break;

    }

}
/*=========================================
    GAME LOOP
=========================================*/

function drawMessage(title, subtitle){

    ctx.fillStyle="rgba(0,0,0,.7)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle="white";
    ctx.textAlign="center";

    ctx.font="bold 48px Arial";
    ctx.fillText(title, canvas.width/2, canvas.height/2);

    ctx.font="24px Arial";
    ctx.fillText(subtitle, canvas.width/2, canvas.height/2+50);

}

function update(){

    if(!paused && !gameOver && !win){

        movePaddle();

        moveBall();

        paddleCollision();

        brickCollision();

        updatePowerUps();

        checkBottom();

        checkWin();

    }

    draw();

    if(gameOver){

        drawMessage("GAME OVER","Press Restart");

    }

    if(win){

        drawMessage("YOU WIN!","All bricks destroyed!");

    }

    requestAnimationFrame(update);

}

/*=========================================
    KEYBOARD
=========================================*/

document.addEventListener("keydown",e=>{

    switch(e.key){

        case "ArrowLeft":
        case "a":
        case "A":

            paddle.dx=-paddle.speed;

        break;

        case "ArrowRight":
        case "d":
        case "D":

            paddle.dx=paddle.speed;

        break;

    }

});

document.addEventListener("keyup",e=>{

    switch(e.key){

        case "ArrowLeft":
        case "ArrowRight":
        case "a":
        case "A":
        case "d":
        case "D":

            paddle.dx=0;

        break;

    }

});

/*=========================================
    MOBILE
=========================================*/

function hold(id,dir){

    const btn=document.getElementById(id);

    btn.addEventListener("touchstart",e=>{

        e.preventDefault();

        paddle.dx=dir*paddle.speed;

    });

    btn.addEventListener("touchend",()=>{

        paddle.dx=0;

    });

}

hold("left",-1);
hold("right",1);

/*=========================================
    BUTTONS
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

restartButton.onclick=()=>{

    score=0;
    lives=3;

    scoreText.textContent=score;
    livesText.textContent=lives;

    paused=false;
    gameOver=false;
    win=false;

    paddle.x=(canvas.width-paddle.width)/2;
    paddle.dx=0;

    createBricks();
    powerUps.length=0;

doubleScore=false;

paddle.width=130;

clearTimeout(bigTimer);
clearTimeout(slowTimer);
clearTimeout(doubleTimer);
    resetBall();

    pauseButton.textContent="⏸ Pause";

};

backButton.onclick=()=>{

    history.back();

};

/*=========================================
    START
=========================================*/

resetBall();

draw();

requestAnimationFrame(update);