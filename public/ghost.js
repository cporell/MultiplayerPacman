// CS 4241 Final Project
// Josh Allard jnallard@wpi.edu
// Nathan Bryant nmbryant@wpi.edu
// Connor Porell cgporell@wpi.edu

// ghost.js takes care of ghost moves

//var socket = null;

var myGhostID = "ghost-id";

var myGhost;

document.onkeydown = checkKey;

var mc = new Hammer(document.getElementById("maze"));

// listen to events...
mc.on("panend", checkSwipe);

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


function checkSwipe(e){
    e.preventDefault();
    //console.log(e);
    //console.log(e.direction);

    switch(e.direction){
        case 8: 
            checkKey({keyCode: '38'});
            //console.log("up");
            break;
        case 16: 
            checkKey({keyCode: '40'});
            //console.log("down");
            break;
        case 2: 
            checkKey({keyCode: '37'});
            //console.log("left");
            break;
        case 4: 
            checkKey({keyCode: '39'});
            //console.log("right");
            break;
    }
}

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38' || e.keyCode == '87') {
        ////console.log("Up pressed");
        //myGhost.setInput(MovementEnum.UP);
        sendGhostUpdate(MovementEnum.UP);
    }
    else if (e.keyCode == '40' || e.keyCode == '83') {
        ////console.log("Down pressed");
        //myGhost.setInput(MovementEnum.DOWN);
        sendGhostUpdate(MovementEnum.DOWN);
    }
    else if (e.keyCode == '37' || e.keyCode == '65') {
        ////console.log("Left pressed");
        //myGhost.setInput(MovementEnum.LEFT);
        sendGhostUpdate(MovementEnum.LEFT);
    }
    else if (e.keyCode == '39' || e.keyCode == '68') {
        ////console.log("Right pressed");
        //myGhost.setInput(MovementEnum.RIGHT);
        sendGhostUpdate(MovementEnum.RIGHT);
    }

}