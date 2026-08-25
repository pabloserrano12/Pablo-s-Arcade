"use strict";

/*=========================================
ELEMENTS
=========================================*/

const board=document.getElementById("board");

const scoreText=document.getElementById("score");

const bestText=document.getElementById("best");

const timeText=document.getElementById("time");

const startButton=document.getElementById("startButton");

const restartButton=document.getElementById("restartButton");

const backButton=document.getElementById("backButton");

/*=========================================
GAME
=========================================*/

let score=0;

let best=

    Number(

        localStorage.getItem(

            "whackBest"

        )

    )||0;

let time=30;

let playing=false;

let currentHole=-1;

let moleTimer=null;

let gameTimer=null;

const holes=[];

/*=========================================
CREATE BOARD
=========================================*/

for(let i=0;i<9;i++){

    const hole=document.createElement("div");

    hole.className="hole";

    const mole=document.createElement("div");

    mole.className="mole";

    mole.textContent="🐹";

    hole.appendChild(mole);

    hole.onclick=()=>hit(i);

    board.appendChild(hole);

    holes.push(mole);

}

/*=========================================
MOLES
=========================================*/

function showRandomMole(){

    holes.forEach(

        mole=>mole.classList.remove("up")

    );

    currentHole=

        Math.floor(

            Math.random()*9

        );

    holes[currentHole]

        .classList.add("up");

}

function startMoles(){

    showRandomMole();

    moleTimer=setInterval(

        showRandomMole,

        700

    );

}

/*=========================================
HIT
=========================================*/

function hit(index){

    if(!playing) return;

    if(index!==currentHole) return;

    score++;

    scoreText.textContent=score;

    if(score>best){

    best=score;

    bestText.textContent=best;

    localStorage.setItem(

        "whackBest",

        best

    );

}

    holes[index]

        .classList.remove("up");

    currentHole=-1;

}
/*=========================================
TIMER
=========================================*/

function startGame(){

    bestText.textContent=best;

    clearInterval(moleTimer);

    clearInterval(gameTimer);

    score=0;

    time=30;

    playing=true;

    currentHole=-1;

    scoreText.textContent=score;

    timeText.textContent=time;

    startMoles();

    gameTimer=setInterval(()=>{

        time--;

        timeText.textContent=time;

        if(time<=0){

            endGame();

        }

    },1000);

}

/*=========================================
END GAME
=========================================*/

function endGame(){

    playing=false;

    clearInterval(moleTimer);

    clearInterval(gameTimer);

    holes.forEach(

        mole=>mole.classList.remove("up")

    );

    setTimeout(()=>{

        alert(

            "⏰ Time's up!\n\nScore: "+score

        );

    },100);

}

/*=========================================
BUTTONS
=========================================*/

startButton.onclick=()=>{

    startGame();

};

restartButton.onclick=()=>{

    startGame();

};

backButton.onclick=()=>{

    history.back();

};