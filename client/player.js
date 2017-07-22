class Player extends Obj
{
    constructor(x, y, restrict)
    {
		super(x, y);
        this.restrict = restrict; // 제한사항 내용
    }

    setScreen(scr)
    {
        scr.x = this.x - 400;
        scr.y = this.y - 300;
    }

    print(img, scr, context)
    {
        var w = 36, h = 48;
        //this.x -= scr.x;
        //this.y -= scr.y;

        context.drawImage(img.player, 0, 0, w, h, this.x - w/2, this.y - h/2, w, h);

        //this.x += scr.x;
        //this.y += scr.y;
    }
}