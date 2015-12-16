// Author: Connor Porell
// CS 4241 Project 4

var express = require('express');
//var http = require('http');
var path = require('path');
var fs = require('fs');
var url = require('url');
var csv = require('csv');
var app = express();
var port = process.env.PORT || 3000;
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var cookieParser = require('cookie-parser');

var page = fs.readFileSync("./public/index.html").toString();
var tablerows = "";

var FLOOR_VALUE = 0;
var WALL_VALUE = 1;
var PELLET_VALUE = 2;
var POWER_PELLET_VALUE = 3;

var originalTable = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                     [1, 2, 3, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
                     [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
                     [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
                     [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
                     [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
                     [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
                     [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
                     [1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
                     [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
                     [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
                     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];

var mazeTable = [];

function initPage()
{

}

var pacman = null;
var ghosts = null;
var cookieManager;
function setup(){
    cookieManager = new cookieManagerObj();
    pacman = null;
    ghosts = null;
    console.log(cookieManager);
}
setup();

function cookieManagerObj(){
  this.pacman = "";
  this.ghost1 = "";
  this.ghost2 = "";
  this.ghost3 = "";
  this.ghost4 = "";

  this.clearMatchingCookie = function(cookieStr){
    if(this.pacman === cookieStr) this.pacman = "";
    if(this.ghost1 === cookieStr) this.ghost1 = "";
    if(this.ghost2 === cookieStr) this.ghost2 = "";
    if(this.ghost3 === cookieStr) this.ghost3 = "";
    if(this.ghost4 === cookieStr) this.ghost4 = "";
  };
}

app.use(cookieParser());

app.use(function (req, res, next) {
  // check if client sent cookie
  var cookie = req.cookies.pacmanGame;
  if (cookie === undefined)
  {
    // no: set a new cookie
    var randomNumber=Math.random().toString();
    randomNumber=randomNumber.substring(2,randomNumber.length);
    res.cookie('pacmanGame',randomNumber, { maxAge: 90000000, httpOnly: false });
  } 
  next(); // <-- important!
});

initPage();

app.get('/', function (req, res) {
    initPage();
    cookieManager.clearMatchingCookie(req.cookies.pacmanGame);
    var pageIndex = page + getStartingPositionsScript() + "<script src='index.js' type='text/javascript'></script>";
    res.send(pageIndex);
});

app.get('/ghost', function (req, res) {
    passed = false;
    var pageGhost = page;
    if(req.query.ghost && req.query.ghost.length > 0){
        requestedGhost = req.query.ghost;
        switch(requestedGhost){
            case "1":
                if(cookieManager.ghost1.length == 0){
                    cookieManager.clearMatchingCookie(req.cookies.pacmanGame);
                    cookieManager.ghost1 = req.cookies.pacmanGame;
                }
                if(cookieManager.ghost1 === req.cookies.pacmanGame){
                    pageGhost += "<script>var ghostNum = 1; </script>";
                    passed = true;
                }
                break;
            case "2":
                if(cookieManager.ghost2.length == 0){
                    cookieManager.clearMatchingCookie(req.cookies.pacmanGame);
                    cookieManager.ghost2 = req.cookies.pacmanGame;
                }
                if(cookieManager.ghost2 === req.cookies.pacmanGame){
                    pageGhost += "<script>var ghostNum = 2; </script>";
                    passed = true;
                }
                break;
            case "3":
                if(cookieManager.ghost3.length == 0){
                    cookieManager.clearMatchingCookie(req.cookies.pacmanGame);
                    cookieManager.ghost3 = req.cookies.pacmanGame;
                }
                if(cookieManager.ghost3 === req.cookies.pacmanGame){
                    pageGhost += "<script>var ghostNum = 3; </script>";
                    passed = true;
                }
                break;
            case "4":
                if(cookieManager.ghost4.length == 0){
                    cookieManager.clearMatchingCookie(req.cookies.pacmanGame);
                    cookieManager.ghost4 = req.cookies.pacmanGame;
                }
                if(cookieManager.ghost4 === req.cookies.pacmanGame){
                    pageGhost += "<script>var ghostNum = 4; </script>";
                    passed = true;
                }
                break;
        }

        
    }

    if(passed){
            pageGhost += getStartingPositionsScript();
            pageGhost += "<script src='index.js' type='text/javascript'></script>";
            pageGhost += "<script src='ghost.js' type='text/javascript'></script>";
            res.send(pageGhost);
    }
    else {
        res.send("<html><head><script> document.location = '/'; </script></head></html>");
    }
});

app.get('/pacman', function (req, res) {
    pacman = null;
    ghosts = null;

    if(cookieManager.pacman.length == 0){

        cookieManager.clearMatchingCookie(req.cookies.pacmanGame);
        cookieManager.pacman = req.cookies.pacmanGame;
    }
    if(cookieManager.pacman === req.cookies.pacmanGame){
        var pagePacman = page;
        //var divString = "<div id='lobby'>\n<h1>\nGame Lobby\n</h1>\n<form>\n<button type='submit' id='pacbutton' name='pacman'><img src='assets/button-pacman.jpg' /></button>\n<button type='submit' id='ghostbutton' name='ghost'><img src='assets/button-ghost.png' /></button>\n</form>\n</div>";
        //pagePacman = pagePacman.replace(divString, "");
        pagePacman += getStartingPositionsScript();
        pagePacman += "<script src='index.js' type='text/javascript'></script>";
        pagePacman += "<script src='pacman.js' type='text/javascript'></script>";
        res.send(pagePacman);
    }
    else{
        res.send("<html><head><script> document.location = '/'; </script></head></html>");
    }
});


function getStartingPositionsScript(){
    var script = "<script>" +
        "var pacmanStartX = 1;" +
        "var pacmanStartY = 5;" +
        "var ghost1StartX = 8;" +
        "var ghost1StartY = 8;" +
        "var ghost2StartX = 8;" +
        "var ghost2StartY = 9;" +
        "var ghost3StartX = 8;" +
        "var ghost3StartY = 10;" +
        "var ghost4StartX = 9;" +
        "var ghost4StartY = 9;" +
        "var ghostSpawnPointX = 11;" +
        "var ghostSpawnPointY = 9;" +
    "</script>";
    return script;

}

app.get('/table', function (req, res) {
    res.send(mazeTable);
});

app.post('/pacman', function(req, res){
    var chunk = "";
    req.on('data', function(data) {
        chunk += data;
    });
    req.on("end", function() {
        chunk = chunk.split('&');
        var tableX = chunk[0].split('=')[1];
        var tableY = chunk[1].split('=')[1];
        var newVal = chunk[2].split('=')[1];
        mazeTable[tableX][tableY] = newVal;
        res.end();
    });
});

/*app.listen(port, function() {
    setInterval(testChangeValue, 1000);
    console.log('App is listening on port ' + port);
});*/

server.listen(port, function () {
    console.log('Server listening at port %d', port);
    cloneOriginalArray();
});

app.use(express.static(path.join(__dirname, '/public')));

function testChangeValue(){
    var i = 1;
    var j = 1;
    var data = mazeTable[i][j];
    if (data == FLOOR_VALUE){
        mazeTable[i][j] = PELLET_VALUE;
    }
    else {
        mazeTable[i][j] = FLOOR_VALUE;
    }
}

function cloneOriginalArray(){
    for (var i = 0; i < originalTable.length; i++){
        mazeTable[i] = originalTable[i].slice();
    }
}

var numUsers = 0;
var users = [];

io.on('connection', function (socket) {
  var addedUser = false;

  socket.emit('new socket opened', cookieManager);
  socket.broadcast.emit('new socket opened', cookieManager);

  socket.on('request updates', function (data) {

    socket.emit('new pacman update', {
      pacman: pacman
    });

    socket.emit('new ghosts update', {
      ghosts: ghosts
    });
  });

  socket.on('send pacman update', function (data) {
    pacman = data;

    socket.broadcast.emit('new pacman update', {
      pacman: data
    });
  });

  socket.on('start ghost', function (data){
    socket.emit('start ghost', {
      ghostNum: data
    });
    socket.broadcast.emit('start ghost', {
      ghostNum: data
    });
  });

  socket.on('send ghost update', function (data) {
    socket.broadcast.emit('new ghost update', {
      ghost: data
    });
  });

  socket.on('send ghosts update', function (data) {
    ghosts = data;
    socket.broadcast.emit('new ghosts update', {
      ghosts: data
    });
  });

    socket.on('restart', function(data){
        console.log("Original Table 1, 4 = " + originalTable[1][4]);
        setup();
        socket.emit('restart', data);
        socket.broadcast.emit('restart', data);
        cloneOriginalArray();
        setTimeout(setup, 1000);
    });

  socket.on('send board update', function (data) {
        dataNew = JSON.parse(data);
        var tableX = dataNew.x;
        var tableY = dataNew.y;
        var newVal = dataNew.value;
        mazeTable[tableX][tableY] = newVal;
    socket.broadcast.emit('new board update', {
      board: JSON.stringify(mazeTable)
    });
  });
});