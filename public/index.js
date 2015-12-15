// CS 4241 Final Project
// Josh Allard jnallard@wpi.edu
// Nathan Bryant nmbryant@wpi.edu
// Connor Porell cgporell@wpi.edu

// Index.js takes care of game rules as well as event handlers.

var isStartup = true;
var socket = null;

var gridWidth = 20;
var gridHeight = 20;

var gridSquareWidth = 30;
var gridSquareHeight = 30;

var FLOOR_VALUE = 0;
var WALL_VALUE = 1;
var PELLET_VALUE = 2;
var POWER_PELLET_VALUE = 3;

var ghostsStarted = 0;

var mazeTable;

/*
var pacmanStartingX = 1;
var pacmanStartingY = 6;

var currentPacmanX = 1;
var currentPacmanY = 6;

MovementEnum = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3,
    STOPPED: 4
}

var currentPacmanDirection = MovementEnum.STOPPED;
var currentPacmanInput = null;
*/

var isActive;

window.onfocus = function () { 
  isActive = true; 
}; 

window.onblur = function () { 
  //isActive = false; 
}; 

// test
//setInterval(function () { 
//  console.log(window.isActive ? 'active' : 'inactive'); 
//}, 1000);


var pacmanObj = new character("pacman-gif", pacmanStartX, pacmanStartY, "pacman.gif");
var ghost1Obj = new character("ghost1id", ghost1StartX, ghost1StartY, "blinky.gif");
var ghost2Obj = new character("ghost2id", ghost2StartX, ghost2StartY, "clyde.gif");
var ghost3Obj = new character("ghost3id", ghost3StartX, ghost3StartY, "inky.gif");
var ghost4Obj = new character("ghost4id", ghost4StartX, ghost4StartY, "pinky.gif");

var ghostsArray = [ghost1Obj, ghost2Obj, ghost3Obj, ghost4Obj];

window.setTimeout(getTableFromServer, 100);
//document.onkeydown = checkKey;

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
    var boundings = [0, 0, 0, 0]; // N E S W

    // If the tile is on the map extremeties, set the appropriate boundings
    
    // is there a wall to the north? EAST
    /*if (wallPosY != 0)
    {
        if (mazeTable[wallPosX][wallPosY - 1] === WALL_VALUE) {
            boundings[1] = 1;
        }
        else {
            boundings[1] = 0;
        }
    }
    
    // is there a wall to the east?
    if (wallPosX != (gridWidth - 1))
    {
        if (mazeTable[wallPosX + 1][wallPosY] === WALL_VALUE) {
            //boundings[1] = 1;
        }
        else {
           // boundings[1] = 0;
        }
    }

    // is there a wall to the south?  WEST
    if (wallPosY != (gridHeight - 1))
    {
        if (mazeTable[wallPosX][wallPosY + 1] === WALL_VALUE) {
            boundings[3] = 1;
        }
        else {
            boundings[3] = 0;
        }
    }

    // is there a wall to the west?
    if (wallPosX != 0)
    {
        if (mazeTable[wallPosX - 1][wallPosY] === WALL_VALUE) {
            //boundings[3] = 1;
        }
        else {
            //boundings[3] = 0;
        }
    }

    if (wallPosY == 0) { boundings[1] = 0; }
    else if (wallPosY == (gridHeight - 1)) { boundings[3] = 0; }
    if (wallPosX == 0) { boundings[3] = 0; }
    else if (wallPosX == (gridWidth - 1)) { boundings[1] = 0; }
    */

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

    //console.log(wallPosX, wallPosY);
    //console.log(boundings);
    
    var wallType = "";
    // now run through the boundings array to see which wall we should draw
    if (boundings[0] == 0 && boundings[1] == 0 && boundings[2] == 0 && boundings[3] == 0)
    {
        wallType = "4way";
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
        wallType = "t-TRB";
    } // 
    if (boundings[0] == 0 && boundings[1] == 1 && boundings[2] == 1 && boundings[3] == 1) {
        wallType = "t-RBL";
    }
    if (boundings[0] == 1 && boundings[1] == 0 && boundings[2] == 1 && boundings[3] == 1) {
        wallType = "t-TBL";
    }
    if (boundings[0] == 1 && boundings[1] == 1 && boundings[2] == 0 && boundings[3] == 1) {
        wallType = "t-TRL";
    }
    if (boundings[0] == 1 && boundings[1] == 1 && boundings[2] == 0 && boundings[3] == 0) {
        wallType = "l-NE";
    }
    if (boundings[0] == 0 && boundings[1] == 1 && boundings[2] == 1 && boundings[3] == 0) {
        wallType = "l-SE";
    }
    if (boundings[0] == 1 && boundings[1] == 0 && boundings[2] == 0 && boundings[3] == 1) {
        wallType = "l-NW";
    }
    if (boundings[0] == 0 && boundings[1] == 0 && boundings[2] == 1 && boundings[3] == 1) {
        wallType = "l-SW";
    }
    if (boundings[0] == 1 && boundings[1] == 1 && boundings[2] == 1 && boundings[3] == 1) {
        wallType = "4way";
    }

    var strHTML = "<img src='assets/wall-" + wallType + ".png' class='wall-square'>";

    //console.log("At " + wallPosX + ", " + wallPosY + " bounding is " + boundings + "walltype is " + wallType);
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

            startCharacters();
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
    socket.on('restart', function(data){
        receiveRestart();
    });
    socket.on('start ghost', function(data) {
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

function sendPacmanUpdate(){
    pacman = {pacman: pacmanObj};
    sendObjectToSockets('send pacman update', pacman);
}
//sendghostUpdate();

function handlePacmanUpdate(pacman){
    //console.log(pacman);
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

function restartGame(){
    socket.emit('restart');
}

function receiveRestart(){
    console.log("Restart received");
    window.location.assign(window.location.protocol + '//' + window.location.host);
}