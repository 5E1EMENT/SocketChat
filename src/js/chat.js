
import {clickSubmit,btnSubmit, socket } from "./functions";
window.onload = function() {

    let form = document.querySelector('.chat-form');
    let messages = document.querySelector('.messages-list');
    let submitbtn = document.querySelector('.submit');
    let participants = document.querySelector('.participants-number');
    let chatInput = document.querySelector('.chat-input');

    //Через Handlebars выводим все данные из data
    const template = document.querySelector('#comments').textContent;
    const render = Handlebars.compile(template);
    const body = document.body;

    //Массив с комментариями
    let dataComments = {};


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


    socket.on('chat message', function(msg,clients){



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
                "time": finalDateComment
            }
            // console.log(dataComments[finalDate]);
            if (dataComments[dateComment]) {

                dataComments[dateComment].push(comment);
            } else { //Если нет, то создаем пустой массив и пушим
                dataComments[dateComment] = [];
                dataComments[dateComment].push(comment);
            }
            for (var key in dataComments) {
                console.log(key);
                const htmlComments = render(dataComments[key]);//Берем данные из массива
                messages.innerHTML = htmlComments;//Запихиваем в html


            }

        chatInput.focus();

    });
}
