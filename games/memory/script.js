"use strict";

/*=========================================
    MEMORY
    PART 1
=========================================*/

const menu=document.getElementById("menu");
const game=document.getElementById("game");

const soloButton=document.getElementById("soloButton");
const playerButton=document.getElementById("playerButton");

const board=document.getElementById("board");

const movesText=document.getElementById("moves");
const pairsText=document.getElementById("pairs");
const currentPlayerText=document.getElementById("currentPlayer");
const playerBox=document.getElementById("playerBox");

const restartButton=document.getElementById("restartButton");
const menuButton=document.getElementById("menuButton");
const backButton=document.getElementById("backButton");

/*=========================================
    GAME DATA
=========================================*/

const symbols=[

"🍎",
"🍌",
"🍇",
"🍓",
"🍍",
"🥝",
"🍉",
"🍒"

];

let cards=[];

let flipped=[];

let lock=false;

let moves=0;

let pairs=0;

let gameMode="solo";

let currentPlayer=1;

let player1Pairs=0;

let player2Pairs=0;

/*=========================================
    START
=========================================*/

soloButton.onclick=()=>{

    gameMode="solo";

    startGame();

};

playerButton.onclick=()=>{

    gameMode="players";

    startGame();

};

function startGame(){

    menu.classList.add("hidden");

    game.classList.remove("hidden");

    resetGame();

}

/*=========================================
    CREATE CARDS
=========================================*/

function createCards(){

    cards=[];

    const list=[

        ...symbols,

        ...symbols

    ];

    list.sort(

        ()=>Math.random()-0.5

    );

    list.forEach((symbol,index)=>{

        cards.push({

            id:index,

            symbol,

            flipped:false,

            matched:false

        });

    });

}

/*=========================================
    DRAW
=========================================*/

function drawBoard(){

    board.innerHTML="";

    cards.forEach(card=>{

        const element=document.createElement("div");

        element.className="card";

        if(

            card.flipped ||

            card.matched

        ){

            element.classList.add(

                "flipped"

            );

        }

        element.innerHTML=`

        <div class="cardInner">

            <div class="front">

                ?

            </div>

            <div class="back">

                ${card.symbol}

            </div>

        </div>

        `;

        element.onclick=()=>flipCard(card.id);

        board.appendChild(element);

    });

}

/*=========================================
    RESET
=========================================*/

function resetGame(){

    moves=0;

    pairs=0;

    flipped=[];

    lock=false;

    currentPlayer=1;

    player1Pairs=0;

    player2Pairs=0;

    movesText.textContent=0;

    pairsText.textContent=0;

    currentPlayerText.textContent=1;

    playerBox.style.display=

        gameMode==="solo"

        ?

        "none"

        :

        "block";

    createCards();

    drawBoard();

}
/*=========================================
    FLIP CARD
=========================================*/

function flipCard(id){

    if(lock) return;

    const card=cards[id];

    if(card.flipped || card.matched) return;

    card.flipped=true;

    flipped.push(card);

    drawBoard();

    if(flipped.length===2){

        moves++;

        movesText.textContent=moves;

        lock=true;

        setTimeout(checkPair,700);

    }

}

/*=========================================
    CHECK PAIR
=========================================*/

function checkPair(){

    const first=flipped[0];
    const second=flipped[1];

    if(first.symbol===second.symbol){

        first.matched=true;
        second.matched=true;

        pairs++;

        pairsText.textContent=pairs;

        flipped=[];

        lock=false;

        checkWin();

        return;

    }

    first.flipped=false;
    second.flipped=false;

    flipped=[];

    lock=false;

    drawBoard();

}
/*=========================================
    WIN
=========================================*/

function checkWin(){

    if(pairs!==symbols.length) return;

    setTimeout(()=>{

        if(gameMode==="solo"){

            alert(

                `🎉 You Win!\n\nMoves: ${moves}`

            );

        }else{

            let message="";

            if(player1Pairs>player2Pairs){

                message="🏆 Player 1 Wins!";

            }else if(player2Pairs>player1Pairs){

                message="🏆 Player 2 Wins!";

            }else{

                message="🤝 Draw!";

            }

            alert(

`${message}

Player 1: ${player1Pairs}
Player 2: ${player2Pairs}`

            );

        }

    },300);

}

/*=========================================
    TWO PLAYERS
=========================================*/

const originalCheckPair=checkPair;

checkPair=function(){

    const first=flipped[0];
    const second=flipped[1];

    if(first.symbol===second.symbol){

        first.matched=true;
        second.matched=true;

        pairs++;

        pairsText.textContent=pairs;

        if(gameMode==="players"){

            if(currentPlayer===1){

                player1Pairs++;

            }else{

                player2Pairs++;

            }

        }

        flipped=[];

        lock=false;

        drawBoard();

        checkWin();

        return;

    }

    first.flipped=false;
    second.flipped=false;

    flipped=[];

    lock=false;

    drawBoard();

    if(gameMode==="players"){

        currentPlayer=

            currentPlayer===1

            ?

            2

            :

            1;

        currentPlayerText.textContent=currentPlayer;

    }

};

/*=========================================
    MENU
=========================================*/

menuButton.onclick=()=>{

    game.classList.add("hidden");

    menu.classList.remove("hidden");

};

backButton.onclick=()=>{

    history.back();

};

restartButton.onclick=()=>{

    resetGame();

};