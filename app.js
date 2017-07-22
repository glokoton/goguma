'use strict';

const mapData = require(__dirname + '/server/mapdata/mapdata.json');

var express = require('express');
var app = express();
var serv = require('http').Server(app);

require('./routes')(app);

app.use('/client', express.static(__dirname + '/client'));

serv.listen(80);
console.log("port : 80 open");

var SOCKET_LIST = {};
var ROOM_LIST = [];

var PLAYER_LIST = {};
const Player = require('./server/player.js');

var DEBUG = true;

var io = require('socket.io')(serv, {});

const Room = require('./server/room/room.js');


io.sockets.on('connection', function(socket)
{
    /* --SOCKET_CONN-- */
    SOCKET_LIST[socket.id] = socket;

    /* --ROOM_CONN-- */
    var roomNum = Room.connRoom(ROOM_LIST, socket.id);

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
        if (data.inputId === 'jump')
            PLAYER_LIST[socket.id].pressJump = data.isPress;
    });


    socket.on('disconnect', function() {
        /* --SOCKET_DISCONN-- */
        delete SOCKET_LIST[socket.id];

        /* --ROOM_DISCONN-- */
        ROOM_LIST[roomNum].disconn(socket.id);
    });
});




setInterval(function() {

    var pack = {
        player: Player.updateList(PLAYER_LIST),
    }

    for (var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.emit('newPosition', pack);
    }

}, 1000/25);