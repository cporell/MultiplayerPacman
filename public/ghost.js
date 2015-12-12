// CS 4241 Final Project
// Josh Allard jnallard@wpi.edu
// Nathan Bryant nmbryant@wpi.edu
// Connor Porell cgporell@wpi.edu

// ghost.js takes care of ghost moves

var socket = null;

var myGhostID = "ghost-id";

var myGhost;

document.onkeydown = checkKey;

switch(ghostNum){
    case 1:
        myGhost = ghost1Obj;
        break;
    case 2:
        myGhost = ghost2Obj;
        break;
    case 3:
        myGhost = ghost3Obj;
        break;
    case 4:
        myGhost = ghost4Obj;
        break;
}
//console.log(myGhost);


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
    pacman = {oLocation: "oLocation here", direction: "direction here"};
    sendObjectToSockets('send pacman update', pacman);
}
//sendghostUpdate();

function handlePacmanUpdate(pacman){
    //console.log(pacman);
    pacmanObj.updateCharacter(pacman.pacman);
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
    ghost1 = {oLocation: "Ghost1 oLocation here", direction: "direction here"};
    ghost2 = {oLocation: "oLocation here", direction: "direction here"};
    ghost3 = {oLocation: "oLocation here", direction: "direction here"};
    ghost4 = {oLocation: "oLocation here", direction: "direction here"};
    ghosts = {ghost1: ghost1,ghost2: ghost2,ghost3: ghost3,ghost4: ghost4}
    sendObjectToSockets('send ghosts update', ghosts);
}
//sendGhostsUpdate();

function handleGhostsUpdate(ghosts){
    ghost1Obj.updateCharacter(ghosts.ghost1);
    ghost2Obj.updateCharacter(ghosts.ghost2);
    ghost3Obj.updateCharacter(ghosts.ghost3);
    ghost4Obj.updateCharacter(ghosts.ghost4);
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
        //console.log("Up pressed");
        //myGhost.setInput(MovementEnum.UP);
        sendGhostUpdate(MovementEnum.UP);
    }
    else if (e.keyCode == '40' || e.keyCode == '83') {
        //console.log("Down pressed");
        //myGhost.setInput(MovementEnum.DOWN);
        sendGhostUpdate(MovementEnum.DOWN);
    }
    else if (e.keyCode == '37' || e.keyCode == '65') {
        //console.log("Left pressed");
        //myGhost.setInput(MovementEnum.LEFT);
        sendGhostUpdate(MovementEnum.LEFT);
    }
    else if (e.keyCode == '39' || e.keyCode == '68') {
        //console.log("Right pressed");
        //myGhost.setInput(MovementEnum.RIGHT);
        sendGhostUpdate(MovementEnum.RIGHT);
    }

}