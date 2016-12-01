/* jshint browser: true, jquery: true, camelcase: true, indent: 2, undef: true, quotmark: single, maxlen: 80, trailing: true, curly: true, eqeqeq: true, forin: true, immed: true, latedef: true, newcap: true, nonew: true, unused: true, strict: true */

var WaitClick;
var AddQuestionFunction;
var AnswerQuestionOne;
var GetScore;
var GetQuestionNew;
var SubmitItem;
//function that always listening test
$(function(){
  'use strict';

  WaitClick();
  AnswerQuestionOne();
  GetScore();
});//big loop

function WaitClick(){
$('#addBut').on('click', function(){
    SubmitItem();
  });
$('#addScoreBut').on('click', function(){
    SubmitScore();
  });
}

function updateScore(allScore, scoreLenght){
  'use strict';
  console.log("updateScore");
  var i;
  $('#scoreIn').empty();
  for(i = 0; i < scoreLenght; i++){
    //console.log(allScore[i]);
    $('#scoreIn').append(
      "<div> User: " + allScore[i].UserName + " - Score: " + allScore[i].UserScore + "</div>"
    );//end append
  }//end for
}//end updateScore

function SubmitScore(){
  'use strict';
  console.log('submiting Item');
  var newUser = document.getElementsByName('addUserName-holder')[0].value;
  var newScore = document.getElementsByName('addScore-holder')[0].value;
  console.log(newUser + newScore);
  var jsonPass = JSON.stringify({'userName': newUser,
                  'score': newScore});
  $.ajax({
          type: 'POST',
          data: jsonPass,
          dataType: 'json',
          contentType: 'application/json',
          url: 'http://localhost:3000/scoreUpdate',
          success: function(data){
              console.log(data);
          }
  });
  console.log('Clear-- score');
}

function SubmitItem(){
  'use strict';
  console.log('submiting Item');
  var newCat = document.getElementsByName('addCat-holder')[0].value;
  var newName = document.getElementsByName('addName-holder')[0].value;
  var newURL = document.getElementsByName('addUrl-holder')[0].value;
  console.log(newCat + newName + newURL);
  var jsonPass = JSON.stringify({'catagory': newCat.toUpperCase(),
                  'nameItem': newName.toUpperCase(),
                  'picUrl' : newURL});
  $.ajax({
          type: 'POST',
          data: jsonPass,
          dataType: 'json',
          contentType: 'application/json',
          url: 'http://localhost:3000/addInfo',
          success: function(data){
              console.log(data);
              //$('#newCat').val('');
              //$('#newName').val('');
              //$('#newUrl').val('');
          }
  });
  console.log('Clear--');
  document.getElementsByName('addCat-holder').value ='';
  document.getElementsByName('addName-holder').value ='';
  document.getElementsByName('addUrl-holder').value ='';
}

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
          success: function(data){
            console.log(data);
            $("#picIn").empty();
            $("#picIn").attr("src", data.pic);
            $("#namePlace").empty();
            $("#namePlace").append(data.answer);
          }
  });
}//end AnswerQuestion

//ajax when the score need update
function GetScore(){
  'use strict';
  console.log('retieve score');
  $.ajax({
          type: 'GET',
          dataType: 'json',
          contentType: 'application/json',
          url: 'http://localhost:3000/score',
          success: function(data){
            console.log(data);
            updateScore(data.scoreSort, data.scoreLenght);
            console.log('Clear-- score');
          }
  });
}//end GetScore
