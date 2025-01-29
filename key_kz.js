document.addEventListener('DOMContentLoaded', function() {
    selectCity('Өскемен'); // Установка города по умолчанию при загрузке страницы
});

function selectCity(cityName) {
    document.getElementById('city-name').innerText = cityName; // Отображение имени города
    const cityData = {
        "Алматы": { lat: 43.2220, lon: 76.8512 },
        "Өскемен": { lat: 49.9639, lon: 82.6094 },
        "Қарағанды": { lat: 49.8139, lon: 73.0951 },
        "Астана": { lat: 51.1694, lon: 71.4491 },
        "Шымкент": { lat: 42.3176, lon: 69.5918 },
        "Ақтау": { lat: 43.6561, lon: 51.1684 },
        "Атырау": { lat: 47.1164, lon: 51.8839 },
        "Ақтөбе": { lat: 50.2797, lon: 57.2072 },
        "Семей": { lat: 50.4196, lon: 80.2454 },
        "Павлодар": { lat: 52.2871, lon: 76.9533 },
        "Қызылорда": { lat: 44.8528, lon: 65.5094 },
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
                                <h2 class="text-start text-title">Жақсы ауа сапасы(Good)</h2>
                                <p class="fst-italic text-description text-start">Ауа сапасы қанағаттанарлық деп саналады және ауаның ластануы ешқандай қауіп төндірмейді. Бұл ашық ауада демалу үшін тамаша күн!</p>
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
                                <h2 class="text-start text-title">Орташа ауа сапасы (Moderate)</h2>
                                <p class="fst-italic text-description text-start">Ауа сапасы қолайлы деп саналады; дегенмен, кейбір ластаушы заттармен ауаның ластануынан ерекше сезімтал адамдар тобының денсаулығына орташа қауіп төнуі мүмкін.</p>
                                <p class="text-start text-description"><strong class="text-advice">Сезімтал адамдарға арналған кеңес: </strong> Физикалық жүктемені азайтыңыз, ұзақ немесе қарқынды жаттығулар жасамауға кеңес беріледі. Жөтел немесе ентігу сияқты белгілерге назар аударыңыз, қажет болған жағдайда физикалық белсенділікті төмендетіңіз.</p>
                                <p class="text-start text-description"><strong class="text-general">Қалғандары үшін:</strong> сыртта серуендеуге арналған күн!</p>
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
                                <h2 class="text-start text-title">Сезімтал топтарға зиянды (Unhealthy for Sensitive Groups)</h2>
                                <p class="fst-italic text-description text-start">Ауа ластануы сезімтал топтардың денсаулығына әсер етуі мүмкін, қалған топтар үшін қатты әсер етпеуі мүмкін.</p>
                                <p class="text-start text-description"><strong class="text-advice">Сезімтал адамдарға арналған кеңес:</strong> сырттағы физикалық белсенділікті азайтыңыз, үзіліс жасаңыз және шамадан тыс жүктемелерден аулақ болыңыз. Жөтел немесе ентігу сияқты белгілерді қадағалаңыз.</p>
                                <p class="text-start text-description"><strong class="text-advice">Демікпесі бар адамдар үшін: </strong> Демікпенің өршуіне қарсы іс-қимыл жоспарын орындаңыз және дәрі-дәрмектерді жақын жерде ұстаңыз. </p>
                                <p class="text-start text-description"><strong class="text-advice">Жүрек ауруы бар адамдар үшін:</strong>жүрек соғуы, ентігу немесе әдеттен тыс шаршау сияқты белгілерге назар аударыңыз. Бұл белгілер пайда болған жағдайда дәрігермен кеңесіңіз.</p>
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
                                <h2 class="text-start text-title">Ауа сапасы нашар (Unhealthy)</h2>
                                <p class="fst-italic text-description text-start">Барлығы денсаулығына байланысты проблемаларды бастан кешіруі мүмкін, ал сезімтал топтар одан да ауыр болуы мүмкін.</p>
                                <p class="text-start text-description"><strong class="text-advice">Сезімтал адамдарға арналған кеңес:</strong> сыртта ұзақ немесе қарқынды жүктемелерден аулақ болыңыз. Әрекетті үйге жылжытыңыз немесе оны күннің таза уақытына ауыстырыңыз.</p>
                                <p class="text-start text-description"><strong class="text-general">Қалғандары үшін: </strong> физикалық белсенділікті шектеңіз, сыртта серуендеу немесе жаттығу кезінде жиі үзіліс жасаңыз.</p>
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
                                <h2 class="text-start text-title">Ауа сапасы өте нашар (Very Unhealthy)</h2>
                                <p class="fst-italic text-description text-start">Ауа ластануы барлық адамдардың денсаулығына елеулі әсер етуі мүмкін.</p>
                                <p class="text-start text-description"><strong class="text-advice">Сезімтал адамдарға арналған кеңес:</strong> көшедегі барлық физикалық белсенділіктен аулақ болыңыз. Белсенділікті үйге немесе қауіпсіз уақытқа ауыстырыңыз.</p>
                                <p class="text-start text-description"><strong class="text-general">Қалғандары үшін:</strong> физикалық белсенділікті төмендетіңіз, серуендеуді азайтып, белсенділікті үйге ауыстыруды қарастырыңыз.</p>
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
                                <h2 class="text-start text-title">Ауаның қауіпті сапасы(Hazardous)</h2>
                                <p class="fst-italic text-description text-start">Денсаулыққа қатысты төтенше жағдайлар туралы ескертулер. Барлығына әсер етуі мүмкін.</p>
                                <p class="text-start text-description"><strong class="text-advice">Сезімтал адамдарға арналған кеңес: </strong> үй ішінде болыңыз және физикалық белсенділікті азайтыңыз. Үй ішіндегі ластану деңгейін төмендету бойынша ұсыныстарды орындаңыз.</p>
                                <p class="text-start text-description"><strong class="text-general">Барлығына арналған кеңестер: </strong>көшедегі барлық физикалық белсенділіктен аулақ болыңыз.</p>
                            </div>
                        </div>
                </div>
            </div>
        </div>
            `;
    }

    document.getElementById('recommendation').innerHTML = recommendation;
}
