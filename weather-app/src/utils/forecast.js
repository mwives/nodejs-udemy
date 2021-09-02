const request = require('postman-request');

const forecast = (lat, long, scale, callback) => {
    const url = `http://api.weatherstack.com/current?access_key=${process.env.FORECAST_API_KEY}&query=${lat},${long}&units=${scale}`;

    request({ url, json: true }, (error, { body } = {}) => {
        if (error) {
            return callback('Unable to connect with weather services.', undefined);
        } else if (body.error) {
            return callback('Unable to get weather. Please, try another search', undefined);
        }

        callback(undefined, {
            temperature: body.current.temperature,
            thermalSensation: body.current.feelslike,
            humidity: body.current.humidity,
            windSpeed: body.current.wind_speed
        });
    })
};

module.exports = forecast;