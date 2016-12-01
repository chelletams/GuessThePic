
var main = function (data)
{
    $('#next').on('click', function(){
        AnswerQuestionOne();
    });

};

$(document).ready(main);

function drawImage(image,xnumberOfTiles,ynumberOfTiles,arrayXTiles)
{
    var ctx = getContext();
    ctx.imageSmoothingEnabled = true;

    var img = new Image();   // Create new img element

    img.src = image; // Set source path

    var i=0,
        j=0;
    var sx=0, sy=0,sWidth/*=img.width/(xnumberOfTiles) */, sHeight/*=img.height/(ynumberOfTiles)*/,
    dx=0,dy=0, dWidth=canvas.width/xnumberOfTiles, dHeight=canvas.height/ynumberOfTiles;

    img.onload = function()
    {
        sWidth=img.width/(xnumberOfTiles);
        sHeight=img.height/(ynumberOfTiles);
        i = Math.floor(Math.random() * arrayXTiles.length);
        j = Math.floor(Math.random() * ynumberOfTiles);
        ctx.drawImage(
                        img,
                        arrayXTiles[i]*(sx+sWidth),
                        j*(sy+sHeight),
                        sWidth,
                        sHeight,
                        arrayXTiles[i]* (dx+dWidth),
                        j * (dy+dHeight),
                        dWidth,
                        dHeight
                    );

        arrayXTiles.splice(i,1);
    };
}

function clearTimer(interval)
{
        clearInterval(interval);
}

var Setup = function(img, callback)
{

    var counter=15; /*seconds*/
    var refreshRate=5; /*tiles per seconds*/
    var images= img;
    var imageIndex=0;
    var xnumberOfTiles=15;
    var ynumberOfTiles=3,
    interval,
    arrayXTiles=[];

    var i=0,j=0;
    for(i =0; i < xnumberOfTiles*refreshRate;i++)
    {
        arrayXTiles.push(i % xnumberOfTiles);
    }
    var timer=counter*refreshRate;

    interval = setInterval(function()
    {
        if(timer===0)
        {
            callback(interval);
        }
        $('body p').remove();
        $('body').prepend('<p>time left:'+Math.floor(timer / refreshRate)+' seconds  </p>');
        timer--;
        drawImage(images,xnumberOfTiles,ynumberOfTiles,arrayXTiles);

    },1000/refreshRate);

};



//ajax when answer the question
function AnswerQuestionOne(){
  'use strict';
  var jsonStr = JSON.stringify({
                  'catagory': 'CITY'});
  console.log(jsonStr);
  $.ajax({
          type: 'POST',
          data: jsonStr,
          dataType: 'json',
          contentType: 'application/json',
          url: 'http://localhost:3000/question',
          success: function(data)
          {
              clearCanvas();
              Setup(data.pic,clearTimer);
          }
  });
}//end AnswerQuestion

function clearCanvas()
{
    var ctx =getContext();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function getContext()
{
    var canvas = $('#canvas').get(0);
    var ctx = canvas.getContext("2d");

    return ctx;
}
