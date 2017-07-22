class Room {
    constructor() {
        this.player_list = [];
        this.player_state = [];
        this.state = 'wait';
        this.isTick = false;
        this.count = 5; // 5초 후 시작한다!
        this.play_time = 0;
        this.second = 0;
        this.interval = '';
        this.timeLimit = false;
        this.isGameOver = false;
    }

    isValidate() {
        return (this.player_list.length < 2? true: false);
    }

    start(SOCKET_LIST, PLAYER_LIST, stageIdx) {
        // 시작
        for (var i = 0; i < this.player_list.length; i++) {
            // set position & restrict
            PLAYER_LIST[this.player_list[i]].setPosition(i);
            PLAYER_LIST[this.player_list[i]].setRestrict(i);

            var tmpSocketId = this.player_list[i];
            SOCKET_LIST[tmpSocketId].emit('startGame');
        }

        this.setStage(stageIdx);

        if(this.stage == 0) {
            this.timeLimit = true;
        }

        this.play_time = 0;
        this.second = 0;
        this.state = 'start';
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


            if (this.player_list[0] === id) {
                this.player_list.splice(0, 1);
                this.player_state.splice(0, 1);
            } else {
                this.player_list.splice(1, 1);
                this.player_state.splice(1, 1);
            }

            this.isTick = false;
            this.count = 5; // 5초 후 시작한다!
            this.play_time = 0;
            this.second = 0;
            this.interval = '';

        }
    }

    toggleReady(id, SOCKET_LIST, PLAYER_LIST) {
        if (this.player_list[0] === id) {
            this.player_state[0] = (this.player_state[0] === 'ready'? 'wait': 'ready');
        } else {
            this.player_state[1] = (this.player_state[1] === 'ready'? 'wait': 'ready');
        }
        
        var cnt = 0;
        cnt += (this.player_state[0] === 'ready'? 1: 0);
        cnt += (this.player_state[1] === 'ready'? 1: 0);


        if (cnt == 2) {
            this.count = 0;
            this.isTick = true;
            var that = this;

            setTimeout(function(){
                that.countStart(that.player_list, SOCKET_LIST, PLAYER_LIST, 0);
            }, 1000);
        } else {
            this.isTick = false;
            for (var i = 0; i < this.player_list.length; i++) {
                var tmpSocketId = this.player_list[i];
                SOCKET_LIST[tmpSocketId].emit('tickTime', {type: 'stop'});
            }
            
        }
    }

    countStart(list, SOCKET_LIST, PLAYER_LIST, stageIdx) {
        for (var i = 0; i < list.length; i++) {
            var tmpSocketId = list[i];
            if (this.isTick) {
                SOCKET_LIST[tmpSocketId].emit('tickTime', {type: 'play', time: this.count});
            }
            
        }

        if (!this.isTick) return ;

        this.count--;

        

        if (this.count == -1) {
            this.start(SOCKET_LIST, PLAYER_LIST, stageIdx);
        } else {
            var that = this;
            setTimeout(function(){
                that.countStart(list, SOCKET_LIST, PLAYER_LIST, stageIdx);
            }, 1000);
        }
    }

    tick(SOCKET_LIST) {
        this.play_time++;
        if (this.play_time >= 40) {
            this.play_time = 0;
            this.second++;
            if(this.timeLimit && !this.isGameOver) {
                SOCKET_LIST[this.player_list[1]].emit('limitTime', 60 - this.second);
                if(this.second == 60){
                    this.gameOver();
                }
            }
        }
        return this.second;
    }

    setStage(index) {
        this.stage = index;
    }

    gameOver() {
        console.log('This game is over!!');
        this.isGameOver = true;
    }

    refresh() {
        this.play_time = 0;
        this.second = 0;
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