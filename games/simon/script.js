"use strict";

/*=========================================
ELEMENTS
=========================================*/

const tiles=document.querySelectorAll(".tile");

const levelText=document.getElementById("level");

const startButton=document.getElementById("startButton");

const restartButton=document.getElementById("restartButton");

const backButton=document.getElementById("backButton");

/*=========================================
GAME
=========================================*/

let sequence=[];

let player=[];

let level=1;

let playing=false;

let canClick=false;

/*=========================================
RESET
=========================================*/

function resetGame(){

    sequence=[];

    player=[];

    level=1;

    playing=false;

    canClick=false;

    levelText.textContent=1;

}

/*=========================================
NEW ROUND
=========================================*/

function nextRound(){

    player=[];

    levelText.textContent=level;

    sequence.push(

        Math.floor(

            Math.random()*4

        )

    );

    showSequence();

}

/*=========================================
SHOW SEQUENCE
=========================================*/

function showSequence(){

    canClick=false;

    let i=0;

    const interval=setInterval(()=>{

        flash(

            sequence[i]

        );

        i++;

        if(i>=sequence.length){

            clearInterval(interval);

            setTimeout(()=>{

                canClick=true;

            },400);

        }

    },700);

}

/*=========================================
FLASH
=========================================*/

function flash(index){

    const tile=tiles[index];

    tile.classList.add("active");

    setTimeout(()=>{

        tile.classList.remove("active");

    },350);

}
/*=========================================
PLAYER
=========================================*/

function playerClick(index){

    if(!canClick) return;

    flash(index);

    player.push(index);

    const current=player.length-1;

    if(player[current]!==sequence[current]){

        gameOver();

        return;

    }

    if(player.length===sequence.length){

        canClick=false;

        level++;

        setTimeout(

            nextRound,

            800

        );

    }

}

/*=========================================
GAME OVER
=========================================*/

function gameOver(){

    canClick=false;

    playing=false;

    setTimeout(()=>{

        alert(

            "Game Over!\nLevel: "+(level-1)

        );

    },150);

}

/*=========================================
BUTTONS
=========================================*/

tiles.forEach((tile,index)=>{

    tile.onclick=()=>{

        playerClick(index);

    };

});

startButton.onclick=()=>{

    if(playing) return;

    playing=true;

    resetGame();

    nextRound();

};

restartButton.onclick=()=>{

    resetGame();

};

backButton.onclick=()=>{

    history.back();

};