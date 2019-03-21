let fio = document.querySelector('.form-input__fio');
let nick = document.querySelector('.form-input__nickname');
let enter = document.querySelector('.form-input__btn');
let modal = document.querySelector('#modal-authorization');
let submitbtn = document.querySelector('.submit');
let profileName = document.querySelector('.profile-name');
let contacts = document.querySelector('#contacts ul');


const template = document.querySelector('#users').textContent;
const render = Handlebars.compile(template);

var users = {};

import {socket, validate} from './functions'

enter.addEventListener('click', function (e) {
    e.preventDefault();
    let fioValue =  fio.value.trim();
    let nickValue = nick.value.trim();

    if(validate(fio,nick)) {
        console.log(fioValue,nickValue);
        //Данные формы
        let Data = {
            fio: fioValue,
            nick: nickValue
        }

        //Отправляем на сервер с событием eventSubmitClient данные
        socket.emit('eventSubmitClient', Data, fioValue);

        //Убираем модалку
        modal.style.display = 'none';

        //Убираем неактивность кнопки
        submitbtn.removeAttribute("disabled");

        //В ответ получаем данные о всех участниках
        socket.on('clientsData', function (data) {
            let dataClients = data;
            console.log("Данные",dataClients);


            for(let data in dataClients) {

                let clientsNames = dataClients[data];

                // console.log("Данные по клиентам",clientsNames);

                 for(let name in clientsNames) {
                     let user = {
                         "username": name
                     }

                     let clientsData = clientsNames[name];
                     let [clientNumber, clientName] = clientsData;
                     console.log("Номер",clientNumber,"Имя", clientName);

                     if(users[clientNumber]) {
                         users[clientNumber].push(user)
                     } else {
                         users[clientNumber] = [];
                         users[clientNumber].push(user)
                     }
                     const dataKeys = Object.keys(users);

                     dataKeys.forEach(function (key) {
                         console.log("Юзерс",users,"Юзерскей",users[key]);
                         const htmlUsers = render(users[key]);//Берем данные из массива
                         contacts.innerHTML = htmlUsers;//Запихиваем в html
                     })




                 }


            }
        });

        //Выводим имя
        profileName.textContent = fioValue;

        // const htmlComments = render(dataComments[finalDate]);//Берем данные из массива
        // messages.innerHTML = htmlComments;//Запихиваем в html
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