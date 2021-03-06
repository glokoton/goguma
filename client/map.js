class MapData
{
    constructor(map, stage)
    {
        this.map = map;
        this.stage = stage;
    }

    getSize()
    {
        return {width: this.map[this.stage][0].length * 30, height: this.map[this.stage].length * 30};
    }

    print(img, scr, context)
    {
        var i, j;
        var si = Math.round( (scr.y+300) / 30 ) - 10;
        var sj = Math.round( (scr.x+400) / 30 ) - 14;

        for (i = si; i <= si + 16 + 4; i++)
        {
            if (i < 0 || i >= this.map[this.stage].length) continue;
            for (j = sj; j <= sj + 24 + 4; j++)
            {
                if(j < 1 || j >= this.map[this.stage][i].length) continue;
			    
                var tileType = this.map[this.stage][i][j] - 1;
                switch (tileType)
                {
                    case 0:
                        context.drawImage( img.tile, tileType*30, 0, 30, 30, (j-1)*30-scr.x, (i-1)*30-scr.y, 30, 30 );
                        break;
                    case 1:
                        context.drawImage( img.tile, tileType*30, 0, 30, 30, (j-1)*30-scr.x, (i-1)*30-scr.y, 30, 30 );
                        break;
                    case 2:
                        context.drawImage( img.tile, tileType*30, 0, 30, 30, (j-1)*30-scr.x, (i-1)*30-scr.y, 30, 30 );
                        break;
                    case 3:
                        context.drawImage( img.tile, tileType*30, 0, 30, 30, (j-1)*30-scr.x, (i-1)*30-scr.y, 30, 30 );
                        break;
                    case 8:
                        context.drawImage( img.tile, 4*30, 0, 30, 30, (j-1)*30-scr.x, (i-1)*30-scr.y, 30, 30 );
                        break;
                }
            }
        }
    }
}