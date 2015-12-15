// CS 4241 Final Project
// Josh Allard jnallard@wpi.edu
// Nathan Bryant nmbryant@wpi.edu
// Connor Porell cgporell@wpi.edu

// Pacman.js takes care of pacman controls.



var isStartup = true;
document.onkeydown = checkKey;

var pacbutton = document.getElementById("pacbutton");
pacbutton.innerHTML = "<img src='assets/start.png' />"
pacbutton.removeEventListener("mousedown", goToPacman);
var lobbytext = document.getElementById("lobbytext");
//lobbytext.innerHTML = "You are playing PacMan! Press 'Play' to start the game.";

window.setInterval(function(){
    sendPacmanUpdate();
    //sendGhostsUpdate();
    }, 500);

socket.on('new ghost update', function (data) {
    ghost = parseObjectFromSockets(data.ghost);
    //console.log(ghost);
    handleGhostUpdate(ghost);
});

pacmanObj.isGameHost = true;

function handleGhostUpdate(ghost){
    if(isActive){
        switch(ghost.number){
            case 1:
                ghost1Obj.setInput(ghost.direction);
                break;
            case 2:
                ghost2Obj.setInput(ghost.direction);
                break;
            case 3:
                ghost3Obj.setInput(ghost.direction);
                break;
            case 4:
                ghost4Obj.setInput(ghost.direction);
                break;
        }
        sendGhostsUpdate();
    }
}

function handleGhostsUpdate(ghosts){
}

function sendBoardUpdate(x, y, value){
    
    board = {x: x, y: y, value: value};
    //console.log(board);
    sendObjectToSockets('send board update', board);
}

function sendPacmanWin(){
    console.log("Pacman has won");
    restartGame();
}

function sendPacmanLost(){
    console.log("Pacman has lost");
    restartGame();
}

function isGameWon(){
    for(var i = 0; i < mazeTable.length; i++){
        for (var j = 0; j < mazeTable[0].length; j++){
            var tableData = mazeTable[i][j];
            if (tableData == PELLET_VALUE || tableData == POWER_PELLET_VALUE){
                console.log("Pellet at " + i + ", " + j);
                return false;
            }
        }
    }
    return true;
}



function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38' || e.keyCode == '87') {
        //currentPacmanInput = MovementEnum.UP;
        pacmanObj.setInput(MovementEnum.UP);
        if (pacmanObj.currentDirection == MovementEnum.DOWN) {
            pacmanObj.changeDirection(MovementEnum.UP);
        }
        sendPacmanUpdate(MovementEnum.UP);
        //changePacmanDirection(MovementEnum.UP);
    }
    else if (e.keyCode == '40' || e.keyCode == '83') {
        //currentPacmanInput = MovementEnum.DOWN;
        pacmanObj.setInput(MovementEnum.DOWN);
        if (pacmanObj.currentDirection == MovementEnum.UP) {
            pacmanObj.changeDirection(MovementEnum.DOWN);
        }
        sendPacmanUpdate(MovementEnum.DOWN);
        //changePacmanDirection(MovementEnum.DOWN);
    }
    else if (e.keyCode == '37' || e.keyCode == '65') {
        //currentPacmanInput = MovementEnum.LEFT;
        pacmanObj.setInput(MovementEnum.LEFT);
        if (pacmanObj.currentDirection == MovementEnum.RIGHT) {
            pacmanObj.changeDirection(MovementEnum.LEFT);
        }
        sendPacmanUpdate(MovementEnum.LEFT);
        //changePacmanDirection(MovementEnum.LEFT);
    }
    else if (e.keyCode == '39' || e.keyCode == '68') {
        //currentPacmanInput = MovementEnum.RIGHT;
        pacmanObj.setInput(MovementEnum.RIGHT);
        if (pacmanObj.currentDirection == MovementEnum.LEFT) {
            pacmanObj.changeDirection(MovementEnum.RIGHT);
        }
        sendPacmanUpdate(MovementEnum.RIGHT);
        //changePacmanDirection(MovementEnum.RIGHT);
    }
    sendGhostsUpdate();
}