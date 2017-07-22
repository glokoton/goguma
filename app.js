'use strict';

const mapData = require(__dirname + '/server/mapdata/mapdata.json');

var express = require('express');
var app = express();
var serv = require('http').Server(app);

require('./routes')(app);

app.use('/client', express.static(__dirname + '/client'));
app.use('/server', express.static(__dirname + '/server'));

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

    socket.on('goRoom', function () {
        roomNum = Room.connRoom(ROOM_LIST, socket.id);
        Room.initRoom(ROOM_LIST, roomNum, SOCKET_LIST);
    });

    socket.on('changeRoom', function() {
        ROOM_LIST[roomNum].disconn(socket.id);
        roomNum = Room.connRoom(ROOM_LIST, socket.id);
        Room.initRoom(ROOM_LIST, roomNum, SOCKET_LIST);
    })

    socket.on('toggleReady', function() {
        ROOM_LIST[roomNum].toggleReady(socket.id, SOCKET_LIST, PLAYER_LIST);
        Room.initRoom(ROOM_LIST, roomNum, SOCKET_LIST);
    });
    
    PLAYER_LIST[socket.id] = new Player();

    socket.on('initGame', function() {
        socket.emit('initGame', socket.id, PLAYER_LIST[socket.id].getRestrict(), mapData.map, 0);
    });

    socket.on('restart', function() {
        ROOM_LIST[roomNum].refresh();

        for (var i = 0; i < 2; i++) {
            PLAYER_LIST[ROOM_LIST[roomNum].player_list[i]].setPosition(i, ROOM_LIST[roomNum].stage);
            PLAYER_LIST[ROOM_LIST[roomNum].player_list[i]].setRestrict(i);
        }

        socket.emit('initGame', socket.id, PLAYER_LIST[socket.id].getRestrict(), mapData.map, ROOM_LIST[roomNum].stage);
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
        if (data.inputId === 'clear')
            PLAYER_LIST[socket.id].cheat = true;
    });


    socket.on('disconnect', function() {
        /* --SOCKET_DISCONN-- */
        delete SOCKET_LIST[socket.id];

        /* --PLAYER_DISCONN-- */
        delete PLAYER_LIST[socket.id];

        /* --ROOM_DISCONN-- */
        ROOM_LIST[roomNum].disconn(socket.id);
        
        var tmpPlayerList = ROOM_LIST[roomNum].player_list;
        if (tmpPlayerList.length > 0) {
            if (ROOM_LIST[roomNum].state === 'wait'){
                if (tmpPlayerList.length > 0) {
                    SOCKET_LIST[tmpPlayerList[0]].emit('tickTime', {type: 'stop'});
                }

                SOCKET_LIST[tmpPlayerList[0]].emit('initRoom', {id: tmpPlayerList[0], list: ROOM_LIST[roomNum]});
            } else {
                ROOM_LIST[roomNum].state = 'wait';
                SOCKET_LIST[tmpPlayerList[0]].emit('goRoom');
                ROOM_LIST[roomNum].player_list.splice(0, 1);
                ROOM_LIST[roomNum].player_state.splice(0, 1);
            }
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
                var partnerId = ROOM_LIST[i].player_list[1-tmpPlayer];
                /* restrict 5 : only jump move */
                if (PLAYER_LIST[tmpId].restrict == 5 && PLAYER_LIST[partnerId].state !== "JUMP") {
                    PLAYER_LIST[tmpId].pressLeft = false;
                    PLAYER_LIST[tmpId].pressRight = false;
                }

                player.push(Player.updateList(PLAYER_LIST[tmpId], tmpId));

                /* restrict 3 : jump die */
                if (PLAYER_LIST[tmpId].restrict == 3 && PLAYER_LIST[tmpId].state === "JUMP") {
                    if (ROOM_LIST[i].play_time > 10)
                        ROOM_LIST[i].isGameOver = true;
                }
            }

            var tmpList = ROOM_LIST[i].player_list;
            if ((PLAYER_LIST[tmpList[0]].isGoal() && PLAYER_LIST[tmpList[1]].isGoal() && !ROOM_LIST[i].isGameOver) || PLAYER_LIST[tmpList[0]].cheat)
            {
                PLAYER_LIST[tmpList[0]].cheat = false;
                ROOM_LIST[i].goNextStage();
                ROOM_LIST[i].refresh();

                for (var j = 0; j < 2; j++) {
                    PLAYER_LIST[tmpList[j]].setPosition(j, ROOM_LIST[i].stage);
                    PLAYER_LIST[tmpList[j]].setRestrict(j);
                    SOCKET_LIST[tmpList[j]].emit('initGame', tmpList[j], PLAYER_LIST[tmpList[j]].getRestrict(), mapData.map, ROOM_LIST[i].stage);
                }
            }

            pack = {player : player, time: ROOM_LIST[i].tick(SOCKET_LIST, PLAYER_LIST)};

            /* time over */
            if (pack.time >= 30 && (PLAYER_LIST[tmpList[0]].restrict == 2 || PLAYER_LIST[tmpList[1]].restrict == 2)) {
                PLAYER_LIST[tmpList[0]].state = "DEAD";
                PLAYER_LIST[tmpList[1]].state = "DEAD";
            }

            SOCKET_LIST[tmpList[0]].emit('newPosition', pack);
            SOCKET_LIST[tmpList[1]].emit('newPosition', pack);
        }
    }

}, 1000/25);