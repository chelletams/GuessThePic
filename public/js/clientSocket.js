var socket = io.connect('http://localhost:8080');

/*********************************************************
* send request to socket server
* path - socket path
* data - json format
*********************************************************/
var socketSend = function(path, data) {
    //send to socket with data
    if(data) {
        socket.emit(path, data);
    }

    //send only path
    else {
        socket.emit(path);
    }
    
};

var main = function() {

    /*********************************************************
    * received new list of users
    * data - [{userId: <id>, username: <name>, life: 3}, <more users name>]
    *********************************************************/
    socket.on('get users', function(data) {
        console.log(data);
    });

    /*********************************************************
    * received new question image and answer id
    * data - {picture: <url>, answerId: <id>}
    *********************************************************/
    socket.on('get question', function(data) {
        console.log(data);
    });

    /*********************************************************
    * check user answer is right or wrong
    * data - {result: <true or false>}
    *********************************************************/
    socket.on('check answer', function(data) {
        console.log(data);
    });

    /*********************************************************
    * check user answer is right or wrong
    * data - {result: <true or false>}
    *********************************************************/
    socket.on('update score', function(data){
        console.log(data);
    });
    
};

$(document).ready(main);