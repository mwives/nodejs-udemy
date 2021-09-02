const getForecast = (e) => {
    e.preventDefault();

    const
        location = document.querySelector('#location-input').value,
        unit = document.querySelector('#scale-select').value,
        msgOne = document.querySelector('#msg-1'),
        msgTwo = document.querySelector('#msg-2');

    let scale;

    if (unit === '1') {
        scale = 'm'; 
    } else if (unit === '2') {
        scale = 'f';
    }

    const url = `/weather?address=${location}&scale=${scale}`;

    console.log(url);

    msgOne.textContent = 'Loading...';
    msgTwo.textContent = '';

    fetch(url).then((response) => {

        response.json().then((data) => {
            if (data.error) {
                msgOne.textContent = data.error;
                msgTwo.textContent = '';

                return
            }

            let message = [];

            if (scale === 'm') {
                message[0] = `Now is ${data.forecastData.temperature}ºC degrees out, with a thermal sensation of ${data.forecastData.thermalSensation}ºC.<br>`;
            } else if (scale === 'f') {
                message[0] = `Now is ${data.forecastData.temperature}ºF degrees out, with a thermal sensation of ${data.forecastData.thermalSensation}ºF.<br>`;
            }

            message[1] = `The air humidity is in ${data.forecastData.humidity}%. The average wind speed is in ${data.forecastData.windSpeed} km/h.`

            console.log(data.forecastData);

            msgOne.textContent = data.location;
            msgTwo.innerHTML = message[0] + message[1];
        });
    });
};

const locationForm = document.querySelector('#location-form');
locationForm.addEventListener('submit', getForecast);