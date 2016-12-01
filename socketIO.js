/* jshint browser: true, jquery: true, camelcase: true, indent: 2, undef: true, quotmark: single, maxlen: 80, trailing: true, curly: true, eqeqeq: true, forin: true, immed: true, latedef: true, newcap: true, nonew: true, unused: true, strict: true */

var http = require('http'),
    express = require('express'),
    app = express(),
    server = http.createServer(app).listen(8080);
    io = require('socket.io').listen(server),
    request = require('request');

console.log('Socket listening on port 8080');

//initualize users and socket connections
var users =[],
    connections = [],
    userId = 0;

/********************************************************
* request opton to send to server
* para data - {path: <path>, method: <GET or POST>, <data: <data>>}
* return the json format for the request to server
********************************************************/
var requestOption = function(para) {

    //default option
    var option = {
        uri: 'http://localhost:3000' + para.path,
        headers: {
            accept: 'application/json',
            'content-type': 'application/json'
        }
    };

    //create get request option
    if(para.method.toUpperCase() === 'GET') {
        option['method'] = 'GET';

    //post option
    } else if (para.method.toUpperCase() === 'POST'){
        //set default data from parameter
        var data = para.data !== '' ? para.data : '';

        option['method'] = 'POST';
        option['json'] = data;
    }

    return option;
};

//socket io connection
io.sockets.on('connection', function(socket){

	'use strict';

    //push client soocket in to connections list
    connections.push(socket);
    console.log('Connected sockets: %s', connections.length);

    /********************************************************
    * listen for a new user to connect
    * para data             - {username: <name>}
    * return all username   - [{userId: <id>, username: <name>, life: 3}, <more users name>]
    ********************************************************/
    socket.on('new user', function(data) {

        //increse userId by 1
        userId += 1;

        //add new username and userId to socket
        socket.username = data.username;
        socket.userId = userId;

        var user = {
            userId: userId,
            username: socket.username,
            life: 3
        }

        //push new username in to users array
        users.push(user);

        //update new user has connected
        io.sockets.emit('get users', users);
    });

    /********************************************************
    * listen for client to send request for picture question
    * para data             - {category: <title>}
    * return to all users   - {picture: <url>, answerId: <id>}
    ********************************************************/
    socket.on('question', function(data) {

        //send POST request to server to retreive question picture and answer id
        requestOption({
            path: '/question',
            method: 'POST',
            data: data
        }),
        //call back of the POST request
        function(err, res, body) {
            if(err) {
                console.log(err);
            } else {
                //send the answer to user have send to server
                io.sockets.emit('get question', body);
            }
        }
    });

    /********************************************************
    * listen for client answer
    * para data             - {answerId: <id>, answer: <answer>}
    * return to all users   - {result: <true or false>}
    ********************************************************/
    socket.on('answer', function(data) {

        //add username to data
        data.username = socket.username;

        console.log(JSON.stringify(data));

        //send post request to server for check answer
        request(
            requestOption({
                path: '/answer',
                method: 'POST',
                data: data
            }),
            function(err, res, body) {
            if(err) {
                console.log(err);
            } else {
                //send the answer to user have send to server
                io.sockets.emit('check answer', body);
            }
        });
    });

    /********************************************************
    * listen for client to request score
    * para                  - NONE
    * return to all users   - {score: [
    *                               {username: <name>, userScore: <score>}
    *                               <more users score>
    *                           ]}
    ********************************************************/
    socket.on('score', function() {
        var jsonData;

        //send get request to server for users score
        request(
            requestOption({
                path: '/score',
                method: 'GET'
            }),
            function(err, res, body) {
            if (err) {
                console.log(err);
            } else {
                //send update score to all users
                jsonData = JSON.parse(body);
                console.log(jsonData);
                console.log(jsonData.right);
                io.sockets.emit('update score', JSON.parse(body));
            }
        });
    });

    //disconnect
    socket.on('disconnect', function() {

        //loop each users
        users.some(function(value, index) {

            //check if userId match socket userId
            if(value.userId === socket.userId) {
                //remove username from users array
                users.splice(index,1);
                console.log('Disconnect socket: %s', socket.username);

                //break out of some loop (for loop)
                return true;
            }
        });

        //update list of users on client side
        io.sockets.emit('get users', users);

        //disconnect socket
        connections.splice(connections.indexOf(socket), 1);
        console.log('Connected sockets: %s', connections.length);
    });
});