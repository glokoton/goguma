var STAR_LIST = {};

class Star extends Obj
{
    constructor(x, y, scale)
    {
		super(x, y);
		this.scale = scale;
    }

    static print(scr, context)
    {
        var w = mapData.getSize().width;
        var h = mapData.getSize().height;

        context.fillStyle = "rgb(255,255,255)";
        for (var i in STAR_LIST)
        {   
            var s = STAR_LIST[i];
            var x = s.x - scr.x/((1-s.scale)*15+10);
            var y = s.y - scr.y/((1-s.scale)*15+10);
            x = ((x%w)+w)%w;
            y = ((y%h)+h)%h;
            context.beginPath();
            context.arc( x, y, s.scale, 0, Math.PI*2, false);
            context.closePath();
            context.fill();
        }
    }

    static addStar()
    {
        var w = mapData.getSize().width;
        var h = mapData.getSize().height;
        STAR_LIST[Math.random()] = new Star(Math.random()*w, 
                                            Math.random()*h, Math.random()*1);
    }
}