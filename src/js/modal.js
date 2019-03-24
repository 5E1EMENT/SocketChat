let fio = document.querySelector('.form-input__fio');
let nick = document.querySelector('.form-input__nickname');
let enter = document.querySelector('.form-input__btn');
let modal = document.querySelector('#modal-authorization');
let submitbtn = document.querySelector('.submit');
let profileName = document.querySelector('.profile-name');
let profileImg = document.getElementById('profile-img');
let contacts = document.querySelector('#contacts ul');
let participants = document.querySelector('#participants h3');
let messages = document.querySelector('.messages-list');


const template = document.querySelector('#users').textContent;
const render = Handlebars.compile(template);

var users = {};

import {socket, validate} from './functions'

enter.addEventListener('click', function (e) {
    e.preventDefault();
    let fioValue =  fio.value.trim();
    let nickValue = nick.value.trim();

    if(validate(fio,nick)) {

        //Отправляем на сервер с событием eventSubmitClient данные
        socket.emit('eventSubmitClient', nickValue, fioValue);
console.log(nickValue, fioValue);
        //Убираем модалку
        modal.style.display = 'none';

        //Убираем неактивность кнопки
        submitbtn.removeAttribute("disabled");

        //В ответ получаем данные о всех участниках
        socket.on('clientsData', function (data) {

            let dataClients = data.data; // Массив с данными

            console.log(dataClients);

            global.yourid = data.yourid;
             //Массив со значениями участников
            let ClientData = Object.values(dataClients);

            // console.log("Данные о участниках",ClientData);

            //Данные о участниках(номер - имя)
            let participants = Object.values(ClientData);//

            // console.log(" participant",participants);

            //Перебираем каждое значение об участнике
            for (let participant of participants) {

                //Ключ
                let participantKey = Object.keys(participant);

                // console.log("participantKey",participantKey);

                for(let participantValue in participant) {
                    //Данные о пользователе(имя)
                    let user = {
                        username: participant[participantValue]
                    }

                    if(users[participantKey]) {
                        users[participantKey].push(user);
                    } else {
                        users[participantKey] = [];
                        users[participantKey].push(user);
                    }

                    //console.log(users[participantKey]);
                    console.log("Вот",users)
                    const htmlUsers = render(users[participantKey]);//Берем данные из массива
                    contacts.innerHTML = htmlUsers;//Запихиваем в html

                }

            }

        });

        //Выводим имя
        profileName.textContent = fioValue;

        //Отображаем количество участников
        participants.style.display = "block";

        //Отображаем комментарии
        messages.style.display = "block";

        //Даем возможность клика
        profileImg.classList.remove('unclickable');
        profileImg.classList.add('clickable');

        //Подсвечиваем статус
        profileImg.classList.remove('offline');
        profileImg.classList.add('online');
    }



});


// let xhr = new XMLHttpRequest();
// xhr.open('POST', 'http://localhost:3000/');
// xhr.setRequestHeader('Content-Type', 'application/json');
// let parseData = JSON.stringify({fio:fioValue,nick:nickValue });
// console.log(parseData);
// xhr.send(parseData);
//
// xhr.onreadystatechange = function() {
//     if (this.readyState != 4) return;
//
//     // по окончании запроса доступны:
//     // status, statusText
//     // responseText, responseXML (при content-type: text/xml)
//
//     if (this.status != 200) {
//         // обработать ошибку
//         alert( 'ошибка: ' + (this.status ? this.statusText : 'запрос не удался') );
//         return;
//     }
//
//     // получить результат из this.responseText или this.responseXML
// }