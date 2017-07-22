class Room {
    constructor() {
        this.player_list = [];
        this.player_state = [];
        this.state = 'wait';
        this.isTick = false;
        this.count = 5; // 5초 후 시작한다!
        this.interval = '';
    }

    isValidate() {
        return (this.player_list.length < 2? true: false);
    }

    start(SOCKET_LIST) {
        this.state = 'start';
        // 시작
        for (var i = 0; i < this.player_list.length; i++) {
            var tmpSocketId = this.player_list[i];
            SOCKET_LIST[tmpSocketId].emit('startGame');
        }
    }

    conn(id) {
        this.player_list.push(id);
        this.player_state.push('wait');
    }

    disconn(id) {
        this.isTick = false;
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

    toggleReady(id, SOCKET_LIST) {
        if (this.player_list[0] === id) {
            this.player_state[0] = (this.player_state[0] === 'ready'? 'wait': 'ready');
        } else {
            this.player_state[1] = (this.player_state[1] === 'ready'? 'wait': 'ready');
        }
        
        var cnt = 0;
        cnt += (this.player_state[0] === 'ready'? 1: 0);
        cnt += (this.player_state[1] === 'ready'? 1: 0);


        if (cnt == 2) {
            this.count = 5;
            this.isTick = true;
            var that = this;

            setTimeout(function(){
               that.countStart(that.player_list, SOCKET_LIST);
            }, 1000);
        } else {
            this.isTick = false;
            for (var i = 0; i < this.player_list.length; i++) {
                var tmpSocketId = this.player_list[i];
                SOCKET_LIST[tmpSocketId].emit('tickTime', {type: 'stop'});
            }
            
        }
    }

    countStart(list, SOCKET_LIST) {
        for (var i = 0; i < list.length; i++) {
            var tmpSocketId = list[i];
            if (this.isTick) {
                SOCKET_LIST[tmpSocketId].emit('tickTime', {type: 'play', time: this.count});
            }
            
        }

        if (!this.isTick) return ;

        this.count--;

        

        if (this.count == -1) {
            this.start(SOCKET_LIST);
        } else {
            var that = this;
            setTimeout(function(){
               that.countStart(list, SOCKET_LIST);
            }, 1000);
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