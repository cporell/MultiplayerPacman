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

var ghostStartingX = 1;
var ghostStartingY = 6;

var currentghostX = 1;
var currentghostY = 6;

MovementEnum = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3,
    STOPPED: 4
}

var currentghostDirection = MovementEnum.STOPPED;
var currentghostInput = null;

window.setInterval(getTableFromServer, 100);
document.onkeydown = checkKey;

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
        }
    }
}

function placeCharacters(){
    var tableData = document.getElementById("x_" + ghostStartingX + "-y_" + ghostStartingY);
    tableData.innerHTML = "<img src=\"assets/ghost.gif\" id=\"ghost-gif\">";
    var image = document.getElementById("ghost-gif");
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
            startghost();
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

function startghost(){
    imgObj = document.getElementById('ghost-gif');
    imgObj.style.position= 'relative';
    imgObj.style.left = '0px';
    imgObj.style.top = '0px';
    moveghost();
}

function moveghost(){

    moveghostImage();
    checkInput();

    var ghostSquare = getSquareForObject("ghost-gif");

    currentghostX = ghostSquare.x;
    currentghostY = ghostSquare.y;

    var isghostMoving = isghostHittingWall();

    if (!isghostMoving) {
        currentghostDirection = MovementEnum.STOPPED;
    }

    animate = setTimeout(moveghost, 20); // call moveghost in 20msec
}

function isghostHittingWall(){
    // If ghost moves to a new grid square, check to see if the next one is a wall
    if (currentghostDirection != MovementEnum.STOPPED){

        var nextSquare = getNextSquare(currentghostX, currentghostY, currentghostDirection);

        // If the next square is a wall, stop ghost from moving
        if (isNextSquareWall(nextSquare.x, nextSquare.y)){
            return false;
        }
        return true;
    }
}


function checkInput(){
    if (currentghostDirection == MovementEnum.STOPPED){
        if (currentghostInput != null){
            console.log("Changing ghost direction");
            currentghostDirection = currentghostInput;
            currentghostInput = null;
        }
    }
}

function moveghostImage(){
    switch(currentghostDirection){
        case MovementEnum.UP:
            imgObj.style.top = parseInt(imgObj.style.top) - 2 + 'px';
            break;
        case MovementEnum.RIGHT:
            imgObj.style.left = parseInt(imgObj.style.left) + 2 + 'px';
            break;
        case MovementEnum.DOWN:
            console.log(imgObj.style.top);
            imgObj.style.top = parseInt(imgObj.style.top) + 2 + 'px';
            break;
        case MovementEnum.LEFT:
            imgObj.style.left = parseInt(imgObj.style.left) - 2 + 'px';
            break;
    }
}

function isNextSquareWall(nextX, nextY){
    if (nextX < 0 || nextX > mazeTable.length || nextY < 0 || nextY > mazeTable[0].length){
        return true;
    }
    if (mazeTable[nextX][nextY] == WALL_VALUE){
        return true;
    }
    return false;
}

function getNextSquare(currentX, currentY, currentDirection){
    var nextSquare;
    switch(currentDirection){
        case MovementEnum.UP:
            nextSquare = {x: currentX - 1, y: currentY};
            break;
        case MovementEnum.RIGHT:
            nextSquare = {x: currentX, y: currentY + 1};
            break;
        case MovementEnum.DOWN:
            nextSquare = {x: currentX + 1, y: currentY};
            break;
        case MovementEnum.LEFT:
            nextSquare = {x: currentX, y: currentY - 1};
            break;
    }
    return nextSquare;
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
    req.open('POST', '/ghost');
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

    socket.on('new ghost update', function (data) {
        ghost = parseObjectFromSockets(data.ghost);
        console.log(ghost);
        handleghostUpdate(ghost);
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

function sendghostUpdate(){
    ghost = {oLocation: "oLocation here", direction: "direction here"};
    sendObjectToSockets('send ghost update', ghost);
}
//sendghostUpdate();

function handleghostUpdate(ghost){
    oLocation = ghost.oLocation;
    direction = ghost.direction;

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

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38' || e.keyCode == '87') {
        console.log("Up pressed");
        currentghostInput = MovementEnum.UP;
    }
    else if (e.keyCode == '40' || e.keyCode == '83') {
        console.log("Down pressed");
        currentghostInput = MovementEnum.DOWN;
    }
    else if (e.keyCode == '37' || e.keyCode == '65') {
        console.log("Left pressed");
        currentghostInput = MovementEnum.LEFT;
    }
    else if (e.keyCode == '39' || e.keyCode == '68') {
        console.log("Right pressed");
        currentghostInput = MovementEnum.RIGHT;
    }

}