class Room {
    constructor() {
        this.player_list = [];
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
    }

    disconn(id) {
        if (this.state === 'wait') {
            if (this.player_list[0] === id) this.player_list.splice(0, 1);
            else this.player_list.splice(1, 1);
        } else if (this.state === 'start') {
            // 후에 작성
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
};

module.exports = Room;