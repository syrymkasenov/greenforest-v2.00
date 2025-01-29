// URL вашего API
const apiUrl = 'http://api.openweathermap.org/data/2.5/air_pollution?lat=49.9714&lon=82.6059&appid=485931c576bd9f9b501a900f5ccdc4bd';

// Отправка запроса к API
fetch(apiUrl)
    .then(response => {
        // Проверка статуса ответа
        if (!response.ok) {
            throw new Error('Ошибка при получении данных');
        }
        // Преобразование ответа в формат JSON
        return response.json();
    })
    .then(data => {
        // Обновление HTML элемента с полученными данными
        document.getElementById('jsonData').innerText = JSON.stringify(data, null, 2);
    })
    .catch(error => {
        console.error('Ошибка при получении данных:', error);
    });
