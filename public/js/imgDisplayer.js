
var main = function (data)
{
    $('#next').on('click', function(){
        AnswerQuestionOne();
    });

};

$(document).ready(main);

function drawImage(image,xnumberOfTiles,ynumberOfTiles,array)
{
    var ctx = getContext();
    ctx.imageSmoothingEnabled = true;

    var img = new Image();   // Create new img element

    img.src = image; // Set source path

    var randomIndex= 0,
        xpoint=0,
        ypoint=0;

    var sx=0, sy=0,sWidth, sHeight,
    dx=0,dy=0, dWidth=canvas.width/xnumberOfTiles, dHeight=canvas.height/ynumberOfTiles;

    img.onload = function()
    {
        if(array.length > 0)
        {
            sWidth=img.width/(xnumberOfTiles);
            sHeight=img.height/(ynumberOfTiles);

            randomIndex = Math.floor(Math.random() * array.length);
            xpoint= array[randomIndex][0];
            ypoint = array[randomIndex][1];
            ctx.drawImage(
                            img,
                            xpoint *(sx+sWidth),
                            ypoint  *(sy+sHeight),
                            sWidth,
                            sHeight,
                            xpoint * (dx+dWidth),
                            ypoint * (dy+dHeight),
                            dWidth,
                            dHeight
                        );
            array.splice(randomIndex,1);
        }
    };
}

function clearTimer(interval)
{
        clearInterval(interval);
}

var Setup = function(img, callback)
{
    var counter=10; /*seconds*/
    var refreshRate=2; /*tiles per seconds*/
    var images= img;
    var imageIndex=0;
    var xnumberOfTiles=15;
    var ynumberOfTiles=5,
    interval,
    arrayYTiles=[];
    arrayXTiles=[];
    var array= twoDimAraray(xnumberOfTiles,ynumberOfTiles);


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
        drawImage(images,xnumberOfTiles,ynumberOfTiles,array );

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

var twoDimAraray = function (row,col)
{
    var twoDArray=[];
    var i=0,j=0;

    for(i =0; i < row; i++)
    {
        for (j = 0; j < col; j++)
        {
            twoDArray.push([i ,j]);
        }
    }
return twoDArray;
};
