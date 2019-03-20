var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');


app.use(express.static(__dirname));

app.get('/', function(req, res){

    res.sendFile(__dirname + '/index.html');
});


//Когда соединяемся с клиентом
io.on('connection', function(socket){


    //Передаем количество подключённых пользователей
    socket.on('eventServer', function (data) {
        io.sockets.emit('eventClient',  {data: io.engine.clientsCount });

    });

    //Передаем значение сообщения
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });

    socket.on('disconnect', function() {
        io.sockets.emit('eventClient',  {data: io.engine.clientsCount });
    });
});


http.listen(3000, function(){
    console.log('listening on *:3000');
});