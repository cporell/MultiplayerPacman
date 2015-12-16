// CS 4241 Final Project
// Josh Allard jnallard@wpi.edu
// Nathan Bryant nmbryant@wpi.edu
// Connor Porell cgporell@wpi.edu

// Index.js takes care of game rules as well as event handlers.

var isStartup = true;
var socket = null;

var gridWidth = 19;
var gridHeight = 20;

var gridSquareWidth = 30;
var gridSquareHeight = 30;

var FLOOR_VALUE = 0;
var WALL_VALUE = 1;
var PELLET_VALUE = 2;
var POWER_PELLET_VALUE = 3;

var ghostsStarted = 0;

var mazeTable;

var isGameStarted = false;

var isActive;

var timerInterval;
var timerLength = 100;

window.onfocus = function () { 
  isActive = true; 
}; 

window.onblur = function () { 
  //isActive = false; 
}; 

var pacmanObj = new character("pacman-gif", pacmanStartX, pacmanStartY, "pacman.gif");
var ghost1Obj = new character("ghost1id", ghost1StartX, ghost1StartY, "blinky.gif");
var ghost2Obj = new character("ghost2id", ghost2StartX, ghost2StartY, "pinky.gif");
var ghost3Obj = new character("ghost3id", ghost3StartX, ghost3StartY, "inky.gif");
var ghost4Obj = new character("ghost4id", ghost4StartX, ghost4StartY, "clyde.gif");

var ghostsArray = [ghost1Obj, ghost2Obj, ghost3Obj, ghost4Obj];

window.setTimeout(getTableFromServer, 100);

function displayTables()
{
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", requestListen);
    oReq.open("GET", "/");
    oReq.send();
    return false;
}

function requestListen()
{
    document.getElementById("thebody").innerHTML = this.responseText;
}

function addBodyListeners()
{

}

function createMaze()
{
    var maze = document.getElementById("maze");
    var html = "";
    html += "<table class=\"tableCenter\">";
    for (var i = 0; i < gridHeight; i++){
        html += "<tr>";
        for (var j = 0; j < gridWidth; j++){
            var tableValue = mazeTable[i][j];
            var squareClass = "";
            if (tableValue == WALL_VALUE){
                squareClass = "wall";
            }
            else {
                squareClass = "floor";
            }
            html += "<td id=\"x_" + i + "-y_" + j + "\"class=\"grid-square " + squareClass + "\">";
            html += "</td>";
        }
        html += "</tr>";
    }
    html += "</table>";
    maze.innerHTML = html;
    setPixelsPerTick();
}

function fillMaze()
{
    for (var i = 0; i < gridHeight; i++){
        for (var j = 0; j < gridWidth; j++){
            var tableValue = mazeTable[i][j];
            var tableData = document.getElementById("x_" + i + "-y_" + j);
            
            if (tableValue == PELLET_VALUE){
                tableData.innerHTML = "<img id=\"pellet-x_" + i + "-y_" + j + "\" src=\"assets/pellet.png\">";
            }
            else if (tableValue == POWER_PELLET_VALUE){
                tableData.innerHTML = "<img id=\"power-pellet-x_" + i + "-y_" + j + "\" src=\"assets/powerpellet.png\">";
            }
            else if (tableValue == WALL_VALUE)
            {
                tableData.innerHTML = setWallSprite(j, i);
            }
        }
    }
}


function placeCharacters(){
    pacmanObj.placeCharacter();
    ghost1Obj.placeCharacter();
    ghost2Obj.placeCharacter();
    ghost3Obj.placeCharacter();
    ghost4Obj.placeCharacter();
}

function setWallSprite(wallPosY, wallPosX)
{
    // Check the N, S, E, and W tils adjacent to this one to determine which maze sprite to place.
    // Checks for being at map bounds are done at this time as well.
    var boundings = [0, 0, 0, 0, 0, 0, 0, 0]; // N E S W NE NW SW SE

    // If the tile is on the map extremeties, set the appropriate boundings

    var isTop = wallPosX == 0;
    var isBottom = wallPosX == gridHeight - 1;
    var isLeft = wallPosY == 0;
    var isRight = wallPosY == gridWidth - 1;

    if(isTop){
        boundings[0] = 0;
    }
    else{
        boundings[0] = mazeTable[wallPosX - 1][wallPosY] === WALL_VALUE ? 1 : 0;
    }


    if(isBottom){
        boundings[2] = 0;
    }
    else{
        boundings[2] = mazeTable[wallPosX + 1][wallPosY] === WALL_VALUE ? 1 : 0;
    }

    if(isLeft){
        boundings[3] = 0;
    }
    else{
        boundings[3] = mazeTable[wallPosX][wallPosY - 1] === WALL_VALUE ? 1 : 0;
    }


    if(isRight){
        boundings[1] = 0;
    }
    else{
        boundings[1] = mazeTable[wallPosX][wallPosY + 1] === WALL_VALUE ? 1 : 0;
    }

    if (isTop || isRight){
        boundings[4] = 0;
    }
    else {
        boundings[4] = mazeTable[wallPosX - 1][wallPosY + 1] === WALL_VALUE ? 1 : 0;
    }

    if (isTop || isLeft){
        boundings[5] = 0;
    }
    else {
        boundings[5] = mazeTable[wallPosX - 1][wallPosY - 1] === WALL_VALUE ? 1 : 0;
    }

    if (isBottom || isLeft){
        boundings[6] = 0;
    }
    else {
        boundings[6] = mazeTable[wallPosX + 1][wallPosY - 1] === WALL_VALUE ? 1 : 0;
    }

    if (isBottom || isRight){
        boundings[7] = 0;
    }
    else {
        boundings[7] = mazeTable[wallPosX + 1][wallPosY + 1] === WALL_VALUE ? 1 : 0;
    }

    var wallType = "";
    // now run through the boundings array to see which wall we should draw
    if (boundings[0] == 0 && boundings[1] == 0 && boundings[2] == 0 && boundings[3] == 0)
    {
        wallType = "lone";
    }
    if (boundings[0] == 0 && boundings[1] == 0 && boundings[2] == 1 && boundings[3] == 0) {
        wallType = "cap-top";
    }
    if (boundings[0] == 0 && boundings[1] == 0 && boundings[2] == 0 && boundings[3] == 1) {
        wallType = "cap-right";
    } //
    if (boundings[0] == 1 && boundings[1] == 0 && boundings[2] == 0 && boundings[3] == 0) {
        wallType = "cap-bot";
    } //
    if (boundings[0] == 0 && boundings[1] == 1 && boundings[2] == 0 && boundings[3] == 0) {
        wallType = "cap-left";
    } //
    if (boundings[0] == 0 && boundings[1] == 1 && boundings[2] == 0 && boundings[3] == 1) {
        wallType = "long-horiz";
    } //
    if (boundings[0] == 1 && boundings[1] == 0 && boundings[2] == 1 && boundings[3] == 0) {
        wallType = "long-vert";
    } //
    if (boundings[0] == 1 && boundings[1] == 1 && boundings[2] == 1 && boundings[3] == 0) {
        if (boundings[4] != 1 && boundings[7] == 1) {
            wallType = "b-LT";
        }
        else if (boundings[4] == 1 && boundings[7] != 1) {
            wallType = "b-LB";
        }
        else if (boundings[4] == 1 && boundings[7] == 1){
            wallType = "TRB";
        }
        else {
            wallType = "t-TRB";
        }
    } // 
    if (boundings[0] == 0 && boundings[1] == 1 && boundings[2] == 1 && boundings[3] == 1) {
        if (boundings[6] != 1 && boundings[7] == 1){
            wallType = "b-TL";
        }
        else if (boundings[6] == 1 && boundings[7] != 1){
            wallType = "b-TR";
        }
        else if (boundings[6] == 1 && boundings[7] == 1){
            wallType = "RBL";
        }
        else {
            wallType = "t-RBL";
        }
    }
    if (boundings[0] == 1 && boundings[1] == 0 && boundings[2] == 1 && boundings[3] == 1) {
        if (boundings[5] != 1 && boundings[6] == 1){
            wallType = "b-RT";
        }
        else if (boundings[5] == 1 && boundings[6] != 1){
            wallType = "b-RB";
        }
        else if (boundings[5] == 1 && boundings[6] == 1){
            wallType = "TBL";
        }
        else {
            wallType = "t-TBL";
        }
    }
    if (boundings[0] == 1 && boundings[1] == 1 && boundings[2] == 0 && boundings[3] == 1) {
        if (boundings[4] != 1 && boundings[5] == 1){
            wallType = "b-BR";
        }
        else if (boundings[4] == 1 && boundings[5] != 1){
            wallType = "b-BL";
        }
        else if (boundings[4] == 1 && boundings[5] == 1){
            wallType = "TRL";
        }
        else {
            wallType = "t-TRL";
        }
    }
    if (boundings[0] == 1 && boundings[1] == 1 && boundings[2] == 0 && boundings[3] == 0) {
        if (boundings[4] != 1) {
            wallType = "l-NE";
        }
        else {
            wallType = "NE";
        }
    }
    if (boundings[0] == 0 && boundings[1] == 1 && boundings[2] == 1 && boundings[3] == 0) {
        if (boundings[7] != 1) {
            wallType = "l-SE";
        }
        else {
            wallType = "SE";
        }
    }
    if (boundings[0] == 1 && boundings[1] == 0 && boundings[2] == 0 && boundings[3] == 1) {
        if (boundings[5] != 1) {
            wallType = "l-NW";
        }
        else {
            wallType = "NW";
        }
    }
    if (boundings[0] == 0 && boundings[1] == 0 && boundings[2] == 1 && boundings[3] == 1) {
        if (boundings[6] != 1) {
            wallType = "l-SW";
        }
        else {
            wallType = "SW";
        }
    }
    if (boundings[0] == 1 && boundings[1] == 1 && boundings[2] == 1 && boundings[3] == 1) {
        if (boundings[4] == 1 && boundings[5] == 1 && boundings[6] == 1 && boundings[7] == 1){
            wallType = "blank";
        }
        else if (boundings[4] != 1) {
            wallType = "4way-TR";
        }
        else if (boundings[5] != 1){
            wallType = "4way-TL";
        }
        else if (boundings[6] != 1){
            wallType = "4way-BL";
        }
        else if (boundings[7] != 1){
            wallType = "4way-BR";
        }
        else {
            wallType = "4way";
        }
    }

    if (wallPosX == 10){
        console.log("WallPosY = " + wallPosY);
    }

    if (wallPosX == 10 && wallPosY == 9){
        console.log("GHOST BOX");
        wallType = "ghost-box";
    }

    var strHTML = "<img src='assets/wall-" + wallType + ".png' class='wall-square'>";

    return strHTML;
}

function getTableFromServer()
{
    url = "/table";
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        handleTable(req);
    };

    req.open('GET', url);
    req.send();
}

function handleTable(req) {
    if( req.readyState !== XMLHttpRequest.DONE ){
        return;
    }

    if(req.status === 200) {
        //console.log("Handling table");
        if (isStartup) {
            mazeTable = eval(req.responseText);
            //console.log(mazeTable);
            createMaze();
            fillMaze();
            placeCharacters();

            //startCharacters();
            requestUpdates();

            isStartup = false;
        }
        else {
            var newMaze = eval(req.responseText);
            compareMazes(newMaze);
        }
    }
}


function startCharacters(){
    console.log("Starting Pacman (index 287)");
    pacmanObj.startMove();

    /*
    ghost1Obj.startMove();
    ghost2Obj.startMove();
    ghost3Obj.startMove();
    ghost4Obj.startMove();
    */
}

function compareMazes(newMaze){
    for (var i = 0; i < gridWidth; i++){
        for (var j = 0; j < gridHeight; j++){
            var newMazeValue = newMaze[i][j];
            var oldMazeValue = mazeTable[i][j];
            if (newMazeValue != oldMazeValue){
                updateMazeSquare(i, j, newMazeValue);
            }
        }
    }
}

function updateMazeSquare(squareX, squareY, newVal){
    mazeTable[squareX][squareY] = newVal;
    var squareElement = document.getElementById("x_" + squareX + "-y_" + squareY);
    if (newVal == FLOOR_VALUE){
        squareElement.innerHTML = "";
    }
    else if (newVal == WALL_VALUE){
        squareElement.innerHTML = "";
        squareElement.style.backgroundColor = "darkblue";
    }
    else if (newVal == PELLET_VALUE){
        squareElement.innerHTML = "<img id=\"pellet-x_" + squareX + "-y_" + squareY + "\" src=\"assets/pellet.png\">";
    }
    else if (newVal == POWER_PELLET_VALUE){
        squareElement.innerHTML = "<img id=\"power-pellet-x_" + squareX + "-y_" + squareY + "\" src=\"assets/powerpellet.png\">";
    }
}


function sendNewTableData(tableX, tableY, newVal){
    var req = new XMLHttpRequest();
    req.open('POST', '/pacman');
    req.send('tableX=' + tableX + '&tableY=' + tableY + '&newVal=' + newVal);
}

connect();

socket.emit('send update', "test");
function connect(){
    if(!socket){
        socket = io();
    }   
    else{
        socket.io.reconnect();
    }

    socket.on('new pacman update', function (data) {
        pacman = parseObjectFromSockets(data.pacman);
        //console.log(pacman);
        if(pacman){
            handlePacmanUpdate(pacman);
        }
    });
    socket.on('new ghosts update', function (data) {
        ghosts = parseObjectFromSockets(data.ghosts);
        //console.log(ghosts);
        if(ghosts){
            handleGhostsUpdate(ghosts);
        }
    });
    socket.on('new board update', function (data) {
        board = parseObjectFromSockets(data.board);
        //console.log(board);
        handleBoardUpdate(board);
    });

    socket.on('new socket opened', function (cookieManager) {
        //cookieManager = parseObjectFromSockets(data);
        console.log(cookieManager);
        handleUpdatePlayers(cookieManager);
    });
    socket.on('restart', function(data){
        receiveRestart(data);
    });
<<<<<<< HEAD
    socket.on('start ghost', function (data) {
        if (!isGameStarted)
        {
            var music = new Audio("audio/pacman_beginning.wav");
            music.play();
=======
    socket.on('start ghost', function(data) {
        if (!isGameStarted){
            timerInterval = window.setInterval(function(){
                timerLength--;
                var timerElement = document.getElementById('timer');
                timerElement.innerText = timerLength;
                if (timerLength <= 0){
                    try {
                        stopGameWithTimer();
                    }
                    catch(err){
                        clearInterval(timerInterval);
                    }
                }
            }, 1000)
>>>>>>> fb8a9b12e4fce6a08c14d0da1f3a9fe88719c489
        }
        isGameStarted = true;
        startGivenGhostNum(data.ghostNum);
        ghostsStarted++;
    });
}

function sendObjectToSockets(updateName, object){
    //console.log(object);
    socket.emit(updateName, JSON.stringify(object));
}

function parseObjectFromSockets(jsonString){
    return JSON.parse(jsonString);
}

function handleUpdatePlayers(cookieManager){
    var cookie = getCookie("pacmanGame");
    console.log("Who are you?", cookie);

    // border around YOUR char, face on ANY TAKEN char

    // PACMAN
    var pacbutton = document.getElementById("pacbutton");

    var pacmanSet = cookieManager.pacman.length > 0;
    if(pacmanSet && cookieManager.pacman === cookie){
        console.log("You are pacman");
        // put border
        pacbutton.setAttribute("style", "border-style: ridge; border-width: 10px");
        var lobbytext = document.getElementById("lobbytext");
        lobbytext.innerText = "Wait for ghosts, then start!"

        var startmusic = new Audio("audio/pacman_intermission.wav");
        startmusic.play();

        // add the start button to the game
    }
    if (pacmanSet)
    {
        // put icon
        pacbutton.innerHTML = "<img src='assets/pacman-taken.png' />";
        pacbutton.removeEventListener("mousedown", goToPacman);
    }

    // GHOST 1
    var ghost1Set = cookieManager.ghost1.length > 0;
    if(ghost1Set && cookieManager.ghost1 === cookie){
        console.log("You are ghost1");
        // put border
        var ghostbutton = document.getElementById("ghost1button");
        ghostbutton.setAttribute("style", "border-style: ridge; border-width: 10px");
        var lobbytext = document.getElementById("lobbytext");
        lobbytext.innerText = "Pac-Man will start the game when ready";
        var startmusic = new Audio("audio/pacman_intermission.wav");
        startmusic.play();

    }
    if (ghost1Set)
    {
        // put icon
        var ghostbutton = document.getElementById("ghost1button");
        ghostbutton.innerHTML = "<img src='assets/ghost-1-taken.png' />";
        ghostbutton.removeEventListener("mousedown", goToGhost1);
        ghost1Obj.isControlled = true;
    }
    else
    {
        var ghostbutton = document.getElementById("ghost1button");
        ghostbutton.innerHTML = "<img src='assets/ghost-1.png' />";
        ghost1Obj.isControlled = false;
    }

    // GHOST 2
    var ghost2Set = cookieManager.ghost2.length > 0;
    if(ghost2Set && cookieManager.ghost2 === cookie){
        console.log("You are ghost2");
        // put border
        var ghostbutton = document.getElementById("ghost2button");
        ghostbutton.setAttribute("style", "border-style: ridge; border-width: 10px");
        var lobbytext = document.getElementById("lobbytext");
        lobbytext.innerText = "Pac-Man will start the game when ready";
        var startmusic = new Audio("audio/pacman_intermission.wav");
        startmusic.play();

    }
    if (ghost2Set)
    {
        // put icon
        var ghostbutton = document.getElementById("ghost2button");
        ghostbutton.innerHTML = "<img src='assets/ghost-2-taken.png' />";
        ghostbutton.removeEventListener("mousedown", goToGhost2);
        ghost2Obj.isControlled = true;
    }
    else
    {
        var ghostbutton = document.getElementById("ghost2button");
        ghostbutton.innerHTML = "<img src='assets/ghost-2.png' />";
        ghost2Obj.isControlled = false;
    }

    // GHOST 3
    var ghost3Set = cookieManager.ghost3.length > 0;
    if(ghost3Set && cookieManager.ghost3 === cookie){
        console.log("You are ghost3");
        // put border
        var ghostbutton = document.getElementById("ghost3button");
        ghostbutton.setAttribute("style", "border-style: ridge; border-width: 10px");
        var lobbytext = document.getElementById("lobbytext");
        lobbytext.innerText = "Pac-Man will start the game when ready";
        var startmusic = new Audio("audio/pacman_intermission.wav");
        startmusic.play();

    }
    if (ghost3Set)
    {
        // put icon
        var ghostbutton = document.getElementById("ghost3button");
        ghostbutton.innerHTML = "<img src='assets/ghost-3-taken.png' />";
        ghostbutton.removeEventListener("mousedown", goToGhost3);
        ghost3Obj.isControlled = true;
    }
    else
    {
        var ghostbutton = document.getElementById("ghost3button");
        ghostbutton.innerHTML = "<img src='assets/ghost-3.png' />";
        ghost3Obj.isControlled = false;
    }

    // GHOST 4
    var ghost4Set = cookieManager.ghost4.length > 0;
    if(ghost4Set && cookieManager.ghost4 === cookie){
        console.log("You are ghost4");
        // put border
        var ghostbutton = document.getElementById("ghost4button");
        ghostbutton.setAttribute("style", "border-style: ridge; border-width: 10px");
        var lobbytext = document.getElementById("lobbytext");
        lobbytext.innerText = "Pac-Man will start the game when ready";
        var startmusic = new Audio("audio/pacman_intermission.wav");
        startmusic.play();

    }
    if (ghost4Set)
    {
        // put icon
        var ghostbutton = document.getElementById("ghost4button");
        ghostbutton.innerHTML = "<img src='assets/ghost-4-taken.png' />";
        ghostbutton.removeEventListener("mousedown", goToGhost4);
        ghost4Obj.isControlled = true;
    }
    else
    {
        var ghostbutton = document.getElementById("ghost4button");
        ghostbutton.innerHTML = "<img src='assets/ghost-4.png' />";
        ghost4Obj.isControlled = false;
    }
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function sendPacmanUpdate(){
    pacman = {pacman: pacmanObj};
    sendObjectToSockets('send pacman update', pacman);
}
//sendghostUpdate();

function handlePacmanUpdate(pacman){
    //console.log(pacman);
    console.log("Handling pacman update");
    pacmanObj.updateCharacter(pacman.pacman);
}

function sendStartGhost(){
    sendObjectToSockets('start ghost', ghostsStarted);
}

function sendGhostUpdate(dir){
    ghost = {direction: dir, number: ghostNum};
    sendObjectToSockets('send ghost update', ghost);
}
//sendghostUpdate();

function handleGhostUpdate(ghost){
    oLocation = ghost.oLocation;
    direction = ghost.direction;

}

function sendGhostsUpdate(){
    //ghost1 = {direction: ghost1};
    //ghost2 = {direction: "direction here"};
    //ghost3 = {direction: "direction here"};
    //ghost4 = {direction: "direction here"};
    ghosts = {ghost1: ghost1Obj,ghost2: ghost2Obj,ghost3: ghost3Obj,ghost4: ghost4Obj}
    sendObjectToSockets('send ghosts update', ghosts);
}
//sendGhostsUpdate();

function handleGhostsUpdate(ghosts){
    //console.log("test");
    ghost1Obj.updateCharacter(ghosts.ghost1);
    ghost2Obj.updateCharacter(ghosts.ghost2);
    ghost3Obj.updateCharacter(ghosts.ghost3);
    ghost4Obj.updateCharacter(ghosts.ghost4);
}

//sendBoardUpdate();
function sendBoardUpdate(x, y, value){
    
    /*board = {x: x, y: y, value: value};
    console.log(board);
    sendObjectToSockets('send board update', board);*/
}

function handleBoardUpdate(board){
   
    compareMazes(board);
}

//requestUpdates();
function requestUpdates(){
    sendObjectToSockets('request updates', '');
}

function restartGame(pacmanWon){
    socket.emit('restart', pacmanWon);
}

function receiveRestart(pacmanWon){
    console.log("Restart received:", pacmanWon);
    if(pacmanWon){
        //window.location.assign(window.location.protocol + '//' + window.location.host);
        window.location = "/pacmanWon.html";
    }
    else{
        window.location = "/pacmanLost.html";
    }
}
