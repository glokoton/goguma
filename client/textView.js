class TextView
{
    static print(restrictString, restTime, context)
    {
        context.fillStyle = "rgb(255,255,255)";
        context.font = "bold 24px helvetica";
        
        context.fillText(restrictString, 400 - restrictString.toString().length*6, 30);
        
        if(restrictString === "You have to goal in 30 seconds!" && restTime != undefined)
        {
            context.fillText(restTime.toString(), 400, 70);
        }
    }
}