"use strict";

/*=========================================
ELEMENTS
=========================================*/

const gameArea = document.getElementById("gameArea");

const dino = document.getElementById("dino");

const scoreText = document.getElementById("score");

const bestText = document.getElementById("best");

const message = document.getElementById("message");

const startButton = document.getElementById("startButton");

const restartButton = document.getElementById("restartButton");

const backButton = document.getElementById("backButton");

const cloud = document.getElementById("cloud");


/*=========================================
GAME VARIABLES
=========================================*/

let playing = false;

let jumping = false;

let score = 0;

let best = Number(
    localStorage.getItem("dinoBest")
) || 0;

let speed = 6;

let obstacleInterval = 1500;

let lastTime = 0;

let obstacleTimer = null;

let scoreTimer = null;

let gameLoop = null;


/*=========================================
BEST SCORE
=========================================*/

bestText.textContent = best;


/*=========================================
JUMP
=========================================*/

function jump(){

    if(!playing) return;

    if(jumping) return;

    jumping = true;

    dino.classList.add("jump");

    setTimeout(() => {

        dino.classList.remove("jump");

        jumping = false;

    },550);

}


/*=========================================
CREATE OBSTACLE
=========================================*/

function createObstacle(){

    if(!playing) return;

    const obstacle =
        document.createElement("div");

    obstacle.className = "obstacle";

    obstacle.style.left =
        gameArea.clientWidth + "px";

    gameArea.appendChild(obstacle);

}


/*=========================================
MOVE OBSTACLES
=========================================*/

function moveObstacles(delta){

    const obstacles =
        document.querySelectorAll(".obstacle");

    obstacles.forEach(obstacle => {

        let left =
            parseFloat(obstacle.style.left);

        left -= speed * delta;

        obstacle.style.left =
            left + "px";

        if(left < -70){

            obstacle.remove();

        }

    });

}


/*=========================================
COLLISION
=========================================*/

function checkCollisions(){

    const dinoRect =
        dino.getBoundingClientRect();

    const obstacles =
        document.querySelectorAll(".obstacle");

    for(const obstacle of obstacles){

        const obstacleRect =
            obstacle.getBoundingClientRect();

        const hit =

            dinoRect.left + 10 <
            obstacleRect.right - 8 &&

            dinoRect.right - 10 >
            obstacleRect.left + 8 &&

            dinoRect.top + 8 <
            obstacleRect.bottom - 5 &&

            dinoRect.bottom - 5 >
            obstacleRect.top + 8;

        if(hit){

            endGame();

            return;

        }

    }

}


/*=========================================
CLOUD MOVEMENT
=========================================*/

let cloudPosition = 20;

function moveCloud(delta){

    cloudPosition -= speed * 0.15 * delta;

    if(cloudPosition < -15){

        cloudPosition = 105;

    }

    cloud.style.right =
        cloudPosition + "%";

}


/*=========================================
DAY / NIGHT
=========================================*/

function updateDayNight(){

    const cycle =
        Math.floor(score / 100) % 2;

    if(cycle === 1){

        gameArea.classList.add("night");

    }else{

        gameArea.classList.remove("night");

    }

}


/*=========================================
DIFFICULTY
=========================================*/

function updateDifficulty(){

    speed =
        Math.min(

            6 + score * 0.015,

            16

        );

    obstacleInterval =
        Math.max(

            650,

            1500 - score * 4

        );

}


/*=========================================
GAME LOOP
=========================================*/

function gameUpdate(timestamp){

    if(!playing) return;

    if(!lastTime){

        lastTime = timestamp;

    }

    const delta =
        (timestamp - lastTime) / 16.67;

    lastTime = timestamp;

    moveObstacles(delta);

    moveCloud(delta);

    checkCollisions();

    gameLoop =
        requestAnimationFrame(
            gameUpdate
        );

}


/*=========================================
OBSTACLE SPAWNER
=========================================*/

function startObstacleSpawner(){

    clearTimeout(obstacleTimer);

    if(!playing) return;

    createObstacle();

    updateDifficulty();

    obstacleTimer = setTimeout(

        startObstacleSpawner,

        obstacleInterval

    );

}


/*=========================================
SCORE
=========================================*/

function startScore(){

    clearInterval(scoreTimer);

    scoreTimer = setInterval(() => {

        if(!playing) return;

        score++;

        scoreText.textContent =
            score;

        updateDifficulty();

        updateDayNight();


        if(score > best){

            best = score;

            bestText.textContent =
                best;

            localStorage.setItem(
                "dinoBest",
                best
            );

        }

    },100);

}


/*=========================================
START GAME
=========================================*/

function startGame(){

    cancelAnimationFrame(gameLoop);

    clearInterval(scoreTimer);

    clearTimeout(obstacleTimer);

    document
        .querySelectorAll(".obstacle")
        .forEach(obstacle =>
            obstacle.remove()
        );

    score = 0;

    speed = 6;

    obstacleInterval = 1500;

    lastTime = 0;

    jumping = false;

    playing = true;

    scoreText.textContent =
        score;

    gameArea.classList.remove("night");

    message.textContent =
        "Press SPACE or tap to jump!";

    startScore();

    startObstacleSpawner();

    gameLoop =
        requestAnimationFrame(
            gameUpdate
        );

}


/*=========================================
END GAME
=========================================*/

function endGame(){

    if(!playing) return;

    playing = false;

    cancelAnimationFrame(gameLoop);

    clearInterval(scoreTimer);

    clearTimeout(obstacleTimer);

    message.textContent =
        "💥 Game Over! Score: " + score;

}


/*=========================================
KEYBOARD
=========================================*/

document.addEventListener(
    "keydown",
    event => {

        if(

            event.code === "Space" ||

            event.code === "ArrowUp"

        ){

            event.preventDefault();

            if(!playing){

                startGame();

            }else{

                jump();

            }

        }

    }
);


/*=========================================
TOUCH / CLICK
=========================================*/

gameArea.addEventListener(
    "pointerdown",
    event => {

        if(event.target.closest("button")){
            return;
        }

        if(!playing){

            startGame();

        }else{

            jump();

        }

    }
);


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