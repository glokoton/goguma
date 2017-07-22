class Building
{
    static print(img, scr, context)
    {
        context.drawImage( img.building, scr.x/5 + 900, 0, 800, 600, 0, 240 - scr.y * 0.15, 800, 600 );
    }
}