"use strict";

/*=========================================
ELEMENTS
=========================================*/

const choices=document.querySelectorAll(".choice");

const playerChoice=document.getElementById("playerChoice");

const cpuChoice=document.getElementById("cpuChoice");

const resultText=document.getElementById("resultText");

const winsText=document.getElementById("wins");

const restartButton=document.getElementById("restartButton");

const backButton=document.getElementById("backButton");

/*=========================================
GAME
=========================================*/

const icons={

    rock:"✊",

    paper:"✋",

    scissors:"✌️"

};

const names=[

    "rock",

    "paper",

    "scissors"

];

let wins=0;

/*=========================================
PLAY
=========================================*/

choices.forEach(button=>{

    button.onclick=()=>{

        play(

            button.dataset.choice

        );

    };

});

function play(player){

    choices.forEach(button=>{

        button.style.background="#1f2937";

    });

    const playerButton=

        document.querySelector(

            '[data-choice="'+player+'"]'

        );

    playerButton.style.background="#2563eb";

    const cpu=

        names[

            Math.floor(

                Math.random()*3

            )

        ];

    playerChoice.textContent=

        icons[player];

    cpuChoice.textContent=

        icons[cpu];

    checkWinner(

        player,

        cpu

    );

    animateResult();

}

/*=========================================
WINNER
=========================================*/

function checkWinner(player,cpu){

    if(player===cpu){

        resultText.textContent="🤝 Draw!";

        return;

    }

    if(

        (player==="rock" && cpu==="scissors") ||

        (player==="paper" && cpu==="rock") ||

        (player==="scissors" && cpu==="paper")

    ){

        wins++;

        winsText.textContent=wins;

        resultText.textContent="🎉 You Win!";

    }

    else{

        resultText.textContent="💀 You Lose!";

    }

}

/*=========================================
BUTTONS
=========================================*/

backButton.onclick=()=>{

    history.back();

};
/*=========================================
ANIMATION
=========================================*/

function animateResult(){

    resultText.style.transform="scale(1.2)";

    setTimeout(()=>{

        resultText.style.transform="scale(1)";

    },180);

}

/*=========================================
RESET
=========================================*/

restartButton.onclick=()=>{

    wins=0;

    winsText.textContent=0;

    playerChoice.textContent="❔";

    cpuChoice.textContent="❔";

    resultText.textContent="Choose one!";

};