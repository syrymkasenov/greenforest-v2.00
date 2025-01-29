document.addEventListener('DOMContentLoaded', function() {
    selectCity('Усть-Каменогорск'); // Установка города по умолчанию при загрузке страницы
});

function selectCity(cityName) {
    document.getElementById('city-name').innerText = cityName; // Отображение имени города
    const cityData = {
        "Алматы": { lat: 43.2220, lon: 76.8512 },
        "Усть-Каменогорск": { lat: 49.9639, lon: 82.6094 },
        "Караганда": { lat: 49.8139, lon: 73.0951 },
        "Астана": { lat: 51.1694, lon: 71.4491 },
        "Шымкент": { lat: 42.3176, lon: 69.5918 },
        "Актау": { lat: 43.6561, lon: 51.1684 },
        "Атырау": { lat: 47.1164, lon: 51.8839 },
        "Актобе": { lat: 50.2797, lon: 57.2072 },
        "Семей": { lat: 50.4196, lon: 80.2454 },
        "Павлодар": { lat: 52.2871, lon: 76.9533 },
        "Кызылорда": { lat: 44.8528, lon: 65.5094 },
        "Тараз": { lat: 42.9016, lon: 71.3645 }
    };

    const apiKey = 'c1e407c40bd2a65d0950e32ca6dcd251'; // Общий API ключ
    if (cityData[cityName]) {
        const { lat, lon } = cityData[cityName];
        const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.list && data.list.length > 0) {
                    const aqi = calculateAQI(data.list[0].components.pm2_5);
                    document.getElementById('aqi').innerText = `AQI: ${aqi}`;
                    resizeImages(aqi);
                    setRecommendation(aqi);
                } else {
                    console.error('Данные отсутствуют');
                }
            })
            .catch(error => console.error('Ошибка при получении данных:', error));
    } else {
        console.error('Некорректное имя города:', cityName);
    }
}

function calculateAQI(C) {
    let C_low, C_high, I_low, I_high;

    if (C >= 0 && C <= 12.0) {
        C_low = 0; C_high = 12.0; I_low = 0; I_high = 50;
    } else if (C > 12.0 && C <= 35.4) {
        C_low = 12.1; C_high = 35.4; I_low = 51; I_high = 100;
    } else if (C > 35.4 && C <= 55.4) {
        C_low = 35.5; C_high = 55.4; I_low = 101; I_high = 150;
    } else if (C > 55.4 && C <= 150.4) {
        C_low = 55.5; C_high = 150.4; I_low = 151; I_high = 200;
    } else if (C > 150.4 && C <= 250.4) {
        C_low = 150.5; C_high = 250.4; I_low = 201; I_high = 300;
    } else if (C > 250.4 && C <= 350.4) {
        C_low = 250.5; C_high = 350.4; I_low = 301; I_high = 400;
    } else if (C > 350.4 && C <= 500.4) {
        C_low = 350.5; C_high = 500.4; I_low = 401; I_high = 500;
    } else {
        return '>500';
    }

    const I = ((I_high - I_low) / (C_high - C_low)) * (C - C_low) + I_low;
    return I.toFixed(0); // Округляем результат до целого числа
}

function resizeImages(aqi) {
    const images = document.querySelectorAll('.gallery img');
    images.forEach(img => {
        img.style.width = '150px';
        img.style.height = '300px';
    });

    let targetImgId;
    if (aqi >= 0 && aqi <= 50) {
        targetImgId = 'img-green';
    } else if (aqi > 50 && aqi <= 100) {
        targetImgId = 'img-yellow';
    } else if (aqi > 100 && aqi <= 150) {
        targetImgId = 'img-orange';
    } else if (aqi > 150 && aqi <= 200) {
        targetImgId = 'img-red';
    } else if (aqi > 200 && aqi <= 300) {
        targetImgId = 'img-purple';
    } else if (aqi > 300) {
        targetImgId = 'img-maroon';
    }

    const targetImg = document.getElementById(targetImgId);
    targetImg.style.width = '250px';
    targetImg.style.height = '450px';
}

function setRecommendation(aqi) {
    let recommendation;
    if (aqi >= 0 && aqi <= 50) {
        recommendation = `
        <div class="d-flex justify-content-center">
            <div class="card mb-3" style="max-width: 1100px;">
                <div class="row g-0">
                    <div class="col-md-2">
                        <img src="green1.png" class="img-fluid rounded-start" alt="Good">
                    </div>
                        <div class="col-md-10">
                            <div class="card-body">
                                <h2 class="text-start text-title">Хорошее качество воздуха (Good)</h2>
                                <p class="fst-italic text-description text-start">Качество воздуха считается удовлетворительным, загрязнение воздуха не представляет опасности.Это идеальный день для активного времяпрепровождения на улице!</p>
                            </div>
                        </div>
                </div>
            </div>
        </div>
        `;
    } else if (aqi > 50 && aqi <= 100) {
        recommendation = `
        <div class="d-flex justify-content-center">
            <div class="card mb-3" style="max-width: 1100px;">
                <div class="row g-0">
                    <div class="col-md-2">
                        <img src="yellow1.png" class="img-fluid rounded-start" alt="Unhealthy for sensitive groups">
                    </div>
                        <div class="col-md-10">
                            <div class="card-body">
                                <h2 class="text-start text-title">Умеренное качество воздуха (Moderate)</h2>
                                <p class="fst-italic text-description text-start">Качество воздуха считается приемлемым, однако для некоторых загрязняющих веществ может существовать умеренный риск для здоровья у небольшой группы людей с повышенной чувствительностью к загрязнению.</p>
                                <p class="text-start text-description"><strong class="text-advice">Совет для чувствительных людей:</strong> Снизьте физическую нагрузку, избегайте длительных или интенсивных упражнений. Обратите внимание на симптомы, такие как кашель или одышка, и уменьшите физическую активность.</p>
                                <p class="text-start text-description"><strong class="text-general">Для остальных:</strong> День для прогулок на улице!</p>
                            </div>
                        </div>
                </div>
            </div>
        </div>
        `;
    } else if (aqi > 100 && aqi <= 150) {
        recommendation = `
        <div class="d-flex justify-content-center">
            <div class="card mb-3" style="max-width: 1100px;">
                <div class="row g-0">
                    <div class="col-md-2">
                        <img src="orange1.png" class="img-fluid rounded-start" alt="Unhealthy for sensitive groups">
                    </div>
                        <div class="col-md-10">
                             <div class="card-body">
                                <h2 class="text-start text-title">Вредно для чувствительных групп (Unhealthy for Sensitive Groups)</h2>
                                <p class="fst-italic text-description text-start">Представлители чувствительных групп могут испытывать влияние на здоровье, для остальной части населения это не является проблемой.</p>
                                <p class="text-start text-description"><strong class="text-advice">Совет для чувствительных людей:</strong> Снизьте физическую активность на улице, делайте перерывы и избегайте чрезмерных нагрузок. Следите за симптомами, такими как кашель или одышка.</p>
                                <p class="text-start text-description"><strong class="text-advice">Для людей с астмой: </strong>Следуйте плану действий при обострении астмы и держите под рукой медикаменты. </p>
                                <p class="text-start text-description"><strong class="text-advice">Для людей с заболеваниями сердца:</strong>Обратите внимание на симптомы, такие как учащенное сердцебиение, одышка или необычная усталость. В случае этих симптомов, проконсультируйтесь с врачом.</p>
                            </div>
                        </div>
                </div>
            </div>
        </div>
            `;
    } else if (aqi > 150 && aqi <= 200) {
        recommendation = `
        <div class="d-flex justify-content-center">
            <div class="card mb-3" style="max-width: 1100px;">
                <div class="row g-0">
                    <div class="col-md-2">
                        <img src="red1.png" class="img-fluid rounded-start" alt="Unhealthy for sensitive groups">
                    </div>
                        <div class="col-md-10">
                            <div class="card-body">
                                <h2 class="text-start text-title">Плохое качество воздуха (Unhealthy)</h2>
                                <p class="fst-italic text-description text-start">Все могут начать испытывать проблемы со здоровьем, а чувствительные группы — более серьезные.</p>
                                <p class="text-start text-description"><strong class="text-advice">Совет для чувствительных людей:</strong>Избегайте длительных или интенсивных нагрузок на улице. Переместите активность в помещение или перенесите её на более чистое время дня.</p>
                                <p class="text-start text-description"><strong class="text-general">Для остальных:</strong> Ограничьте физическую активность, делайте более частые перерывы во время прогулок или занятий на улице.</p>
                            </div>
                        </div>
                </div>
            </div>
        </div>
            `;
    } else if (aqi > 200 && aqi <= 300) {
        recommendation = `
        <div class="d-flex justify-content-center">
            <div class="card mb-3" style="max-width: 1100px;">
                <div class="row g-0">
                    <div class="col-md-2">
                        <img src="purple1.png" class="img-fluid rounded-start" alt="Unhealthy for sensitive groups">
                    </div>
                        <div class="col-md-10">
                             <div class="card-body">
                                <h2 class="text-start text-title">Очень плохое качество воздуха (Very Unhealthy)</h2>
                                <p class="fst-italic text-description text-start">Всем людям может грозить серьезное влияние на здоровье.</p>
                                <p class="text-start text-description"><strong class="text-advice">Совет для чувствительных людей:</strong> Избегайте всей физической активности на улице. Переместите её в помещение или перенесите на более безопасное время.</p>
                                <p class="text-start text-description"><strong class="text-general">Для остальных:</strong> Снизьте физическую активность, рассмотрите возможность переноса прогулок в помещение или переноса их на более чистое время дня.</p>
                            </div>
                        </div>
                </div>
            </div>
        </div>
            `;
    } else if (aqi > 300) {
        recommendation = `
        <div class="d-flex justify-content-center">
            <div class="card mb-3" style="max-width: 1100px;">
                <div class="row g-0">
                    <div class="col-md-2">
                        <img src="maroon1.png" class="img-fluid rounded-start" alt="Unhealthy for sensitive groups">
                    </div>
                        <div class="col-md-10">
                             <div class="card-body">
                                <h2 class="text-start text-title">Опасное качество воздуха (Hazardous)</h2>
                                <p class="fst-italic text-description text-start">Предупреждения о чрезвычайных условиях для здоровья. Все могут быть затронуты.</p>
                                <p class="text-start text-description"><strong class="text-advice">Совет для чувствительных людей:</strong> Оставайтесь внутри и минимизируйте физическую активность. Следуйте рекомендациям по снижению уровня загрязнения внутри помещений.</p>
                                <p class="text-start text-description"><strong class="text-general">Советы для всех: </strong>Избегайте всей физической активности на улице.</p>
                            </div>
                        </div>
                </div>
            </div>
        </div>
            `;
    }

    document.getElementById('recommendation').innerHTML = recommendation;
}
