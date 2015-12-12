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

var currentPacmanX = 1;
var currentPacmanY = 6;

var distanceToCenter = 0;
var isPacmanAdjusting = false;

var pacmanPixelsPerTick = 2;

/*
MovementEnum = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3,
    STOPPED: 4
}

var currentPacmanDirection = MovementEnum.STOPPED;
var currentPacmanInput = null;

window.setInterval(getTableFromServer, 100); */
document.onkeydown = checkKey;

/*
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
                tableData.innerHTML = "<img id=\"pellet-x_" + i + "-y_" + j + "\" src=\"assets/pellet.png\">";
            }
            else if (tableValue == POWER_PELLET_VALUE){
                tableData.innerHTML = "<img id=\"power-pellet-x_" + i + "-y_" + j + "\" src=\"assets/powerpellet.png\">";
            }
        }
    }
}
*/

/*
function placeCharacters(){
    var tableData = document.getElementById("x_" + pacmanStartingX + "-y_" + pacmanStartingY);
    tableData.innerHTML = "<img src=\"assets/pacman.gif\" id=\"pacman-gif\">";
    var image = document.getElementById("pacman-gif");
    image.style.width = '80%';
    image.style.height = 'auto';
}

function placeCharacters(){
    for(i = 0; i < 5; i++){
        var gifName = "blinky.gif";
        var x = 0;
        var y = 0;
        var id = "id";
        switch(i){
            case 0:
                gifName = "pacman.gif";
                x = pacmanStartX;
                y = pacmanStartY;
                id = "pacman-gif";
                break;
            case 1:
                gifName = "blinky.gif";
                x = ghost1StartX;
                y = ghost1StartY;
                id = "ghost1ID";
                break;
            case 2:
                gifName = "clyde.gif";
                x = ghost2StartX;
                y = ghost2StartY;
                id = "ghost2ID";
                break;
            case 3:
                gifName = "inky.gif";
                x = ghost3StartX;
                y = ghost3StartY;
                id = "ghost3ID";
                break;
            case 4:
                gifName = "pinky.gif";
                x = ghost4StartX;
                y = ghost4StartY;
                id = "ghost4ID";
                break;
        }
        placeOneCharacter(gifName, x, y, id);
    }
}

function placeOneCharacter(gifName, x, y, id){
    var tableData = document.getElementById("x_" + x + "-y_" + y);
    tableData.innerHTML = "<img src=\"assets/" + gifName + "\" id=\""+ id +"\">";
    var image = document.getElementById(id);
    image.style.width = '80%';
    image.style.height = 'auto';
}*/

/*
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
        if (isStartup) {
            mazeTable = eval(req.responseText);
            console.log(mazeTable);
            createMaze();
            fillMaze();
            placeCharacters();
            startPacman();
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
        squareElement.innerHTML = "<img id=\"pellet-x_" + squareX + "-y_" + squareY + "\" src=\"assets/pellet.png\">";
    }
    else if (newVal == POWER_PELLET_VALUE){
        squareElement.innerHTML = "<img id=\"power-pellet-x_" + squareX + "-y_" + squareY + "\" src=\"assets/powerpellet.png\">";
    }
}

var imgObj;

function startPacman(){
    imgObj = document.getElementById('pacman-gif');
    imgObj.style.position= 'relative';
    imgObj.style.left = '0px';
    imgObj.style.top = '0px';
    movePacman();
}

function movePacman(){

    movePacmanImage();
    checkInput();

    var pacmanSquare = getSquareForObject("pacman-gif");

    removePellet(pacmanSquare);

    currentPacmanX = pacmanSquare.x;
    currentPacmanY = pacmanSquare.y;

    var isPacmanMoving = isPacmanHittingWall(currentPacmanDirection);

    if (isPacmanMoving && !isPacmanAdjusting) {
        getDistanceToCenter("pacman-gif", pacmanSquare.x, pacmanSquare.y);
        isPacmanAdjusting = true;
    }

    animate = setTimeout(movePacman, 20); // call movePacman in 20msec
}

function getDistanceToCenter(pacmanId, squareX, squareY){
    var pacmanElement = document.getElementById(pacmanId);
    var gridSquareElement = document.getElementById("x_" + squareX + "-y_" + squareY);
    var pacmanRect = pacmanElement.getBoundingClientRect();
    var gridSquareRect = gridSquareElement.getBoundingClientRect();
    var pacmanRectCenter = {x: (pacmanRect.left + (pacmanRect.width / 2)), y: pacmanRect.top + (pacmanRect.height / 2)};
    var squareRectCenter = {x: (gridSquareRect.left + (gridSquareRect.width / 2)), y: gridSquareRect.top + (gridSquareRect.height / 2)};

    switch (currentPacmanDirection){
        case MovementEnum.UP:
            distanceToCenter = pacmanRectCenter.y - squareRectCenter.y;
            break;
        case MovementEnum.RIGHT:
            distanceToCenter = squareRectCenter.x - pacmanRectCenter.x;
            break;
        case MovementEnum.DOWN:
            distanceToCenter = squareRectCenter.y - pacmanRectCenter.y;
            break;
        case MovementEnum.LEFT:
            distanceToCenter = pacmanRectCenter.x - squareRectCenter.x;
            break;
    }
}

function isPacmanHittingWall(direction){
    // If Pacman moves to a new grid square, check to see if the next one is a wall
    if (direction != MovementEnum.STOPPED){

        var nextSquare = getNextSquare(currentPacmanX, currentPacmanY, direction);

        // If the next square is a wall, stop Pacman from moving
        if (isNextSquareWall(nextSquare.x, nextSquare.y)){
            return true;
        }
        return false;
    }
    else {
        return false;
    }
}

function removePellet(pacmanSquare){
    // Remove the pellet from this square that Pacman is currently in
    var pacmanSquareData = mazeTable[pacmanSquare.x][pacmanSquare.y];
    if (pacmanSquareData == PELLET_VALUE) {
        var squareElement = document.getElementById('x_' + pacmanSquare.x + '-y_' + pacmanSquare.y)
        var pelletElement = document.getElementById('pellet-x_' + pacmanSquare.x + '-y_' + pacmanSquare.y);
        if (pelletElement) {
            squareElement.removeChild(pelletElement);
            mazeTable[pacmanSquare.x][pacmanSquare.y] = FLOOR_VALUE;
            sendNewTableData(pacmanSquare.x, pacmanSquare.y, FLOOR_VALUE);
        }
    }
    else if (pacmanSquareData == POWER_PELLET_VALUE){
        var squareElement = document.getElementById('x_' + pacmanSquare.x + '-y_' + pacmanSquare.y)
        var pelletElement = document.getElementById('power-pellet-x_' + pacmanSquare.x + '-y_' + pacmanSquare.y);
        if (pelletElement) {
            squareElement.removeChild(pelletElement);
            mazeTable[pacmanSquare.x][pacmanSquare.y] = FLOOR_VALUE;
            sendNewTableData(pacmanSquare.x, pacmanSquare.y, FLOOR_VALUE);
        }
    }
}*/

/*
function checkInput(){
    if (currentPacmanDirection == MovementEnum.STOPPED){
        if (currentPacmanInput != null){
            currentPacmanDirection = currentPacmanInput;
            changePacmanImageRotation(currentPacmanInput);
            currentPacmanInput = null;
        }
    }
}

function movePacmanImage(){
    if (isPacmanAdjusting && distanceToCenter <= 0){
        currentPacmanDirection = MovementEnum.STOPPED;
        isPacmanAdjusting = false;
        return;
    }

    switch(currentPacmanDirection){
        case MovementEnum.UP:
            imgObj.style.top = parseInt(imgObj.style.top) - pacmanPixelsPerTick + 'px';
            break;
        case MovementEnum.RIGHT:
            imgObj.style.left = parseInt(imgObj.style.left) + pacmanPixelsPerTick + 'px';
            break;
        case MovementEnum.DOWN:
            imgObj.style.top = parseInt(imgObj.style.top) + pacmanPixelsPerTick + 'px';
            break;
        case MovementEnum.LEFT:
            imgObj.style.left = parseInt(imgObj.style.left) - pacmanPixelsPerTick + 'px';
            break;
    }

    if (isPacmanAdjusting){
        distanceToCenter -= pacmanPixelsPerTick;
        if (distanceToCenter <= 0){
            isPacmanAdjusting = false;
            currentPacmanDirection = MovementEnum.STOPPED;
        }
    }
}

function changePacmanDirection(newDirection){
    if (!isPacmanAdjusting) {

        if (!isPacmanHittingWall(newDirection)) {
            currentPacmanDirection = newDirection;
            changePacmanImageRotation(newDirection);
        }
    }
}

function changePacmanImageRotation(newDirection){
    var pacmanElement = document.getElementById('pacman-gif');
    switch(newDirection){
        case MovementEnum.UP:
            pacmanElement.className = 'rotate-up';
            break;
        case MovementEnum.RIGHT:
            pacmanElement.className = ' rotate-right';
            break;
        case MovementEnum.DOWN:
            pacmanElement.className = ' rotate-down';
            break;
        case MovementEnum.LEFT:
            pacmanElement.className = ' rotate-left';
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
    req.open('POST', '/pacman');
    req.send('tableX=' + tableX + '&tableY=' + tableY + '&newVal=' + newVal);
}
*/
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

    socket.on('new ghost update', function (data) {
        ghost = parseObjectFromSockets(data.ghost);
        console.log(ghost);
        handleGhostUpdate(ghost);
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

function sendGhostUpdate(){
    pacman = {oLocation: "oLocation here", direction: "direction here"};
    sendObjectToSockets('send pacman update', pacman);
}
//sendPacmanUpdate();

function handleGhostUpdate(ghost){
    console.log("Ghost wants to move: " + ghost);

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
        //currentPacmanInput = MovementEnum.UP;
        pacmanObj.setInput(MovementEnum.UP);
        pacmanObj.changeDirection(MovementEnum.UP);
        //changePacmanDirection(MovementEnum.UP);
    }
    else if (e.keyCode == '40' || e.keyCode == '83') {
        //currentPacmanInput = MovementEnum.DOWN;
        pacmanObj.setInput(MovementEnum.DOWN);
        pacmanObj.changeDirection(MovementEnum.DOWN);
        //changePacmanDirection(MovementEnum.DOWN);
    }
    else if (e.keyCode == '37' || e.keyCode == '65') {
        //currentPacmanInput = MovementEnum.LEFT;
        pacmanObj.setInput(MovementEnum.LEFT);
        pacmanObj.changeDirection(MovementEnum.LEFT);
        //changePacmanDirection(MovementEnum.LEFT);
    }
    else if (e.keyCode == '39' || e.keyCode == '68') {
        //currentPacmanInput = MovementEnum.RIGHT;
        pacmanObj.setInput(MovementEnum.RIGHT);
        pacmanObj.changeDirection(MovementEnum.RIGHT);
        //changePacmanDirection(MovementEnum.RIGHT);
    }
}