'use strict'

const Obj = require ('../server/obj.js');

class Player extends Obj
{
    constructor()
    {
        super(400, 300);

        this.state = "IDLE_RIGHT";
        this.motion = 0;
        this.spd = 5;
        this.restrict = "You!!";

        this.pressRight = false;
        this.pressLeft = false;
        this.pressUp = false;
        this.pressDown =false;
    }

    update()
    {
        // init state
        if (this.state != "JUMP")
        {
            if (this.state == "WALK_LEFT")
                this.state = "IDLE_LEFT";
            if (this.state == "WALK_RIGHT")
                this.state = "IDLE_RIGHT";
        }

        // move player
        if (this.pressLeft)
        {
            this.x -= this.spd;
            this.state = "WALK_LEFT";
        }
        if (this.pressRight)
        {
            this.x += this.spd;
            this.state = "WALK_RIGHT";
        }

        // set motion
        if (this.state == "IDLE_LEFT" || this.state == "IDLE_RIGHT")
            this.motion = 0;
        else if (this.state == "WALK_LEFT" || this.state == "WALK_RIGHT"){
            this.motion += 0.34;
            this.motion %= 7;
        }
    }

    static updateList(list)
    {
        var pack = [];

        for (var i in list) {
            list[i].update();

            pack.push({
                // pack Player
                id: i,
                x: list[i].x,
                y: list[i].y,
                state: list[i].state,
                motion: list[i].motion,
                restrict: list[i].restrict
            });
        }

        return pack;
    }
};

module.exports = Player;