
var main = function ()
{
    var counter=10; /*seconds*/
    var refreshRate=5; /*tiles per seconds*/
    var images=['./cat.jpg','./placeholder.png','./Bob.png'];
    var imageIndex=0;
    var xnumberOfTiles=20;
    var ynumberOfTiles=3,
    arrayXTiles=[];

    var i=0,j=0;
    for(i =0; i < xnumberOfTiles*refreshRate;i++)
    {
        arrayXTiles.push(i%xnumberOfTiles);
    }

    var timer=counter*refreshRate;
    setInterval(function()
    {
        if(timer < 0)
        {
            timer=counter*refreshRate;
            imageIndex++;
            imageIndex= imageIndex%images.length;
            console.log(imageIndex);
            for(i =0; i < xnumberOfTiles*2;i++)
            {
                arrayXTiles.push(i % xnumberOfTiles);

            }
            clearCanvas();
        }


        $('body p').remove();
        $('body').prepend('<p>time left:'+timer+' seconds  </p>');
        timer--;
        drawImage(images[imageIndex],xnumberOfTiles,ynumberOfTiles,arrayXTiles);

    },1000/refreshRate);

};

$(document).ready(main);

function drawImage(image,xnumberOfTiles,ynumberOfTiles,arrayXTiles)
{
    var canvas= $('#canvas').get(0);
    var ctx = canvas.getContext("2d");


    var img = new Image();   // Create new img element

    img.src = image; // Set source path

    var i=0,
        j=0;
    var sx=0, sy=0, sWidth=img.width/(xnumberOfTiles) , sHeight=img.height/(ynumberOfTiles),
    dx=0,dy=0, dWidth=canvas.width/xnumberOfTiles, dHeight=canvas.height/ynumberOfTiles;

    img.onload = function()
    {
        i = Math.floor(Math.random() * arrayXTiles.length);
        j = Math.floor(Math.random() * ynumberOfTiles);
        console.log(arrayXTiles);
        console.log(i,j);

        ctx.drawImage(img,arrayXTiles[i]*(sx+sWidth), j*(sy+sHeight), sWidth, sHeight, arrayXTiles[i]* (dx+dWidth), j * (dy+dHeight), dWidth , dHeight);
        arrayXTiles.splice(i,1);

    };
}

function clearCanvas()
{
    var canvas= $('#canvas').get(0);
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

var Setup = function()
{

};
