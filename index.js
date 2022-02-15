
const express = require('express'),
    morgan = require('morgan');

const app = express();

// logs requests to console via morgan's common format
app.use(morgan('common'));

// sends static html page documentation.html
app.use(express.static('public'));

// sends response below to homepage 
app.get('/', (req, res) => {
    res.send(`myFlix. All the greats in one place!`);
});

// response with json object of top 10 movies
app.get('/movies', (req, res) => {
    res.json(topMovies);
});

// catches and logs error if occurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Oopps! Something Broke!');
});

// listens on port 8080 and prints to console when running
app.listen(8080, () => {
    console.log('myFlix app listening on port 8080');
});