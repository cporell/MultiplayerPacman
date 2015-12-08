// CS 4241 Final Project
// Josh Allard jnallard@wpi.edu
// Nathan Bryant nmbryant@wpi.edu
// Connor Porell cgporell@wpi.edu

// Index.js takes care of game rules as well as event handlers.

var isStartup = true;

var gridWidth = 20;
var gridHeight = 20;

var FLOOR_VALUE = 0;
var WALL_VALUE = 1;
var PELLET_VALUE = 2;
var POWER_PELLET_VALUE = 3;

var mazeTable;

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
        }
    }
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