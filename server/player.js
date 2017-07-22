'use strict'

const Obj = require ('../server/obj.js');
const mapData = require('../server/mapdata/mapdata.json');
const restrictData = require('../server/mapdata/restrict.json');

class Player extends Obj
{
    constructor()
    {   
        super(0, 0);

        this.state = "IDLE";
        this.dir = "RIGHT";
        this.motion = 0;
        this.spd = 6;
        this.vy = 0;
        this.restrict = 1;
        this.stage = 0;

        this.pressRight = false;
        this.pressLeft = false;
        this.pressUp = false;
        this.pressDown =false;
        this.pressJump = false;

        this.cheat = false;
    }

    update()
    {
        // add gravity
        if (this.state != "CLIMB")
            this.gravity();

        // return when player is dead
        if (this.state == "DEAD") return;

        // init state
        if (this.state != "JUMP")
        {
            // jump
            if (this.pressJump && this.restrict != 1)
                this.jump();
            // init state
            else if(this.state != "CLIMB")
                this.state = "IDLE";
        }

        // move player up, down
        if (this.pressUp)
            this.moveUp();
        if (this.pressDown)
            this.moveDown();
        
        // move player left, right
        if (this.state != "CLIMB")
        {
            if (this.pressLeft)
                this.moveLeft();
            if (this.pressRight)
                this.moveRight();
        }

        // set motion
        if (this.state == "IDLE")
            this.motion = 0;
        else if (this.state == "WALK"){
            this.motion += 0.34;
            this.motion %= 8;
        }
    }

    gravity()
    {
        /* accelerate gravity */
        if( this.vy < 20 ) this.vy += 1.5;
        /* change y position */
        this.y += this.vy;
    
        var x = Math.floor( (this.x+32) / 30 );
        var lx = Math.floor( (this.x+20) / 30 );
        var rx = Math.floor( (this.x+40) / 30 );
        var y = Math.floor( (this.y-24) / 30 );
    
        /* when touch ceiling */
        if( (y + 1 > 0 && y + 1 < mapData.map[this.stage].length - 1) && (( mapData.map[this.stage][y+1][x] == 1 || mapData.map[this.stage][y+1][lx] == 1 || mapData.map[this.stage][y+1][rx] == 1 ) && this.vy < 0) ){
            this.y = y*30 + 48;
            this.vy = 0;
            return;
        }
    
        y = Math.floor( (this.y+24) / 30 );
        /* when touch floor */
        if( (y + 1 > 0 && y + 1 < mapData.map[this.stage].length - 1) &&
                ( ( ( mapData.map[this.stage][y+1][x] != 0 || mapData.map[this.stage][y+1][lx] != 0 || mapData.map[this.stage][y+1][rx] != 0) &&
                    ( mapData.map[this.stage][y+1][x] != 3 && mapData.map[this.stage][y+1][lx] != 3 && mapData.map[this.stage][y+1][rx] != 3) &&
                    ( mapData.map[this.stage][y+1][x] != 11 && mapData.map[this.stage][y+1][lx] != 11 && mapData.map[this.stage][y+1][rx] != 11) &&
                    ( mapData.map[this.stage][y+1][x] != 12 && mapData.map[this.stage][y+1][lx] != 12 && mapData.map[this.stage][y+1][rx] != 12) ) &&
                    this.vy > 0 && this.y - this.vy <= y*30 - 24 ) ){
            this.y = y*30 - 24;
            this.vy = 0;
            if (this.state == "JUMP")
                this.state = "IDLE";
        }
        else if (this.state != "DEAD")
            this.state = "JUMP";
    }

    jump()
    {
        this.vy = -13;
        this.state = "JUMP";
    }

    checkObstacle()
    {
        var x = Math.floor( (this.x+16) / 30 );
        var y = Math.floor( (this.y+48) / 30 );
        /* when touch obstacle */
        if ( (y + 1 > 0 && y + 1 < mapData.map[this.stage].length - 1) && (mapData.map[this.stage][y][x] == 1 || mapData.map[this.stage][y][x] == 1))
            this.x = x*30 + 12;
        if ( (y + 1 > 0 && y + 1 < mapData.map[this.stage].length - 1) && (mapData.map[this.stage][y][x+1] == 1 || mapData.map[this.stage][y-1][x+1] == 1))
            this.x = x*30 - 14;
    }

    moveLeft()
    {
        if(this.x - this.spd > 0 && this.x - this.spd < mapData.map[this.stage][0].length * 30 - 20)
        {
            this.x -= this.spd;
            if (this.state != "JUMP") this.state = "WALK";
        }
        this.checkObstacle();
        this.dir = "LEFT";
    }
    moveRight()
    {
        if(this.x + this.spd > 0 && this.x + this.spd < mapData.map[this.stage][0].length * 30 - 40)
        {
            this.x += this.spd;
            if (this.state != "JUMP") this.state = "WALK";
        }
        this.checkObstacle();
        this.dir = "RIGHT";
    }
    moveUp()
    {
        if (this.state == "JUMP") return;

        var x = Math.floor( (this.x+32) / 30 );
        var y = Math.floor( (this.y+21) / 30 );
        /* when touch ladder */
        if (mapData.map[this.stage][y+1][x] == 3 || mapData.map[this.stage][y+1][x] == 4)
        {
            this.vy = 0;
            this.y -= this.spd/2;
            this.motion += 0.2;
            this.motion %= 4;
            this.state = "CLIMB";
        }
        else if (this.state == "CLIMB")
            this.state = "IDLE";
    }
    moveDown()
    {
        if (this.state == "JUMP") return;

        var x = Math.floor( (this.x+32) / 30 );
        var y = Math.floor( (this.y+24) / 30 );
        /* when touch ladder */
        if (mapData.map[this.stage][y+1][x] == 3 || mapData.map[this.stage][y+1][x] == 4)
        {
            this.vy = 0;
            this.y += this.spd/2;
            this.motion += 0.2;
            this.motion %= 4;
            this.state = "CLIMB";
        }
        else if (this.state == "CLIMB")
            this.state = "IDLE";
    }

    isGoal()
    {
        var x = Math.floor( (this.x+32) / 30 );
        var y = Math.floor( (this.y+21) / 30 );

        /* when touch goal */
        if ( (y + 1 > 0 && y + 1 < mapData.map[this.stage].length - 1) && mapData.map[this.stage][y+1][x] == 9) return true;
        return false;
    }

    setPosition(id, stage)
    {
        this.stage = stage;
        /* set first position */
        this.state = "IDLE";
        this.dir = "RIGHT";
        var height = mapData.map[stage].length;
        var width = mapData.map[stage][0].length;
        for (var i = 0; i < height; i++)
        {
            for (var j = 0; j < width; j++)
            {
                if (mapData.map[stage][i][j] == 11 + id)
                {
                    this.x = j*30;
                    this.y = (i-1)*30;
                    return;
                }
            }
        }
    }

    getRestrict()
    {
        return restrictData.restrict[this.restrict];
    }

    setRestrict(id)
    {
        switch (this.stage)
        {
            case 0:
                this.restrict = (id == 0 ? 1 : 2);
                break;
            case 1:
                this.restrict = (id == 0 ? 2 : 1);
                break;
            case 2:
                this.restrict = (id == 0 ? 3 : 4);
                break;
            case 3:
                this.restrict = (id == 0 ? 4 : 3);
                break;
            case 4:
                this.restrict = (id == 0 ? 2 : 5);
                break;
            case 5:
                this.restrict = (id == 0 ? 5 : 2);
                break;
            case 6:
                this.restrict = (id == 0 ? 6 : 7);
                break;
            case 7:
                this.restrict = (id == 0 ? 7 : 6);
                break;
        }
    }

    static updateList(player, id)
    {
        var pack;

        player.update();

        pack = {
            id: id,
            x: player.x,
            y: player.y,
            state: player.state,
            dir: player.dir,
            motion: player.motion
        };

        return pack;
    }
};

module.exports = Player;