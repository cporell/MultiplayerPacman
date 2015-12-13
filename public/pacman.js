// CS 4241 Final Project
// Josh Allard jnallard@wpi.edu
// Nathan Bryant nmbryant@wpi.edu
// Connor Porell cgporell@wpi.edu

// Pacman.js takes care of pacman controls.

var isStartup = true;
document.onkeydown = checkKey;

window.setInterval(sendPacmanUpdate, 500);

socket.on('new ghost update', function (data) {
    ghost = parseObjectFromSockets(data.ghost);
    console.log(ghost);
    handleGhostUpdate(ghost);
});

function handleGhostUpdate(ghost){
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

function handleGhostsUpdate(ghosts){
}

function sendBoardUpdate(x, y, value){
    
    board = {x: x, y: y, value: value};
    console.log(board);
    sendObjectToSockets('send board update', board);
}

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38' || e.keyCode == '87') {
        //currentPacmanInput = MovementEnum.UP;
        pacmanObj.setInput(MovementEnum.UP);
        pacmanObj.changeDirection(MovementEnum.UP);
        sendPacmanUpdate(MovementEnum.UP);
        //changePacmanDirection(MovementEnum.UP);
    }
    else if (e.keyCode == '40' || e.keyCode == '83') {
        //currentPacmanInput = MovementEnum.DOWN;
        pacmanObj.setInput(MovementEnum.DOWN);
        pacmanObj.changeDirection(MovementEnum.DOWN);
        sendPacmanUpdate(MovementEnum.DOWN);
        //changePacmanDirection(MovementEnum.DOWN);
    }
    else if (e.keyCode == '37' || e.keyCode == '65') {
        //currentPacmanInput = MovementEnum.LEFT;
        pacmanObj.setInput(MovementEnum.LEFT);
        pacmanObj.changeDirection(MovementEnum.LEFT);
        sendPacmanUpdate(MovementEnum.LEFT);
        //changePacmanDirection(MovementEnum.LEFT);
    }
    else if (e.keyCode == '39' || e.keyCode == '68') {
        //currentPacmanInput = MovementEnum.RIGHT;
        pacmanObj.setInput(MovementEnum.RIGHT);
        pacmanObj.changeDirection(MovementEnum.RIGHT);
        sendPacmanUpdate(MovementEnum.RIGHT);
        //changePacmanDirection(MovementEnum.RIGHT);
    }
    sendGhostsUpdate();
}