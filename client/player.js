class Player extends Obj
{
    constructor(x, y, state, dir, motion, restrict)
    {
		super(x, y);
		this.state = state;
		this.dir = dir;
		this.motion = motion;
        this.restrict = restrict; // ���ѻ��� ����
    }

    setScreen(scr, mapSize)
    {
        // if(this.x < 400){
        //     scr.x = 0;
        // }else if(this.x > mapSize.width - 420){
        //     scr.x = mapSize.width - 820;
        // }else{
        //     scr.x = this.x - 400;
        // }

        // if(this.y < mapSize.height / 2 ){
        //     scr.y = mapSize.height / 10;
        // }else if(this.y > mapSize.height - 750){
        //     scr.y = mapSize.height - 750;
        // }else{
        //     scr.y = this.y - 300;
        // }

        if(mapSize.width <= 800){
            scr.x = 0;
        }
        else if(this.x >= 400 && this.x <= mapSize.width - 420){
            scr.x = this.x - 400;
        }
        if(mapSize.height <= 700){
            scr.y = 0;
        }else if(this.y >= 400 && this.y <= mapSize.height - 320){
            scr.y = this.y - 300;
        }
    }

    print(img, scr, context)
    {
        /* save canvas */
        context.save();

        var w = 32, h = 48;
        var x = this.x - w/2 - scr.x;
        var y = this.y - h/2 - scr.y;
        var m = Math.floor(this.motion);

        /* if direction is left, reverse the canvas */
        if (this.dir == "LEFT"){
            context.scale( -1, 1 );
            x *= -1;
            x -= 32;
        }

        context.drawImage(img.player, m*w, 0, w, h, x, y, w, h);

        /* restore canvas */
        context.restore();
    }
}