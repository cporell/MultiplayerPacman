// CS 4241 Final Project
// Josh Allard jnallard@wpi.edu
// Nathan Bryant nmbryant@wpi.edu
// Connor Porell cgporell@wpi.edu

// Index.js takes care of game rules as well as event handlers.

var isStartup = true;
var socket = null;

var gridWidth = 20;
var gridHeight = 20;

var FLOOR_VALUE = 0;
var WALL_VALUE = 1;
var PELLET_VALUE = 2;
var POWER_PELLET_VALUE = 3;

var mazeTable;

var pacmanStartingX = 1;
var pacmanStartingY = 6;

window.setInterval(getTableFromServer, 100);

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
            console.log(tableValue);
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
}

function fillMaze()
{
    for (var i = 0; i < gridHeight; i++){
        for (var j = 0; j < gridWidth; j++){
            var tableValue = mazeTable[i][j];
            var tableData = document.getElementById("x_" + i + "-y_" + j);
            if (tableValue == PELLET_VALUE){
                tableData.innerHTML = "<img src=\"assets/pellet.png\">";
            }
            else if (tableValue == POWER_PELLET_VALUE){
                tableData.innerHTML = "<img src=\"assets/powerpellet.png\">";
            }
            else if (tableValue == WALL_VALUE)
            {
                tableData.innerHTML = setWallSprite(i, j);
            }
        }
    }
}

function setWallSprite(wallPosX, wallPosY)
{
    // Check the N, S, E, and W tils adjacent to this one to determine which maze sprite to place.
    // Checks for being at map bounds are done at this time as well.
    var boundings = [0, 0, 0, 0]; // N E S W

    // If the tile is on the map extremeties, set the appropriate boundings

    if (wallPosY == 0) { boundings[0] = 0; }
    else if (wallPosY == (gridHeight - 1)) { boundings[2] = 0; }
    if (wallPosX == 0) { boundings[3] = 0; }
    else if (wallPosX == (gridWidth - 1)) { boundings[1] = 0; }

    // is there a wall to the north?
    if (wallPosY != 0)
    {
        if (mazeTable[wallPosX][wallPosY - 1] == WALL_VALUE) {
            boundings[0] = 1;
        }
    }
    
    // is there a wall to the east?
    if (wallPosX != gridWidth - 1)
    {
        if (mazeTable[wallPosX + 1][wallPosY] == WALL_VALUE) {
            boundings[1] = 1;
        }
    }

    // is there a wall to the south?
    if (wallPosY != gridHeight - 1)
    {
        if (mazeTable[wallPosX][wallPosY + 1] == WALL_VALUE) {
            boundings[2] = 1;
        }
    }

    // is there a wall to the west?
    if (wallPosX != 0)
    {
        if (mazeTable[wallPosX - 1][wallPosY] == WALL_VALUE) {
            boundings[3] = 1;
        }
    }
    
    var wallType = "";
    // now run through the boundings array to see which wall we should draw
    if (boundings[0] == 0 && boundings[1] == 0 && boundings[2] == 0 && boundings[3] == 0)
    {
        wallType = "";
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

    console.log("At " + wallPosX + ", " + wallPosY + " bounding is " + boundings + "walltype is " + wallType);
    return strHTML;
}

function placeCharacters(){
    var tableData = document.getElementById("x_" + pacmanStartingX + "-y_" + pacmanStartingY);
    tableData.innerHTML = "<img src=\"assets/pacman.gif\" id=\"pacman-gif\">";
    var image = document.getElementById("pacman-gif");
    image.style.width = '80%';
    image.style.height = 'auto';
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
        console.log("Handling table");
        if (isStartup) {
            mazeTable = eval(req.responseText);
            console.log(mazeTable);
            createMaze();
            fillMaze();
            placeCharacters();
            testAnimation();
            isStartup = false;
        }
        else {
            var newMaze = eval(req.responseText);
            compareMazes(newMaze);
        }
    }
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
        squareElement.innerHTML = "<img src=\"assets/pellet.png\">";
    }
    else if (newVal == POWER_PELLET_VALUE){
        squareElement.innerHTML = "<img src=\"assets/powerpellet.png\">";
    }
}

var imgObj;

function testAnimation(){
    imgObj = document.getElementById('pacman-gif');
    imgObj.style.position= 'relative';
    imgObj.style.left = '0px';
    moveRight();
    console.log("Move right called");
}

function moveRight(){
    imgObj.style.left = parseInt(imgObj.style.left) + 1 + 'px';
    animate = setTimeout(moveRight,20); // call moveRight in 20msec
    if (parseInt(imgObj.style.left) >= 600){
        clearTimeout(animate);
    }
    //console.log(imgObj.style.left);
    var pacmanSquare = getSquareForObject("pacman-gif");
    //console.log("Pacman is at (" + pacmanSquare.x + ", " + pacmanSquare.y + ")");

    if (pacmanSquare.x != -1 && pacmanSquare.y != -1 && (pacmanSquare.x != pacmanStartingX || pacmanSquare.y != pacmanStartingY)) {
        var pacmanSquareData = mazeTable[pacmanSquare.x][pacmanSquare.y];
        if (pacmanSquareData == PELLET_VALUE || pacmanSquareData == POWER_PELLET_VALUE) {
            var squareElement = document.getElementById('x_' + pacmanSquare.x + '-y_' + pacmanSquare.y);
            squareElement.innerHTML = "";
            mazeTable[pacmanSquare.x][pacmanSquare.y] = FLOOR_VALUE;
            sendNewTableData(pacmanSquare.x, pacmanSquare.y, FLOOR_VALUE);
        }
    }
}

function isCollision(rect1, rect2){
    return !(rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom);
}

function getSquareForObject(elementId){
    var coordinate;
    var givenElement = document.getElementById(elementId);
    for (var i = 0; i < gridWidth; i++){
        for (var j = 0; j < gridHeight; j++){
            var squareElement = document.getElementById("x_" + i + "-y_" + j);
            gridSquare = squareElement.getBoundingClientRect();
            givenRect = givenElement.getBoundingClientRect();
            var givenRectCenter;
            givenRectCenter = {x: (givenRect.left + (givenRect.width / 2)), y: givenRect.top + (givenRect.height / 2)};
            var isElementInSquare = doesRectContainPoint(gridSquare, givenRectCenter);
            if (isElementInSquare){
                var squareCoords = {x: i, y: j};
                return squareCoords;
            }
        }
    }
    var squareCoords = {x: -1, y: -1};
    return squareCoords;
}

function doesRectContainPoint(rect, point){
    if (point.x <= rect.right && point.x >= rect.left && point.y <= rect.bottom && point.y >= rect.top){
        return true;
    }
    return false;
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
        console.log(pacman);
        handlePacmanUpdate(pacman);
    });
    socket.on('new ghosts update', function (data) {
        ghosts = parseObjectFromSockets(data.ghosts);
        console.log(ghosts);
        handleGhostsUpdate(ghosts);
    });
    socket.on('new board update', function (data) {
        board = parseObjectFromSockets(data.board);
        console.log(board);
        handleBoardUpdate(board);
    });
}

function sendObjectToSockets(updateName, object){
    console.log(object);
    socket.emit(updateName, JSON.stringify(object));
}

function parseObjectFromSockets(jsonString){
    return JSON.parse(jsonString);
}

function sendPacmanUpdate(){
    pacman = {oLocation: "oLocation here", direction: "direction here"};
    sendObjectToSockets('send pacman update', pacman);
}
//sendPacmanUpdate();

function handlePacmanUpdate(pacman){
    oLocation = pacman.oLocation;
    direction = pacman.direction;

}

function sendGhostsUpdate(){
    ghost1 = {oLocation: "Ghost1 oLocation here", direction: "direction here"};
    ghost2 = {oLocation: "oLocation here", direction: "direction here"};
    ghost3 = {oLocation: "oLocation here", direction: "direction here"};
    ghost4 = {oLocation: "oLocation here", direction: "direction here"};
    ghosts = {ghost1: ghost1,ghost2: ghost2,ghost3: ghost3,ghost4: ghost4}
    sendObjectToSockets('send ghosts update', ghosts);
}
//sendGhostsUpdate();

function handleGhostsUpdate(ghosts){
    ghost1 = ghosts.ghost1;
    ghost2 = ghosts.ghost2;
    ghost3 = ghosts.ghost3;
    ghost4 = ghosts.ghost4;
}

sendBoardUpdate();
function sendBoardUpdate(){
    
    board = {oLocation: "oLocation here", action: "action here"};
    sendObjectToSockets('send board update', board);
}

function handleBoardUpdate(board){
    oLocation = board.oLocation;
    action = board.action;
}