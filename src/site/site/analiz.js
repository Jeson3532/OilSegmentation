// Обработчик загрузки фото для analiz.html
const uploadButton = document.getElementById('upload-btn');
const fileInput = document.getElementById('file-input');
const fileInfo = document.getElementById('file-info');
const uploadContainer = document.querySelector('.upload-container');
const resultsContainer = document.getElementById('results-container');
const originalImage = document.getElementById('original-image');
const maskImage = document.getElementById('mask-image');

if (uploadButton && fileInput && uploadContainer) {
    // Выбор файла через input
    fileInput.addEventListener('change', handleFileSelect);

    // Drag & drop функционал
    uploadContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadContainer.classList.add('dragover');
        uploadButton.classList.add('dragover');
    });

    uploadContainer.addEventListener('dragleave', (e) => {
        e.preventDefault();
        if (!uploadContainer.contains(e.relatedTarget)) {
            uploadContainer.classList.remove('dragover');
            uploadButton.classList.remove('dragover');
        }
    });

    uploadContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadContainer.classList.remove('dragover');
        uploadButton.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const dt = new DataTransfer();
            dt.items.add(files[0]);
            fileInput.files = dt.files;
            handleFileSelect({ target: fileInput });
        }
    });

    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            // Проверка размера файла
            if (file.size > 100 * 1024 * 1024) {
                fileInfo.innerHTML = `<span style="color: #FF0000;">Файл "${file.name}" превышает 100 MB</span>`;
                return;
            }
            
            // Проверка типа файла
            if (!file.type.startsWith('image/')) {
                fileInfo.innerHTML = `<span style="color: #FF0000;">Пожалуйста, выберите изображение</span>`;
                return;
            }
            
            fileInfo.innerHTML = `Выбран файл: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)<br>`;
            
            // Скрываем предыдущие результаты
            resultsContainer.style.display = 'none';
            
            // Преобразуем изображение в base64 и отправляем
            convertAndSendImage(file);
        }
    }

    function convertAndSendImage(file) {
        fileInfo.innerHTML += '<span style="color: #FFFF00;">Преобразование в base64...</span>';
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Показываем исходное изображение
            originalImage.src = e.target.result;
            
            // Получаем ArrayBuffer из файла
            file.arrayBuffer().then(buffer => {
                // Преобразуем ArrayBuffer в base64
                const base64String = arrayBufferToBase64(buffer);
                fileInfo.innerHTML += '<span style="color: #00FF00;"> ✓ Преобразовано</span><br>';
                
                // Отправка на сервер
                sendBase64ToServer(base64String, file.name);
            });
        };
        
        reader.onerror = function(error) {
            console.error('Ошибка преобразования:', error);
            fileInfo.innerHTML += '<br><span style="color: #FF0000;">✗ Ошибка преобразования</span>';
        };
        
        // Читаем файл как Data URL для отображения
        reader.readAsDataURL(file);
    }

    // Функция для преобразования ArrayBuffer в base64
    function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    // Функция для преобразования base64 в ArrayBuffer
    function base64ToArrayBuffer(base64) {
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    function sendBase64ToServer(base64String, fileName) {
        fileInfo.innerHTML += '<span style="color: #FFFF00;">Отправка на сервер...</span>';
        
        // Создаем JSON объект с base64 строкой
        const requestData = {
            image: base64String
        };
        
        // Отправляем на указанный URL
        fetch('http://77.73.233.58:7766/user/segmentImage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Ответ от сервера:', data);
            
            if (data.mask) {
                // Декодируем base64 маску в изображение
                const maskArrayBuffer = base64ToArrayBuffer(data.mask);
                const blob = new Blob([maskArrayBuffer], { type: 'image/png' });
                const maskUrl = URL.createObjectURL(blob);
                
                // Показываем маску
                maskImage.src = maskUrl;
                
                // Показываем контейнер с результатами
                resultsContainer.style.display = 'block';
                
                fileInfo.innerHTML += '<br><span style="color: #00FF00;">✓ Успешно обработано</span>';
            } else {
                throw new Error('Сервер не вернул маску');
            }
            
            // Очищаем input после успешной отправки
            fileInput.value = '';
        })
        .catch(error => {
            console.error('Ошибка загрузки:', error);
            fileInfo.innerHTML += '<br><span style="color: #FF0000;">✗ Ошибка: ' + error.message + '</span>';
            
            if (error.message.includes('Failed to fetch')) {
                fileInfo.innerHTML += '<br><span style="color: #FF0000;">Сервер недоступен</span>';
            }
        });
    }
}