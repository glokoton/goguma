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

    socket.on('initRoom', function () {
        Room.initRoom(ROOM_LIST, roomNum, SOCKET_LIST);
    });

    socket.on('toggleReady', function() {
        ROOM_LIST[roomNum].toggleReady(socket.id, SOCKET_LIST, PLAYER_LIST);
        Room.initRoom(ROOM_LIST, roomNum, SOCKET_LIST);
    });
    
    PLAYER_LIST[socket.id] = new Player();

    socket.on('initGame', function() {
        socket.emit('initGame', socket.id, PLAYER_LIST[socket.id].getRestrict(), mapData.map);
    });

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
        delete PLAYER_LIST[socket.id];

        /* --PLAYER_DISCONN-- */
        delete PLAYER_LIST[socket.id];

        /* --ROOM_DISCONN-- */
        ROOM_LIST[roomNum].disconn(socket.id);
        var tmpPlayerList = ROOM_LIST[roomNum].player_list;
        if (tmpPlayerList.length > 0) {
            SOCKET_LIST[tmpPlayerList[0]].emit('initRoom', {id: tmpPlayerList[0], list: ROOM_LIST[roomNum]});
        }

    });
});

setInterval(function() {
    for (var i = 0; i < ROOM_LIST.length; i++) {
        if (ROOM_LIST[i].state === 'start') {
            var pack = {};
            var player = [];

            for (var tmpPlayer = 0; tmpPlayer < ROOM_LIST[i].player_list.length; tmpPlayer++) {
                var tmpId = ROOM_LIST[i].player_list[tmpPlayer];
                player.push(Player.updateList(PLAYER_LIST[tmpId], tmpId));
         
            }

            pack = {player : player, time: ROOM_LIST[i].tick()};
            SOCKET_LIST[ROOM_LIST[i].player_list[0]].emit('newPosition', pack);
            SOCKET_LIST[ROOM_LIST[i].player_list[1]].emit('newPosition', pack);
        }
    }

}, 1000/25);