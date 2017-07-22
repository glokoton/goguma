class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    update() {
        // player update
    }

    static updateList(list) {
        var pack = [];

        for (var i in list) {
            list[i].update();

            pack.push({
            // pack Player
                x: list[i].x,
                y: list[i].y,
            });
        }

        return pack;
    }
};

module.exports = Player;