// CS 4241 Final Project
// Josh Allard jnallard@wpi.edu
// Nathan Bryant nmbryant@wpi.edu
// Connor Porell cgporell@wpi.edu

// Index.js takes care of game rules as well as event handlers.

var isStartup = true;
var socket = null;

document.onkeydown = checkKey;

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
        handlePacmanUpdate(pacman);
    });

    socket.on('new ghost update', function (data) {
        ghost = parseObjectFromSockets(data.ghost);
        //console.log(ghost);
        handleGhostUpdate(ghost);
    });

    socket.on('new ghosts update', function (data) {
        ghosts = parseObjectFromSockets(data.ghosts);
        //console.log(ghosts);
        handleGhostsUpdate(ghosts);
    });
    socket.on('new board update', function (data) {
        board = parseObjectFromSockets(data.board);
        //console.log(board);
        handleBoardUpdate(board);
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
    //console.log("Ghost wants to move: " + ghost);
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
}