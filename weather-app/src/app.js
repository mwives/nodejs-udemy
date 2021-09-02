const
    path = require('path'),
    hbs = require('hbs'),
    express = require('express'),
    geocode = require('./utils/geocode'),
    forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT;

// Define paths
const
    publicDirectoryPath = path.join(__dirname, '../public'),
    viewsPath = path.join(__dirname, '../templates/views'),
    partialsPath = path.join(__dirname, '../templates/partials');

// Handlebar setup
app.set('view engine', 'hbs');
app.set('views', viewsPath);

hbs.registerPartials(partialsPath);

// Setup static directory
app.use(express.static(publicDirectoryPath));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/weather', (req, res) => {
    
    if (!req.query.address) {
        return res.send({ error: 'No address provided.' });
    }

    if (!req.query.scale) {
        return res.send({ error: 'No scale provided. Use m (Celsius) or f (Fahrenheit).' });
    }

    geocode(req.query.address, (error, { location, latitude, longitude } = {}) => {
        
        if (error) {
            return res.send({ error });
        }

        forecast(latitude, longitude, req.query.scale, (error, forecastData) => {
            if (error) {
                return res.send({ error });
            }

            res.send({
                location,
                forecastData
            });
        });
    });
});

app.listen(port, () => console.log(`Server running on port ${port}.`));