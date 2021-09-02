const http = require('http');

const url = `http://api.weatherstack.com/current?access_key=579fdf1399b1657b5ca7d648cf3b1e89&query=35.3548,138.7253`;

const request = http.request(url, (response) => {
    
    let data = '';

    response.on('data', (chunk) => {
        data += chunk.toString();
    });

    response.on('end', () => {
        const body = JSON.parse(data);

        console.log(body);
    });

});

request.on('error', (error) => {
    console.log('An error', error);
});

request.end();