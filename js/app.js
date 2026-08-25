/* ===========================================
   PABLO'S ARCADE
   APP.JS
   PARTE 1
===========================================*/

"use strict";

/* ===========================
   Base de datos de juegos
=========================== */

const games = [

    {
        id: "snake",
        title: "Snake",
        description: "Eat the apples but don't die",
        image: "assets/images/snake.png",
        category: "Arcade",
        badge: "Popular"
    },

    {
        id: "tetris",
        title: "Tetris",
        description: "Fit the pieces together and clear lines.",
        image: "assets/images/tetris.png",
        category: "Puzzle",
        badge: "New"
    },

    {
        id: "pong",
        title: "Pong",
        description: "The classic arcade tennis game.",
        image: "assets/images/pong.png",
        category: "Classics",
        badge: ""
    },

    {
        id: "breakout",
        title: "Breakout",
        description: "Destroy all the blocks.",
        image: "assets/images/breakout.png",
        category: "Arcade",
        badge: ""
    },

    {
        id: "memory",
        title: "Memory",
        description: "Find all the matching pairs.",
        image: "assets/images/memory.png",
        category: "Puzzle",
        badge: ""
    },

    {
        id: "2048",
        title: "2048",
        description: "Reach the 2048 tile.",
        image: "assets/images/2048.png",
        category: "Puzzle",
        badge: ""
    },

    {
        id: "flappy",
        title: "Flappy Bird",
        description: "Don't hit the pipes.",
        image: "assets/images/flappy.png",
        category: "Arcade",
        badge: ""
    },

    {
        id: "tictactoe",
        title: "Tic Tac Toe",
        description: "Get three in a row.",
        image: "assets/images/tictactoe.png",
        category: "Casual",
        badge: ""
    },

    {
        id: "connect4",
        title: "Connect Four",
        description: "Connect four discs.",
        image: "assets/images/connect4.png",
        category: "Strategy",
        badge: ""
    },

    {
        id: "minesweeper",
        title: "Minesweeper",
        description: "Find all the mines.",
        image: "assets/images/minesweeper.png",
        category: "Puzzle",
        badge: ""
    },

    {
        id: "hangman",
        title: "Hangman",
        description: "Guess the word.",
        image: "assets/images/hangman.png",
        category: "Casual",
        badge: ""
    },

    {
        id: "simon",
        title: "Simon Says",
        description: "Repeat the sequence.",
        image: "assets/images/simon.png",
        category: "Casual",
        badge: ""
    },

    {
        id: "dino",
        title: "Dino",
        description: "Jump over the cacti.",
        image: "assets/images/dino.png",
        category: "Arcade",
        badge: ""
    },

    {
        id: "rps",
        title: "Rock Paper Scissors",
        description: "Play against the AI.",
        image: "assets/images/rps.png",
        category: "Casual",
        badge: ""
    },

    {
        id: "whack",
        title: "Whack a Mole",
        description: "Hit all the moles.",
        image: "assets/images/whack.png",
        category: "Arcade",
        badge: ""
    }

];

/* ===========================
   Elementos
=========================== */

const gamesGrid = document.getElementById("gamesGrid");
const searchInput = document.getElementById("search");
const categoryButtons = document.querySelectorAll(".category");

/* ===========================
   Variables
=========================== */

let currentCategory = "All";
let currentSearch = "";

/* ===========================
   Inicio
=========================== */

window.addEventListener("DOMContentLoaded", () => {

    loadGames();

});
/* ===========================
   Crear tarjeta
=========================== */

function createGameCard(game){

    const card = document.createElement("div");

    card.className = "game-card";

    card.dataset.category = game.category;
    card.dataset.id = game.id;

    card.innerHTML = `

        <div class="game-image">

            <img src="${game.image}" alt="${game.title}">

            ${
                game.badge
                ? `<div class="badge">${game.badge}</div>`
                : ""
            }

            <div
    class="favorite"
    onclick="event.stopPropagation(); toggleFavorite('${game.id}')">

    🤍

</div>

        </div>

        <div class="game-info">

            <h2 class="game-title">

                ${game.title}

            </h2>

            <p class="game-description">

                ${game.description}

            </p>

            <div class="game-tags">

                <span class="tag">

                    ${game.category}

                </span>

            </div>

            <button
                class="play-button"
                onclick="playGame('${game.id}')">

                ▶ Play

            </button>

        </div>

    `;

    return card;

}

/* ===========================
   Mostrar juegos
=========================== */

function loadGames(){

    gamesGrid.innerHTML = "";

    games.forEach(game=>{

        gamesGrid.appendChild(

            createGameCard(game)

        );

    });
    updateFavoriteIcons();

}

/* ===========================
   Abrir juego
=========================== */

function playGame(id){

    localStorage.setItem(

        "lastGame",

        id

    );

    window.location.href =

    `games/${id}/index.html`;

}
/* ===========================
   Filtrar juegos
=========================== */

function filterGames(){

    const cards = document.querySelectorAll(".game-card");

    cards.forEach(card=>{

        const title = card
            .querySelector(".game-title")
            .textContent
            .toLowerCase();

        const category =
            card.dataset.category;

        const matchesSearch =
            title.includes(currentSearch);

        const matchesCategory =

            currentCategory === "All"

            ||

            category === currentCategory;

        if(matchesSearch && matchesCategory){

            card.style.display = "block";

        }else{

            card.style.display = "none";

        }

    });

}

/* ===========================
   Buscador
=========================== */

searchInput.addEventListener("input", e=>{

    currentSearch =

        e.target.value
        .toLowerCase()
        .trim();

    filterGames();

});

/* ===========================
   Categorías
=========================== */

categoryButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        categoryButtons.forEach(btn=>{

            btn.classList.remove("active");

        });

        button.classList.add("active");

        currentCategory =

            button.textContent;

        filterGames();

    });

});
/* ===========================
   FAVORITOS
=========================== */

let favorites = JSON.parse(

    localStorage.getItem("favorites")

) || [];

/* ===========================
   Guardar favoritos
=========================== */

function saveFavorites(){

    localStorage.setItem(

        "favorites",

        JSON.stringify(favorites)

    );

}

/* ===========================
   ¿Es favorito?
=========================== */

function isFavorite(id){

    return favorites.includes(id);

}

/* ===========================
   Cambiar favorito
=========================== */

function toggleFavorite(id){

    if(isFavorite(id)){

        favorites = favorites.filter(

            gameId => gameId !== id

        );

    }else{

        favorites.push(id);

    }

    saveFavorites();

    updateFavoriteIcons();

}

/* ===========================
   Actualizar iconos
=========================== */

function updateFavoriteIcons(){

    document.querySelectorAll(".game-card").forEach(card=>{

        const id = card.dataset.id;

        const button = card.querySelector(".favorite");

        if(isFavorite(id)){

            button.textContent = "❤️";

            button.classList.add("active");

        }else{

            button.textContent = "🤍";

            button.classList.remove("active");

        }

    });

}
/* ===========================================
   ÚLTIMOS JUEGOS Y ESTADÍSTICAS
===========================================*/

const STORAGE_KEYS = {
    LAST_GAME: "lastGame",
    LAST_GAMES: "lastGames",
    STATS: "playerStats"
};

let playerStats = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.STATS)
) || {
    gamesPlayed: 0,
    favoriteGame: "",
    totalTime: 0
};

/* ===========================
   Guardar estadísticas
=========================== */

function saveStats(){

    localStorage.setItem(
        STORAGE_KEYS.STATS,
        JSON.stringify(playerStats)
    );

}

/* ===========================
   Registrar partida
=========================== */

function registerGame(id){

    playerStats.gamesPlayed++;

    playerStats.favoriteGame = id;

    saveStats();

}

/* ===========================
   Últimos juegos
=========================== */

function addRecentGame(id){

    let recent = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.LAST_GAMES)
    ) || [];

    recent = recent.filter(game => game !== id);

    recent.unshift(id);

    if(recent.length > 8){

        recent.pop();

    }

    localStorage.setItem(

        STORAGE_KEYS.LAST_GAMES,

        JSON.stringify(recent)

    );

}

/* ===========================
   Obtener últimos juegos
=========================== */

function getRecentGames(){

    return JSON.parse(

        localStorage.getItem(STORAGE_KEYS.LAST_GAMES)

    ) || [];

}

/* ===========================
   Mostrar últimos juegos
=========================== */

function showRecentGames(){

    console.log("Last played games:");

    getRecentGames().forEach(game=>{

        console.log(game);

    });

}

/* ===========================
   Información del jugador
=========================== */

function getPlayerStats(){

    return playerStats;

}

/* ===========================
   Mostrar estadísticas
=========================== */

function printStats(){

    console.log("==========");

    console.log("Pablo's Arcade");

    console.log("Games Played:",playerStats.gamesPlayed);

    console.log("Favorite Game:",playerStats.favoriteGame);

    console.log("==========");

}
/* ===========================================
   MEJORA DE PLAYGAME
===========================================*/

const originalPlayGame = playGame;

playGame = function(id){

    registerGame(id);

    addRecentGame(id);

    originalPlayGame(id);

};
/* ===========================================
   SISTEMA DE EXPERIENCIA
=========================================== */

const PLAYER_DATA_KEY = "Pablo'sArcadePlayer";

let player = JSON.parse(

    localStorage.getItem(PLAYER_DATA_KEY)

) || {

    level:1,

    xp:0,

    coins:0,

    achievements:[]

};

/* ===========================
   Guardar jugador
=========================== */

function savePlayer(){

    localStorage.setItem(

        PLAYER_DATA_KEY,

        JSON.stringify(player)

    );

}

/* ===========================
   XP necesaria
=========================== */

function xpNeeded(level){

    return level * 100;

}

/* ===========================
   Añadir experiencia
=========================== */

function addXP(amount){

    player.xp += amount;

    while(player.xp >= xpNeeded(player.level)){

        player.xp -= xpNeeded(player.level);

        player.level++;

        showNotification(

            "🎉 You leveled up to " +

            player.level +

            "!"

        );

    }

    savePlayer();

}

/* ===========================
   Añadir monedas
=========================== */

function addCoins(amount){

    player.coins += amount;

    savePlayer();

}

/* ===========================
   Gastar monedas
=========================== */

function spendCoins(amount){

    if(player.coins < amount){

        return false;

    }

    player.coins -= amount;

    savePlayer();

    return true;

}

/* ===========================
   Obtener datos
=========================== */

function getPlayer(){

    const savedPlayer = JSON.parse(
        localStorage.getItem(PLAYER_DATA_KEY)
    );

    if(savedPlayer){

        player = savedPlayer;

    }

    return player;

}

/* ===========================================
   SISTEMA DE LOGROS
=========================================== */

const achievements = [

    {

        id:"first_game",

        title:"First Game",

        description:"Play for the first time."

    },

    {

        id:"ten_games",

        title:"Regular Player",

        description:"Play 10 games."

    },

    {

        id:"level5",

        title:"Level 5",

        description:"Reach level 5."

    },

    {

        id:"coins100",

        title:"Saver",

        description:"Get 100 coins."

    }

];

/* ===========================
   ¿Tiene logro?
=========================== */

function hasAchievement(id){

    return player.achievements.includes(id);

}

/* ===========================
   Desbloquear logro
=========================== */

function unlockAchievement(id){

    if(hasAchievement(id))

        return;

    player.achievements.push(id);

    savePlayer();

    const achievement = achievements.find(

        a => a.id === id

    );

    if(achievement){

        showNotification(

            "🏆 " +

            achievement.title

        );

    }

}

/* ===========================================
   COMPROBAR LOGROS
=========================================== */

function checkAchievements(){

    if(playerStats.gamesPlayed >= 1){

        unlockAchievement("first_game");

    }

    if(playerStats.gamesPlayed >= 10){

        unlockAchievement("ten_games");

    }

    if(player.level >= 5){

        unlockAchievement("level5");

    }

    if(player.coins >= 100){

        unlockAchievement("coins100");

    }

}

/* ===========================================
   NOTIFICACIONES
=========================================== */

function showNotification(text){

    const toast = document.getElementById("toast");

    if(!toast){

        console.log(text);

        return;

    }

    toast.textContent = text;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },3000);

}

/* ===========================================
   RECOMPENSAS AUTOMÁTICAS
=========================================== */

const previousRegisterGame = registerGame;

registerGame = function(id){

    previousRegisterGame(id);

    addXP(20);

    addCoins(5);

    checkAchievements();

};
/* ===========================================
   SISTEMA DE BÚSQUEDA AVANZADA
=========================================== */

function searchGames(query){

    query = query.toLowerCase().trim();

    return games.filter(game=>{

        return (

            game.title.toLowerCase().includes(query)

            ||

            game.description.toLowerCase().includes(query)

            ||

            game.category.toLowerCase().includes(query)

        );

    });

}

/* ===========================================
   ORDENAR JUEGOS
=========================================== */

function sortGames(mode="name"){

    switch(mode){

        case "name":

            games.sort((a,b)=>

                a.title.localeCompare(b.title)

            );

        break;

        case "category":

            games.sort((a,b)=>

                a.category.localeCompare(b.category)

            );

        break;

        case "favorites":

            games.sort((a,b)=>{

                return Number(

                    isFavorite(b.id)

                )-

                Number(

                    isFavorite(a.id)

                );

            });

        break;

    }

    loadGames();

}

/* ===========================================
   OBTENER JUEGO
=========================================== */

function getGame(id){

    return games.find(

        game=>game.id===id

    );

}

/* ===========================================
   JUEGO ALEATORIO
=========================================== */

function randomGame(){

    const random =

        games[

            Math.floor(

                Math.random()*games.length

            )

        ];

    playGame(random.id);

}

/* ===========================================
   TOTAL DE JUEGOS
=========================================== */

function totalGames(){

    return games.length;

}

/* ===========================================
   TOTAL FAVORITOS
=========================================== */

function totalFavorites(){

    return favorites.length;

}

/* ===========================================
   POR CATEGORÍA
=========================================== */

function gamesByCategory(category){

    return games.filter(game=>

        game.category===category

    );

}

/* ===========================================
   EXPORTAR DATOS
=========================================== */

function exportData(){

    const data={

        player,

        playerStats,

        favorites,

        recent:getRecentGames()

    };

    return JSON.stringify(

        data,

        null,

        2

    );

}

/* ===========================================
   IMPORTAR DATOS
=========================================== */

function importData(json){

    try{

        const data=JSON.parse(json);

        if(data.player){

            player=data.player;

        }

        if(data.playerStats){

            playerStats=data.playerStats;

        }

        if(data.favorites){

            favorites=data.favorites;

        }

        savePlayer();

        saveStats();

        saveFavorites();

        loadGames();

        showNotification(

            "Data imported successfully."

        );

    }

    catch{

        showNotification(

            "Error importing data."

        );

    }

}

/* ===========================================
   RESETEAR PORTAL
=========================================== */

function resetPortal(){

    if(

        !confirm(

            "Are you sure you want to delete all data?"

        )

    ) return;

    localStorage.clear();

    location.reload();

}
/* ===========================================
   CONFIGURACIÓN
=========================================== */

const SETTINGS_KEY = "Pablo'sArcadeSettings";

let settings = JSON.parse(

    localStorage.getItem(SETTINGS_KEY)

) || {

    music:true,

    sound:true,

    darkMode:true,

    fullscreen:false,

    particles:true,

    animations:true

};

function saveSettings(){

    localStorage.setItem(

        SETTINGS_KEY,

        JSON.stringify(settings)

    );

}

function getSetting(name){

    return settings[name];

}

function setSetting(name,value){

    settings[name]=value;

    saveSettings();

}

/* ===========================================
   TEMA
=========================================== */

function applyTheme(){

    if(settings.darkMode){

        document.body.classList.remove("light-theme");

        document.body.classList.add("dark-theme");

    }else{

        document.body.classList.remove("dark-theme");

        document.body.classList.add("light-theme");

    }

}

function toggleDarkMode(){

    settings.darkMode=!settings.darkMode;

    saveSettings();

    applyTheme();

}

/* ===========================================
   SONIDOS
=========================================== */

const sounds={};

function loadSound(name,path){

    sounds[name]=new Audio(path);

}

function playSound(name){

    if(!settings.sound) return;

    if(!sounds[name]) return;

    sounds[name].currentTime=0;

    sounds[name].play().catch(()=>{});

}

/* ===========================================
   MÚSICA
=========================================== */

let backgroundMusic=null;

function loadMusic(path){

    backgroundMusic=new Audio(path);

    backgroundMusic.loop=true;

    backgroundMusic.volume=.35;

}

function playMusic(){

    if(!settings.music) return;

    if(!backgroundMusic) return;

    backgroundMusic.play().catch(()=>{});

}

function stopMusic(){

    if(backgroundMusic){

        backgroundMusic.pause();

    }

}

function toggleMusic(){

    settings.music=!settings.music;

    saveSettings();

    if(settings.music){

        playMusic();

    }else{

        stopMusic();

    }

}

/* ===========================================
   PANTALLA COMPLETA
=========================================== */

function toggleFullscreen(){

    if(!document.fullscreenElement){

        document.documentElement.requestFullscreen();

    }else{

        document.exitFullscreen();

    }

}

/* ===========================================
   GUARDADO AUTOMÁTICO
=========================================== */

setInterval(()=>{

    savePlayer();

    saveStats();

    saveFavorites();

    saveSettings();

},30000);

/* ===========================================
   ATAJOS DE TECLADO
=========================================== */

document.addEventListener("keydown",event=>{

    switch(event.key.toLowerCase()){

        case "f":

            toggleFullscreen();

        break;

        case "m":

            toggleMusic();

        break;

        case "t":

            toggleDarkMode();

        break;

    }

});

/* ===========================================
   EVENTOS
=========================================== */

window.addEventListener("focus",()=>{

    if(settings.music){

        playMusic();

    }

});

window.addEventListener("blur",()=>{

    stopMusic();

});

/* ===========================================
   INICIO AUTOMÁTICO
=========================================== */

window.addEventListener("load",()=>{

    applyTheme();

    loadMusic("assets/sounds/music.mp3");

    loadSound("click","assets/sounds/click.mp3");

    loadSound("success","assets/sounds/success.mp3");

});
/* ===========================================
   CONTADOR DE VISITAS
=========================================== */

const VISITS_KEY = "Pablo'sArcadeVisits";

function registerVisit(){

    let visits = Number(

        localStorage.getItem(VISITS_KEY)

    ) || 0;

    visits++;

    localStorage.setItem(

        VISITS_KEY,

        visits

    );

    return visits;

}

const totalVisits = registerVisit();

/* ===========================================
   ONLINE / OFFLINE
=========================================== */

function updateConnectionStatus(){

    if(navigator.onLine){

        showNotification(

            "🟢 Connected"

        );

    }else{

        showNotification(

            "🔴 Offline"

        );

    }

}

window.addEventListener(

    "online",

    updateConnectionStatus

);

window.addEventListener(

    "offline",

    updateConnectionStatus

);

/* ===========================================
   PWA
=========================================== */

let deferredPrompt = null;

window.addEventListener(

    "beforeinstallprompt",

    (event)=>{

        event.preventDefault();

        deferredPrompt = event;

    }

);

async function installApp(){

    if(!deferredPrompt){

        showNotification(

            "Installation is not available."

        );

        return;

    }

    deferredPrompt.prompt();

    await deferredPrompt.userChoice;

    deferredPrompt = null;

}

/* ===========================================
   UTILIDADES
=========================================== */

function sleep(ms){

    return new Promise(resolve=>{

        setTimeout(resolve,ms);

    });

}

function randomInt(min,max){

    return Math.floor(

        Math.random()*(max-min+1)

    )+min;

}

function randomColor(){

    return "#"+Math.floor(

        Math.random()*16777215

    ).toString(16).padStart(6,"0");

}

function clamp(value,min,max){

    return Math.min(

        Math.max(value,min),

        max

    );

}

/* ===========================================
   COPIAR TEXTO
=========================================== */

async function copy(text){

    try{

        await navigator.clipboard.writeText(text);

        showNotification(

            "📋 Copied."

        );

    }catch{

        console.log(text);

    }

}

/* ===========================================
   COMPARTIR
=========================================== */

async function shareGame(id){

    const game = getGame(id);

    if(!game) return;

    if(navigator.share){

        await navigator.share({

            title:game.title,

            text:game.description,

            url:location.href

        });

    }else{

        copy(location.href);

    }

}

/* ===========================================
   DEBUG
=========================================== */

const DEBUG = false;

function debug(...args){

    if(DEBUG){

        console.log(

            "[Pablo's Arcade]",

            ...args

        );

    }

}

/* ===========================================
   ERRORES
=========================================== */

window.addEventListener(

    "error",

    event=>{

        console.error(

            "Pablo's Arcade:",

            event.message

        );

    }

);

/* ===========================================
   INFORMACIÓN
=========================================== */

function about(){

    console.table({

        Proyecto:"Pablo's Arcade",

        Version:"1.0",

        Juegos:games.length,

        Favoritos:favorites.length,

        Nivel:player.level,

        Monedas:player.coins,

        Visitas:totalVisits

    });

}

/* ===========================================
   API GLOBAL
=========================================== */

window.PablosArcade={

    games,

    player,

    settings,

    about,

    randomGame,

    getGame,

    exportData,

    importData,

    resetPortal,

    playGame,

    showNotification,

    addCoins,

    addXP,

    unlockAchievement

};

/* ===========================================
   APP LISTA
=========================================== */

console.log(

    "%c🎮 Pablo's Arcade loaded successfully",

    "color:#00d9ff;font-size:16px;font-weight:bold;"

);

debug("App started successfully");
/* =========================================
   HIGH SCORE SYSTEM
========================================= */

const HIGH_SCORES_KEY = "PablosArcadeHighScores";

/*
    Estructura:

    {
        snake: 120,
        dino: 350,
        tetris: 8200
    }
*/

let highScores = JSON.parse(
    localStorage.getItem(HIGH_SCORES_KEY)
) || {};


/* =========================================
   GUARDAR HIGH SCORE
========================================= */

function saveHighScore(gameId, score){

    score = Number(score) || 0;

    const previousScore =
        Number(highScores[gameId]) || 0;


    /*
        Solo guardamos si el nuevo
        resultado supera el récord.
    */

    if(score > previousScore){

        highScores[gameId] = score;

        localStorage.setItem(
            HIGH_SCORES_KEY,
            JSON.stringify(highScores)
        );

        showNotification(
            "🏆 New High Score: " + score
        );

        return true;

    }

    return false;
}


/* =========================================
   OBTENER HIGH SCORE
========================================= */

function getHighScore(gameId){

    return Number(
        highScores[gameId]
    ) || 0;

}


/* =========================================
   OBTENER TODOS LOS HIGH SCORES
========================================= */

function getAllHighScores(){

    return highScores;

}


/* =========================================
   RESETEAR HIGH SCORES
========================================= */

function resetHighScores(){

    highScores = {};

    localStorage.removeItem(
        HIGH_SCORES_KEY
    );

}


/* =========================================
   HIGH SCORE MÁS ALTO
========================================= */

function getBestGame(){

    let bestGame = null;
    let bestScore = 0;

    games.forEach(game => {

        const score =
            getHighScore(game.id);

        if(score > bestScore){

            bestScore = score;
            bestGame = game.id;

        }

    });

    return {

        game: bestGame,
        score: bestScore

    };

}