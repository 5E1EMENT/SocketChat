
import {clickSubmit,btnSubmit, socket } from "./functions";
window.onload = function() {

    let form = document.querySelector('.chat-form');
    let messages = document.querySelector('.messages-list');
    let submitbtn = document.querySelector('.submit');
    let participants = document.querySelector('.participants-number');
    let chatInput = document.querySelector('.chat-input');
    let profileWrap = document.querySelector('.wrap');
    //Через Handlebars выводим все данные из data
    const template = document.querySelector('#comments').textContent;
    const render = Handlebars.compile(template);

    const template1 = document.querySelector('#user-img').textContent;
    const render1 = Handlebars.compile(template1);

    const body = document.body;

    //Массив с комментариями
    let dataComments = {};

    let date = new Date();
    let dateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    };
    let dateStart = date.toLocaleString("ru", dateOptions);


    //Отправляем сообщение по нажатию Enter
    body.addEventListener('keyup',btnSubmit);

    //Отправляем сообщение по клику
    submitbtn.addEventListener('click', clickSubmit);

    socket.on('eventClient', function (data) {
        let count = data.data;
        participants.innerHTML = count;

        //console.log(clients);
    });
    socket.emit('eventServer', { data: 'Hello Server' });


    socket.on('chat message', function(msg,name){

        let username = name[0];
        let image
        if(name[1] == undefined) {
            image = "./assets/img/no-photo.png";
        } else {
            image = "./assets/img/"+name[1];
        }


        let dateComment = new Date();
        let dateOptionsComment = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        };
        let finalDateComment = dateComment.toLocaleString("ru", dateOptionsComment);


        let comment = {
            "text": msg,
            "time": finalDateComment,
            "name": username,
            "img": image
        }
        if(comment.img == undefined) {
            comment.img = 'no-photo.png';
            console.log(comment.img);
        }
        //Ключём будет дата запуска чата
        if (dataComments[dateStart]) {
            dataComments[dateStart].push(comment);
        } else { //Если нет, то создаем пустой массив и пушим
            dataComments[dateStart] = [];
            dataComments[dateStart].push(comment);
        }
        for (var key in dataComments) {
            console.log(dataComments[key]);
            const htmlComments = render(dataComments[key]);//Берем данные из массива
            const htmlComments1 = render1(dataComments[key]);//Берем данные из массива
            messages.innerHTML = htmlComments;//Запихиваем в html
            profileWrap.innerHTML = htmlComments1;//Запихиваем в html


        }

        chatInput.focus();

    });
}
