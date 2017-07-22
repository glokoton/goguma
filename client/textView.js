class TextView extends Obj
{
    constructor(text, x, y, size, color)
    {
        super(x, y);

        if(text == undefined) text = 'text';
        setText(text);

        if(size == undefined) size = '12px';
        if(color == undefined) color = '#000';
        setFont(size, color);
    }

    setText(text)
    {
        this.text = text;
    }

    setFont(size, color)
    {
        this.size = size;
        this.color = color;
    }

    print(context)
    {
        context.font = size + ' ' + color + ' ' + 'serif';
        context.fillText(this.text, this.x, this.y);
    }
}