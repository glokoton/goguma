class MapData
{
    constructor(map)
    {
        this.map = map;
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
			    
                var tileType = this.map[0][i][j] - 1;
                context.drawImage( img.tile, tileType*30, 0, 30, 30, (j-1)*30-scr.x, (i-1)*30-scr.y, 30, 30 );
            }
        }
    }
}