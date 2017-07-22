class Player extends Obj
{
    constructor(x, y, state, motion, restrict)
    {
		super(x, y);
		this.state = state;
		this.motion = motion;
        this.restrict = restrict; // 제한사항 내용
    }

    setScreen(scr)
    {
        scr.x = this.x - 400;
        scr.y = this.y - 300;
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
        if (this.state == "IDLE_LEFT" || this.state == "WALK_LEFT"){
            context.scale( -1, 1 );
            x *= -1;
            x -= 32;
        }

        context.drawImage(img.player, m*w, 0, w, h, x, y, w, h);

        /* restore canvas */
        context.restore();
    }
}