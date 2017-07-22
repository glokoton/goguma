'use strict';

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
var ROOM_LIST = [];

var DEBUG = true;

var io = require('socket.io')(serv, {});

const Room = require('./server/room/room.js');

io.sockets.on('connection', function(socket) {
    /* --SOCKET_CONN-- */
    SOCKET_LIST[socket.id] = socket;

    /* --ROOM_CONN-- */
    var roomNum = Room.connRoom(ROOM_LIST, socket.id);

    socket.on('disconnect', function() {
        /* --SOCKET_DISCONN-- */
        delete SOCKET_LIST[socket.id];

        /* --ROOM_DISCONN-- */
        ROOM_LIST[roomNum].disconn(socket.id);
    });
});



/*
setInterval(function() {

    var pack = {
        player: Player.updateList(PLAYER_LIST),
    }

    for (var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.emit('newPosition', pack);
    }

}, 1000/25);*/