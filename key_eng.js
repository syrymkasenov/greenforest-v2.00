document.addEventListener('DOMContentLoaded', function() {
    selectCity('Ust-Kamenogorsk'); // Установка города по умолчанию при загрузке страницы
});

function selectCity(cityName) {
    document.getElementById('city-name').innerText = cityName; // Отображение имени города
    const cityData = {
        "Almaty": { lat: 43.2220, lon: 76.8512 },
        "Ust-Kamenogorsk": { lat: 49.9639, lon: 82.6094 },
        "Karaganda": { lat: 49.8139, lon: 73.0951 },
        "Astana": { lat: 51.1694, lon: 71.4491 },
        "Shymkent": { lat: 42.3176, lon: 69.5918 },
        "Aktau": { lat: 43.6561, lon: 51.1684 },
        "Atyrau": { lat: 47.1164, lon: 51.8839 },
        "Aktobe": { lat: 50.2797, lon: 57.2072 },
        "Semey": { lat: 50.4196, lon: 80.2454 },
        "Pavlodar": { lat: 52.2871, lon: 76.9533 },
        "Kyzylorda": { lat: 44.8528, lon: 65.5094 },
        "Taraz": { lat: 42.9016, lon: 71.3645 }
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
                                <h2 class="text-start text-title">Good air quality (Good)</h2>
                                <p class="fst-italic text-description text-start">Air quality is considered satisfactory, and air pollution poses no risk. It’s a perfect day for outdoor activities!</p>
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
                                <h2 class="text-start text-title">Moderate air quality (Moderate)</h2>
                                <p class="fst-italic text-description text-start">Air quality is considered acceptable; however, for certain pollutants, there may be a moderate health risk for a small group of people who are particularly sensitive to air pollution.</p>
                                <p class="text-start text-description"><strong class="text-advice">Advice for sensitive individuals: </strong> Reduce physical exertion, avoid prolonged or intense activities. Pay attention to symptoms like coughing or shortness of breath, and decrease physical activity if necessary.</p>
                                <p class="text-start text-description"><strong class="text-general">For others:</strong> A great day for outdoor activitie.</p>
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
                                <h2 class="text-start text-title">Unhealthy for Sensitive Groups </h2>
                                <p class="fst-italic text-description text-start">Members of sensitive groups may experience health effects, while the general population is not likely to be affected.</p>
                                <p class="text-start text-description"><strong class="text-advice">Advice for sensitive groups:</strong> Reduce outdoor physical activity, take breaks, and avoid excessive exertion. Pay attention to symptoms such as coughing or shortness of breath.</p>
                                <p class="text-start text-description"><strong class="text-advice">For individuals with asthma: </strong>Follow your asthma action plan and keep your medications on hand.</p>
                                <p class="text-start text-description"><strong class="text-advice">For people with heart conditions:</strong>Pay attention to symptoms such as rapid heartbeat, shortness of breath, or unusual fatigue. If any of these symptoms occur, consult with a doctor.</p>
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
                                <h2 class="text-start text-title">Poor air quality (Unhealthy)</h2>
                                <p class="fst-italic text-description text-start">Everyone may start experiencing health problems, while sensitive groups may face more serious issues.</p>
                                <p class="text-start text-description"><strong class="text-advice">Advice for sensitive individuals: </strong> Avoid prolonged or intense outdoor activities. Move the activity indoors or reschedule it for a time of day with cleaner air.</p>
                                <p class="text-start text-description"><strong class="text-general">For others: </strong> Limit physical activity and take more frequent breaks during outdoor walks or exercises.</p>
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
                                <h2 class="text-start text-title">Very poor air quality (Very Unhealthy)</h2>
                                <p class="fst-italic text-description text-start">Everyone may face serious health impacts.</p>
                                <p class="text-start text-description"><strong class="text-advice">Advice for sensitive individuals: </strong> Avoid all outdoor physical activities. Move them indoors or reschedule for a safer time.</p>
                                <p class="text-start text-description"><strong class="text-general">For others: </strong> Reduce physical activity, consider moving walks indoors or rescheduling them for a cleaner time of day.</p>
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
                                <h2 class="text-start text-title">Dangerous air quality (Hazardous)</h2>
                                <p class="fst-italic text-description text-start"> Health emergency warnings. Everyone may be affected.</p>
                                <p class="text-start text-description"><strong class="text-advice">Advice for sensitive individuals:</strong> Stay indoors and minimize physical activity. Follow recommendations to reduce indoor pollution levels.</p>
                                <p class="text-start text-description"><strong class="text-general">For others: </strong>Avoid all outdoor physical activity.</p>
                            </div>
                        </div>
                </div>
            </div>
        </div>
            `;
    }

    document.getElementById('recommendation').innerHTML = recommendation;
}
