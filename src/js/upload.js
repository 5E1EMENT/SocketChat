let upload = document.querySelector('.upload');
let profile = document.getElementById("profile-img");
let dropzone = document.querySelector('.upload-area');
let title = document.querySelector('.upload-area__title');
let uploadButtonsWrapper = document.querySelector('.upload-btn__wrapper');
let uploadBtnCancel = document.querySelector('#uploadBtnCancel');
let uploadCloseBtn = document.querySelector('.close');
let fileElem = document.getElementById("fileElem");

profile.addEventListener('click', function () {
    if(profile.classList.contains('clickable')) {
        upload.style.display = 'flex';
    }

});

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, preventDefaults, false)
    document.body.addEventListener(eventName, preventDefaults, false)
});

    //Останавливаем всыплытие

function preventDefaults (e) {
    e.preventDefault()
    e.stopPropagation()
}

//Добавим индикатор для границы

function highlight(e) {
    dropzone.classList.add('highlight')
}
function unhighlight(e) {
    dropzone.classList.remove('highlight')
}

// Highlight drop area when item is dragged over it
['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, highlight, false)
});

['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, unhighlight, false)
});


//Вспомогательные функции
dropzone.addEventListener('drop', handleDrop, false);

function handleFiles(files) {
    files = [...files];
    files.forEach(uploadFile);
    files.forEach(previewFile);
}

function handleDrop(e) {
    let dt = e.dataTransfer;
    let files = dt.files;
    console.log("dt",dt,"files",files);
    handleFiles(files);

}

//Функция загрузки файла
function uploadFile(file) {


        var url = 'http://localhost:3000/';
        var xhr = new XMLHttpRequest();
        var formData = new FormData();
        xhr.open('POST', url, true);
        xhr.addEventListener('readystatechange', function(e) {
            console.log(xhr.status);
            if (xhr.readyState == 4 && xhr.status == 200) {
                // Готово. Информируем пользователя
                console.log("загрузилось")
            }
            else if (xhr.readyState == 4 && xhr.status != 200) {
                // Ошибка. Информируем пользователя
                console.log("Не загрузилось")
            }
        });

        formData.append('file', file);
        xhr.send(formData);


}
fileElem.addEventListener('change', function () {
    console.log(this.files.value);
    handleFiles(this.files)
})

//Предпросмотр
function previewFile(file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function() {
        let img = document.createElement('img');
        img.classList.add('perloaded-img');
        img.src = reader.result;
        img.style.width = "15rem";
        img.style.height = "15rem";
        upload.style.height = "22rem";
        upload.style.width = "22rem";
        dropzone.appendChild(img);
        title.style.display = 'none';
        uploadButtonsWrapper.style.display = 'block';

    }

}
//Удаляем фоточку
uploadBtnCancel.addEventListener('click', function () {
    if(document.querySelector('.perloaded-img')) {
        document.querySelector('.perloaded-img').remove();
    }
    fileElem.value = '';
    title.style.display = 'block';
}, false)

uploadCloseBtn.addEventListener('click', function () {
    if(document.querySelector('.perloaded-img')) {
        document.querySelector('.perloaded-img').remove();
    }
    fileElem.value = '';
    upload.style.display = 'none';
    title.style.display = 'block';

}, false)