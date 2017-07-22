class Moon
{
    static print(img, scr, context)
    {
        context.drawImage(img.moon, 0, 0, 96, 96, 400 - scr.x/7, 120 - scr.y/7, 96, 96);
    }
}