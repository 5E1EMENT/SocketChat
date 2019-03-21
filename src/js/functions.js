//Обьявляем сокет
var socket = io('http://localhost:3000');



//Функция отправки сообщения по клику
function clickSubmit(e) {
    let input = document.querySelector('.chat-input');
    let val = input.value;

    //Проверка на ввод символов
    if (val.length <= 0) {
        return false;
    }

    socket.emit('chat message',val);
    input.value = '';
    return false;
}
//Функция отправки сообщения по кнопке
function btnSubmit(e) {

    if(e.keyCode === 13) {
        clickSubmit();

    }

}

//Функция валидции модалки
function validate(fio,nick) {

    let fioValue =  fio.value.trim();
    let nickValue = nick.value.trim();

    //Если есть пустные значения и цифры в тех полях, где их не должно быть
    if(fioValue == '' || nickValue == '' || fioValue.match(/\d+/g) || nickValue.match(/\d+/g)) {

        //Если имя пустое или содержит цифры
        if(fioValue == '' ) {
            fio.style.borderColor = 'red';
        } else if(fioValue.match(/\d+/g)) {
            fio.value = '';
            fio.style.borderColor = 'red';
            fio.placeholder = 'Введите правильное значение';
        } else {
            fio.style.borderColor = 'initial';
        }


        //Если место пустое или содержит цифры
        if(nickValue == '') {
            nick.style.borderColor = 'red';
            nick.placeholder = 'Введите ваш ник';
        } else if(nickValue.match(/\d+/g)) {
            nick.value = '';
            nick.style.borderColor = 'red';
            nick.placeholder = 'Введите правильное значение';
        } else {
            nick.style.borderColor = 'initial';
        };

        return false;
    } else {
        fio.value = '';
        nick.value = '';

        nick.style.borderColor = 'initial';
        fio.style.borderColor = 'initial';

        fio.placeholder = 'ФИО';
        nick.placeholder = 'Ник';
        return true;
    }
}

export {clickSubmit, btnSubmit,validate,socket}