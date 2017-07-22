'use strict'

const Obj = require ('../server/obj.js');
const mapData = require('../server/mapdata/mapdata.json');

class Player extends Obj
{
    constructor()
    {
        super(400, 300);

        this.state = "IDLE";
        this.dir = "RIGHT";
        this.motion = 0;
        this.spd = 6;
        this.vy = 0;
        this.restrict = "You!!";

        this.pressRight = false;
        this.pressLeft = false;
        this.pressUp = false;
        this.pressDown =false;
        this.pressJump = false;
    }

    update()
    {
        // add gravity
        this.gravity();

        // init state
        if (this.state != "JUMP")
        {
            if (this.pressJump)
            {
                this.vy = -13;
                this.state = "JUMP";
            }
            else
                this.state = "IDLE";
        }

        // move player
        if (this.pressLeft)
        {
            this.x -= this.spd;
            this.state = "WALK";
            this.dir = "LEFT";
        }
        if (this.pressRight)
        {
            this.x += this.spd;
            this.state = "WALK";
            this.dir = "RIGHT";
        }

        // set motion
        if (this.state == "IDLE")
            this.motion = 0;
        else if (this.state == "WALK"){
            this.motion += 0.34;
            this.motion %= 7;
        }
    }

    gravity()
    {
        var fy = Math.floor( (this.y+24) / 30 );
        /* 1의 속도로 중력 가속 */
        if( this.vy < 20 ) this.vy += 1.5;
        /* y위치에 속력을 더한다. */
        this.y += this.vy;
    
        var x = Math.floor( (this.x+32) / 30 );
        var lx = Math.floor( (this.x+20) / 30 );
        var rx = Math.floor( (this.x+40) / 30 );
        var y = Math.floor( (this.y-24) / 30 );
    
        /* 천장에 닿을 때 */
        if( ( mapData.map[0][y+1][x] == 1 || mapData.map[0][y+1][lx] == 1 || mapData.map[0][y+1][rx] == 1 ) && this.vy < 0 ){
            this.y = y*30 + 48;
            this.vy = 0;
            return;
        }
    
        y = Math.floor( (this.y+24) / 30 );
        /* 바닥에 닿을 때 ( 바로 밑에 땅이 있다 && 떨어지고 있다 && 바닥을 통과하지 않았다 )*/
        if( ( mapData.map[0][y+1][x] != 0 || mapData.map[0][y+1][lx] != 0 || mapData.map[0][y+1][rx] != 0 ) && this.vy > 0 && this.y - this.vy <= y*30 - 24 ){
            this.y = y*30 - 24;
            this.vy = 0;
            if( this.state == "JUMP" ){
                this.state = "IDLE";
            }
        }
        else if( this.state != "DEAD" ){
            this.state = "JUMP";
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
                dir: list[i].dir,
                motion: list[i].motion,
                restrict: list[i].restrict
            });
        }

        return pack;
    }
};

module.exports = Player;