var currentlocation;
var currentWeather;
var forecast;

document.getElementById('location-icon').style.display = 'none';
document.getElementById('turbine-img').style.display = 'none';
document.getElementById('w-speed-text').style.display = 'none';

let search_close = document.getElementById('search-close').addEventListener('click', () => {
    document.getElementById('search-window-background').style.display = 'none';

    document.getElementById('search-input').value = "";
    document.getElementById('tbl-body').innerHTML = ""
})

document.getElementById('nav-bar-btn-search').addEventListener('click', () => {
    document.getElementById('search-window-background').style.display = 'flex';
    document.getElementById('forecast-tbl').innerHTML = " "
})


var search_text_field = document.getElementById('search-input');

var controlKeys = ["Tab", "Escape", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Shift", "Alt"];

var tblBody = ``;

search_text_field.addEventListener('keyup', (event) => {
    if (controlKeys.includes(event.key)) {
        event.preventDefault();
    }

    var searched_item = search_text_field.value;

    if (searched_item == "") {
        tblBody = ``
    }

    fetch('http://api.weatherapi.com/v1/search.json?key=ca9ecef6f767472988062906242808&q=' + searched_item)
        .then(res => res.json())
        .then(data => {
            var c = 0;
            data.forEach(element => {
                tblBody += `<tr id="${++c}">
                            <td>${element.name}</td>
                            <td>${element.country}</td>
                            <td>${element.region}</td>
                            <td>${element.lat} / ${element.lon}</td>
                        </tr>`
            });
            document.getElementById('tbl-body').innerHTML = tblBody

            c = 0;
            data.forEach(element => {
                document.getElementById(++c).addEventListener('click', () => {
                    fetch('http://api.weatherapi.com/v1/forecast.json?key=ca9ecef6f767472988062906242808&q=' + element.lat + "," + element.lon + '&days=7&aqi=no&alerts=no')
                        .then(res => res.json())
                        .then(elements => {
                            currentlocation = elements.location;
                            currentWeather = elements.current;
                            forecast = elements.forecast;

                            locationSelected();

                            document.getElementById('location-icon').style.display = 'block';
                            document.getElementById('turbine-img').style.display = 'block';
                            document.getElementById('w-speed-text').style.display = 'block';

                            document.getElementById('search-window-background').style.display = 'none';
                            document.getElementById('search-input').value = "";
                            document.getElementById('tbl-body').innerHTML = "";
                        })

                })
            })

            tblBody = ``;
        })
})

let locationText = document.getElementById('location-by-text');
let carousel = document.getElementById('carousel-id')
let liveTemperature = document.getElementById('live-temp');
let forecastTable = document.getElementById('forecast-tbl');
let windSpeed = document.getElementById('wind-speed');

let cardList = ``;
let forecastList = ``;

function locationSelected() {
    locationText.innerText = currentlocation.name + " / " + currentlocation.country;

    liveTemperature.innerText = currentWeather.temp_c + " °C";

    windSpeed.innerText = currentWeather.wind_mph + " mph / " + currentWeather.wind_kph + " kmph"

    forecast.forecastday.forEach(element => {
        forecastList += `<tr>
                            <td style="">${element.date}</td>
                            <td style=""><img style="width:2rem;" src="${element.day.condition.icon}" alt=""></td>
                            <td style="">${element.day.mintemp_c} °C - ${element.day.maxtemp_c} °C</td>
                        </tr>`
    })

    forecastTable.innerHTML = forecastList;

    for (let i = 0; i < forecast.forecastday[0].hour.length; i++) {
        cardList += `<div class="carousel-item d-flex d-table-row gap-2 ">
                    
                        <div class="card bg-black">
                            <div class="container d-flex flex-column justify-content-center">
                                <img class="w-25" src="${forecast.forecastday[0].hour[i].condition.icon}" alt="">

                            <div class="card-body">
                                <p class="card-title text-white text-center fs-6">${forecast.forecastday[0].hour[i].condition.text}</p>
                                <p class="card-title text-white text-center fs-6">${forecast.forecastday[0].hour[i].time}</p>
                            </div>
                        </div>
                    </div>`
    }

    carousel.innerHTML = cardList

    forecastList = ``
}


