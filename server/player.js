'use strict'

const Obj = require ('../server/obj.js');

class Player extends Obj
{
    constructor()
    {
        super(400, 300);

        this.spd = 5;
        this.restrict = "¥ÁΩ≈¿∫!!";

        this.pressRight = false;
        this.pressLeft = false;
        this.pressUp = false;
        this.pressDown =false;
    }

    update()
    {
        if (this.pressLeft)
        {
            this.x -= this.spd;
        }
        if (this.pressRight)
        {
            this.x += this.spd;
        }
    }

    static updateList(list)
    {
        var pack = [];

        for (var i in list) {
            list[i].update();

            pack.push({
            // pack Player
                x: list[i].x,
                y: list[i].y,
                restrict: list[i].restrict
            });
        }

        return pack;
    }
};

module.exports = Player;