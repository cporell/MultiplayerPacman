// Author: Connor Porell
// CS 4241 Project 4

var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var url = require('url');
var csv = require('csv');

var page = fs.readFileSync("./public/index.html").toString();
var tablerows = "";

function initPage()
{
 
}

var app = express();
var port = process.env.PORT || 3000;

initPage();

app.get('/', function (req, res) {
    initPage();
    res.send(page);
});


app.listen(port, function() {
  console.log('App is listening on port ' + port);
});

app.use(express.static(path.join(__dirname, '/public')));