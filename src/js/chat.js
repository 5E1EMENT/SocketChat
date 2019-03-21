
import {clickSubmit,btnSubmit, socket } from "./functions";
window.onload = function() {

    let form = document.querySelector('.chat-form');
    let messages = document.querySelector('.messages-list');
    let submitbtn = document.querySelector('.submit');
    let participants = document.querySelector('.participants-number');

    //Через Handlebars выводим все данные из data
    const template = document.querySelector('#comments').textContent;
    const render = Handlebars.compile(template);
    const body = document.body;

    //Массив с комментариями
    let dataComments = {};

    //Ключами будет дата
    var date = new Date();
    var dateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    };
    let finalDate = date.toLocaleString("ru", dateOptions);


    //Отправляем сообщение по нажатию Enter
    body.addEventListener('keyup',btnSubmit);

    //Отправляем сообщение по клику
    submitbtn.addEventListener('click', clickSubmit);

    socket.on('eventClient', function (data) {
        let count = data.data;
        let clients = data.clients;
        participants.innerHTML = count;

        //console.log(clients);
    });
    socket.emit('eventServer', { data: 'Hello Server' });


    socket.on('chat message', function(msg){

        let comment = {
            "text": msg
        }
        // console.log(dataComments[finalDate]);
        if(dataComments[finalDate]) {

            dataComments[finalDate].push(comment);
        } else { //Если нет, то создаем пустой массив и пушим
            dataComments[finalDate] = [];
            dataComments[finalDate].push(comment);
        }

        console.log("Тело коммента",dataComments[finalDate],"комменты",dataComments);
        const htmlComments = render(dataComments[finalDate]);//Берем данные из массива
        messages.innerHTML = htmlComments;//Запихиваем в html
    });
}
