
const express = require('express'),
    morgan = require('morgan');

const app = express();

let topMovies = [
     {
        title: 'The Lord Of The Rings: The Two Towers',
        director: 'Pete Jackson'
     },
     {
        title: 'The Big Lebowski',
        director: 'Ethan & Joel Coen'
     },
     {
        title: 'The Grand Budapest Hotel',
        director: 'Wes Anderson'
     },
     {
        title: 'No Country for Old Men',
        director: 'Ethan & Joel Coen'
     },
     {
        title: 'The Life Aquatic with Steve Zissou',
        director: 'Wes Anderson'
     },
     {
        title: 'Barry Lyndon',
        director: 'Stanley Kubrick'
     },
     {
        title: 'Fight Club',
        director: 'David Fincher'
     },
     {
        title: 'The Matrix',
        director: 'Lana & Lilly Wachowski'
     },
     {
        title: 'Harry Potter and the Half-Blood Prince',
        director: 'David Yates'
     },
     {
        title: 'Interstellar',
        director: 'Christopher Nolan'
     },

]

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