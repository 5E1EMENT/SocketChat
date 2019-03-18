(function () {
    var socket = io('http://localhost:3000');
    let form = document.querySelector('.chat-form');
    let messages = document.querySelector('.messages-list');
    let submitbtn = document.querySelector('.submit');

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

    //По клику
    function clickSubmit(e) {
        let input = document.querySelector('.chat-input');
        socket.emit('chat message',input.value);
        input.value = '';
        return false;
    }
    //По кнопке
    function btnSubmit(e) {

        if(e.keyCode === 13) {
            clickSubmit();

        }

    }

    //Отправляем сообщение по нажатию Enter
    body.addEventListener('keyup',btnSubmit);

    //Отправляем сообщение по клиук
    submitbtn.addEventListener('click', clickSubmit);

    socket.on('chat message', function(msg){

        let comment = {
            "text": msg
        }
        console.log(dataComments[finalDate]);
        if(dataComments[finalDate]) {

            dataComments[finalDate].push(comment);
        } else { //Если нет, то создаем пустой массив и пушим
            dataComments[finalDate] = [];
            dataComments[finalDate].push(comment);
        }

        console.log(dataComments);

        const htmlComments = render(dataComments[finalDate]);//Берем данные из массива
        messages.innerHTML = htmlComments;//Запихиваем в html
    });

})();