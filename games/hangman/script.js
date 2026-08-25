"use strict";

/*=========================================
ELEMENTS
=========================================*/

const wordElement=document.getElementById("word");

const lettersElement=document.getElementById("letters");

const livesElement=document.getElementById("lives");

const message=document.getElementById("message");

const restartButton=document.getElementById("restartButton");

const backButton=document.getElementById("backButton");

/*=========================================
WORDS
=========================================*/

const words=[

"APPLE",
"BANANA",
"ORANGE",
"ELEPHANT",
"TIGER",
"LION",
"PYTHON",
"JAVASCRIPT",
"COMPUTER",
"KEYBOARD",
"MOUNTAIN",
"OCEAN",
"ROBOT",
"GALAXY",
"RAINBOW",
"CASTLE",
"DIAMOND",
"PLANET",
"VOLCANO",
"CHOCOLATE"

];

let word="";

let guessed=[];

let lives=6;

/*=========================================
START
=========================================*/

function startGame(){

    guessed=[];

    lives=6;

    livesElement.textContent=lives;

    message.textContent="Guess a letter!";

    word=

        words[

            Math.floor(

                Math.random()*words.length

            )

        ];

    drawWord();

    createKeyboard();

}

/*=========================================
DRAW WORD
=========================================*/

function drawWord(){

    wordElement.innerHTML="";

    for(const letter of word){

        const div=document.createElement("div");

        div.className="letter";

        div.textContent=

            guessed.includes(letter)

            ?

            letter

            :

            "";

        wordElement.appendChild(div);

    }

}

/*=========================================
KEYBOARD
=========================================*/

function createKeyboard(){

    lettersElement.innerHTML="";

    for(let i=65;i<=90;i++){

        const button=document.createElement("button");

        button.textContent=

            String.fromCharCode(i);

        button.onclick=()=>

            guess(

                button.textContent,

                button

            );

        lettersElement.appendChild(button);

    }

}

/*=========================================
BUTTONS
=========================================*/

restartButton.onclick=startGame;

backButton.onclick=()=>history.back();

startGame();

 /*=========================================
GUESS LETTER
=========================================*/

function guess(letter,button){


    guessed.push(letter);


    button.disabled=true;


    if(!word.includes(letter)){


        lives--;


        livesElement.textContent=lives;


        message.textContent="Wrong letter!";


    }else{


        message.textContent="Good guess!";


    }


    drawWord();


    checkGame();


}


/*=========================================
CHECK GAME
=========================================*/

function checkGame(){


    const completed=word
        .split("")
        .every(letter=>guessed.includes(letter));


    if(completed){


        message.textContent="🏆 You win!";


        disableKeyboard();


        return;


    }


    if(lives<=0){


        message.textContent="💀 You lose! The word was "+word;


        disableKeyboard();


    }


}


/*=========================================
DISABLE KEYBOARD
=========================================*/

function disableKeyboard(){


    const buttons=
        lettersElement.querySelectorAll("button");


    buttons.forEach(button=>{


        button.disabled=true;


    });


}