'use strict';

const mapData = require(__dirname + '/server/mapdata/mapdata.json');

var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

serv.listen(80);
console.log("port : 80 open");

var SOCKET_LIST = {};

var DEBUG = true;

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket)
{
    SOCKET_LIST[socket.id] = socket;
    PLAYER_LIST[socket.id] = new Player();

    socket.emit('initGame', socket.id, mapData.map);

    socket.on('keyPress', function (data)
    {
        if (data.inputId === 'up')
            PLAYER_LIST[socket.id].pressUp = data.isPress;
        if (data.inputId === 'down')
            PLAYER_LIST[socket.id].pressDown = data.isPress;
        if (data.inputId === 'left')
            PLAYER_LIST[socket.id].pressLeft = data.isPress;
        if (data.inputId === 'right')
            PLAYER_LIST[socket.id].pressRight = data.isPress;
    });

    socket.on('disconnect', function() {
        delete SOCKET_LIST[socket.id];
        delete PLAYER_LIST[socket.id];
    });
});


const Player = require('./server/player.js');
var PLAYER_LIST = {};


setInterval(function() {

    var pack = {
        player: Player.updateList(PLAYER_LIST),
    }

    for (var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.emit('newPosition', pack);
    }

}, 1000/25);