/* jshint browser: true, jquery: true, camelcase: true, indent: 2, undef: true, quotmark: single, maxlen: 80, trailing: true, curly: true, eqeqeq: true, forin: true, immed: true, latedef: true, newcap: true, nonew: true, unused: true, strict: true */

var http = require('http'),
    express = require('express'),
    app = express(),
    server = http.createServer(app).listen(8080);
    io = require('socket.io').listen(server),
    request = require('request');

console.log('Socket listening on port 3001');

//initualize users and socket connections
var users =[],
    connections = [];

//option for http request
// para - json obj contain: (path, method, data)
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
    
    //listen for a new user to connect
    socket.on('new user', function(data) {
        socket.username = data;
        //push new user
        users.push(socket.username);
        //update new user has connected
        io.sockets.emit('get users', users);
    });

    //listen for client answer
    socket.on('answer', function(data) {
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
                //add user answer the question to body
                body.answerer = socket.username.username;

                //send the answer to user have send to server
                io.sockets.emit('check answer', body);
            }
        });
    });

    //listen for client to request score
    socket.on('score', function() {
        var jsonData;

        //send get request to server for user score
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
        //disconnect user
        users.splice(users.indexOf(socket.username),1);
        console.log('Disconnect socket: %s', socket.username);

        //update list of users on client side
        io.sockets.emit('get users', users);

        //disconnect socket
        connections.splice(connections.indexOf(socket), 1);
        console.log('Connected sockets: %s', connections.length);
    });
});
