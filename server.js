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

var page = fs.readFileSync("./public/index.html").toString();
var tablerows = "";

var FLOOR_VALUE = 0;
var WALL_VALUE = 1;
var PELLET_VALUE = 2;
var POWER_PELLET_VALUE = 3;

var mazeTable = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                 [1, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
                 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
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


initPage();

app.get('/', function (req, res) {
    initPage();
    res.send(page);
});

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
        console.log("Chunk = " + chunk);
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

io.on('connection', function (socket) {
  var addedUser = false;

  socket.on('send pacman update', function (data) {

    socket.broadcast.emit('new pacman update', {
      pacman: data
    });
  });

  socket.on('send ghosts update', function (data) {

    socket.broadcast.emit('new ghosts update', {
      ghosts: data
    });
  });

  socket.on('send board update', function (data) {

    socket.broadcast.emit('new board update', {
      board: data
    });
  });
});