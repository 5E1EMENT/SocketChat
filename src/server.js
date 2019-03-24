//Переменные
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cors = require('cors');
var upload = require("express-fileupload");
var clients = {};

//Модули
app.use(cors());
app.use(upload());


app.use(express.static(__dirname));

app.get('/', function(req, res){

    res.sendFile(__dirname + '/index.html');
});

//Функция загрузки фото
app.post("/", function (req, res) {
    let yourid = req.query.yourid;
    // console.log("ВОТ",req.query.yourid);
    if(req.files) {
        var filename = req.files.file.name;
        req.files.file.mv("./dist/assets/img/"+filename, function (err) {
            if(err) {
                console.log(err);
                res.send("error occured")
            } else {
                res.send("Done!")
                //Если уже есть такой номер
                if(clients[yourid]) {
                    clients[yourid].push(filename);
                } else { //Если нет, то создаем пустой массив и пушим
                    clients[yourid] = [];
                    clients[yourid].push(filename);
                }

                console.log("Клиенты",clients);
            }
        })


    }
})

//Когда соединяемся с чатом
io.on('connection', function(socket){

    //Передаем значение сообщения
    socket.on('chat message', function(msg){

        //Передаем сообщение и имя того, кто отправляет
        io.sockets.emit('chat message', msg,clients[socket.id]);
        console.log(msg,socket.id);
    });

    //При отключении пользователя, обновить результат
    socket.on('disconnect', function() {
        io.sockets.emit('eventClient',  {data: io.engine.clientsCount });
        console.log("То, что удаляем",clients[socket.id]);
        delete clients[socket.id];
        console.log(clients);
        io.sockets.emit('clientsData',  {data: clients });
    });

    //Событие по клику на кнопку войти
    socket.on('eventSubmitClient', function (loginData,fio) {

        //Если уже есть такой номер
        if(clients[socket.id]) {
            clients[socket.id]= [fio];
        } else { //Если нет, то создаем пустой массив и пушим
            clients[socket.id] = [];
            clients[socket.id] = [fio];
        }


        io.sockets.emit('clientsData',  {data: clients, yourid: socket.id});


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