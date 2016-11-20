var main = function ()
{
    var counter=15; /*seconds*/
    var refreshRate=1; /*seconds*/
    var images=['img/cat.jpg','img/Bob.png','img/placeholder.png'];
    var imageIndex=0;
    var xnumberOfTiles=5;
    var ynumberOfTiles=3;

    var timer=counter;

    setInterval(function()
    {
        if(timer < 0)
        {
            timer=counter;
            imageIndex++;
            imageIndex= imageIndex%images.length;
            clearCanvas();
        }
        $('body p').remove();
        $('body').prepend('<p>time left:'+timer+' seconds  </p>');
        timer--;
        drawImage(images[imageIndex],xnumberOfTiles,ynumberOfTiles,refreshRate);

    },1000);

};

$(document).ready(main);

function drawImage(image,xnumberOfTiles,ynumberOfTiles,refreshRate)
{
    var delay=refreshRate*1000;
    var canvas= $('#canvas').get(0);
    var ctx = canvas.getContext("2d");

    var img = new Image();   // Create new img element

    img.src = image; // Set source path
    var i=0,
        j=0,
        xnumOfTiles=xnumberOfTiles,
        ynumOfTiles=ynumberOfTiles;
    var sx=0, sy=0, sWidth=img.width/(xnumOfTiles) ,sHeight=img.height/(ynumOfTiles),
    dx=0,dy=0,dWidth=canvas.width/xnumOfTiles,dHeight=canvas.height/ynumOfTiles;

    img.onload = function()
    {

        i = Math.floor(Math.random()*xnumOfTiles);
        j = Math.floor(Math.random()*ynumOfTiles);
        ctx.drawImage(img,i*(sx+sWidth), j*(sy+sHeight), sWidth, sHeight, i* (dx+dWidth), j* (dy+dHeight), dWidth , dHeight);

    };
}

function clearCanvas()
{
    var canvas= $('#canvas').get(0);
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
