var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var clients = {};

app.use(express.static(__dirname));

app.get('/', function(req, res){

    res.sendFile(__dirname + '/index.html');
});


//Когда соединяемся с клиентом
io.on('connection', function(socket){



    //Передаем значение сообщения
    socket.on('chat message', function(msg){
        io.sockets.emit('chat message', msg);
        console.log(msg);
    });

    //При отключении пользователя, обновить результат
    socket.on('disconnect', function() {
        io.sockets.emit('eventClient',  {data: io.engine.clientsCount });
    });

    //Событие по клику на кнопку войти
    socket.on('eventSubmitClient', function (loginData,fio) {

        let AuthorizationData = loginData;

        //Если уже есть такой ник
        if(clients[AuthorizationData.nick]) {
            clients[AuthorizationData.nick].push(socket.client.id);
            clients[AuthorizationData.nick].push(fio);
        } else { //Если нет, то создаем пустой массив и пушим
            clients[AuthorizationData.nick] = [];
            clients[AuthorizationData.nick].push(socket.client.id);
            clients[AuthorizationData.nick].push(fio);
        }


        io.sockets.emit('clientsData',  {data: clients });

        console.log(clients);
    });




    var hs = socket.handshake;
    //console.log(clients,hs);
    //Передаем количество подключённых пользователей
    socket.on('eventServer', function (data) {
        io.sockets.emit('eventClient',  {data: io.engine.clientsCount,
            clients: hs});

    });

});



http.listen(3000, function(){
    console.log('listening on *:3000');
});