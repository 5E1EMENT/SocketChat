var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var express = require('express');

app.use(express.static(__dirname));

app.get('/dist', function(req, res){

    res.sendFile(__dirname + '/dist/index.html');
});


io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});