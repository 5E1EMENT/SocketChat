var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var clients = {};
var clientsLogin = {};

app.use(express.static(__dirname));

app.get('/', function(req, res){

    res.sendFile(__dirname + '/index.html');
});


//Когда соединяемся с чатом
io.on('connection', function(socket){

    //Передаем значение сообщения
    socket.on('chat message', function(msg){

        //Передаем сообщение и имя того, кто отправляет
        io.sockets.emit('chat message', msg,clients[socket.client.id],clientsLogin[socket.client.id]);
        console.log(msg,clients[socket.client.id]);
    });

    //При отключении пользователя, обновить результат
    socket.on('disconnect', function() {
        io.sockets.emit('eventClient',  {data: io.engine.clientsCount });
        console.log("То, что удаляем",clients[socket.client.id]);
        delete clients[socket.client.id];
        console.log(clients);
        io.sockets.emit('clientsData',  {data: clients });
    });

    //Событие по клику на кнопку войти
    socket.on('eventSubmitClient', function (loginData,fio) {

        let AuthorizationData = loginData;

        //Если уже есть такой номер
        if(clients[socket.client.id]) {
            clients[socket.client.id]= fio;
        } else { //Если нет, то создаем пустой массив и пушим
            clients[socket.client.id] = [];
            clients[socket.client.id] = fio;
        }

        if(clientsLogin[socket.client.id]) {
            clientsLogin[socket.client.id]= AuthorizationData;
        } else { //Если нет, то создаем пустой массив и пушим
            clientsLogin[socket.client.id] = [];
            clientsLogin[socket.client.id] = AuthorizationData;
        }
        console.log("logins",clientsLogin);

        io.sockets.emit('clientsData',  {data: clients });


        //console.log(clients);
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