class MapData
{
    constructor(map)
    {
        this.map = map;
        /*
        this.map = new Array();
        this.map[0] = new Array();
        for (var i = 0; i <= height; i++){
            this.map[0][i] = new Array();
            for (var j = 0; j <= width; j++){
                this.map[0][i][j] = new Array();
            }
        }*/
    }

    print(img, scr, context)
    {
        var i, j;
        var si = Math.round( (scr.y+300) / 30 ) - 10;
        var sj = Math.round( (scr.x+400) / 30 ) - 14;

        for (i = si; i <= si + 16 + 4; i++)
        {
            if (i < 0 || i >= this.map[0].length) continue;
            for (j = sj; j <= sj + 24 + 4; j++)
            {
                if(j < 1 || j >= this.map[0][i].length) continue;
			
                switch (this.map[0][i][j])
                {
                    case 1:
                        context.drawImage( img.tile, 0, 0, 30, 30, (j-1)*30-scr.x, (i-1)*30-scr.y, 30, 30 );
                        break;
                    case 2:
                        context.drawImage( img.tile, 30, 0, 30, 30, (j-1)*30-scr.x, (i-1)*30-scr.y, 30, 30 );
                        break;
                }
            }
        }
    }
}