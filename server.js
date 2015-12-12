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

var mazeTable = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                 [1, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
                 [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
                 [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
                 [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
                 [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
                 [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
                 [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
                 [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
                 [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
                 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];

function initPage()
{

}

var cookieManager;
function setup(){
    cookieManager = {pacman: "", ghost1: "", ghost2: "", ghost3: "", ghost4: ""};
    console.log(cookieManager);
}
setup();

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
                    cookieManager.ghost1 = req.cookies.pacmanGame;
                }
                if(cookieManager.ghost1 === req.cookies.pacmanGame){
                    pageGhost += "<script>var ghostNum = 1; </script>";
                    passed = true;
                }
                break;
            case "2":
                if(cookieManager.ghost2.length == 0){
                    cookieManager.ghost2 = req.cookies.pacmanGame;
                }
                if(cookieManager.ghost2 === req.cookies.pacmanGame){
                    pageGhost += "<script>var ghostNum = 2; </script>";
                    passed = true;
                }
                break;
            case "3":
                if(cookieManager.ghost3.length == 0){
                    cookieManager.ghost3 = req.cookies.pacmanGame;
                }
                if(cookieManager.ghost3 === req.cookies.pacmanGame){
                    pageGhost += "<script>var ghostNum = 3; </script>";
                    passed = true;
                }
                break;
            case "4":
                if(cookieManager.ghost4.length == 0){
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

    if(cookieManager.pacman.length == 0){
        cookieManager.pacman = req.cookies.pacmanGame;
    }
    if(cookieManager.pacman === req.cookies.pacmanGame){
        var pagePacman = page;
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
    "var ghost1StartX = 9;" +
    "var ghost1StartY = 7;" +
    "var ghost2StartX = 9;" +
    "var ghost2StartY = 4;" +
    "var ghost3StartX = 9;" +
    "var ghost3StartY = 6;" +
    "var ghost4StartX = 9;" +
    "var ghost4StartY = 8;" +
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

var numUsers = 0;
var users = [];
var pacman = null;
var ghosts = null;

io.on('connection', function (socket) {
  var addedUser = false;

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