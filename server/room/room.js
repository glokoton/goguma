class Room {
    constructor() {
        this.player_list = [];
        this.player_state = [];
        this.state = 'wait';
    }

    isValidate() {
        return (this.player_list.length < 2? true: false);
    }

    start() {
        this.state = 'start';
    }

    conn(id) {
        this.player_list.push(id);
        this.player_state.push('wait');
    }

    disconn(id) {
        if (this.state === 'wait') {
            if (this.player_list[0] === id) {
                this.player_list.splice(0, 1);
                this.player_state.splice(0, 1);
            } else {
                this.player_list.splice(1, 1);
                this.player_state.splice(1, 1);
            }

        } else if (this.state === 'start') {
            // 후에 작성
        }
    }

    toggleReady(id) {
        if (this.player_list[0] === id) {
            this.player_state[0] = (this.player_state[0] === 'ready'? 'wait': 'ready');
        } else {
            this.player_state[1] = (this.player_state[1] === 'ready'? 'wait': 'ready');
        }
    }

    static connRoom(list, id) {
        for (var tmp = 0; tmp < list.length; tmp++) {
            if (list[tmp].isValidate()) {
                list[tmp].conn(id);
                break;
            }
        }
        if (tmp == list.length) {
            list.push(new Room());
            list[tmp].conn(id);
        }
        return tmp;
    }

    static initRoom(ROOM_LIST, roomNum, SOCKET_LIST) {
        for (var i = 0; i < ROOM_LIST[roomNum].player_list.length; i++) {
            var tmpSocketId = ROOM_LIST[roomNum].player_list[i];
            SOCKET_LIST[tmpSocketId].emit('initRoom', {id: tmpSocketId, list: ROOM_LIST[roomNum]});
        }
    }

};

module.exports = Room;