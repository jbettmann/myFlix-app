
const express = require('express'),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    morgan = require('morgan');


const app = express();

app.use(bodyParser.json());
// logs requests to console via morgan's common format
app.use(morgan('common'));

// sends static html page documentation.html
app.use(express.static('public'));


let users = [
    {
        id: 1,
        name: 'Ric',
        favoriteMovies : []
    },
    {
        id: 2,
        name: 'Todd',
        favoriteMovies : [
            'The Matrix'
        ]
    },
    {
        id: 3,
        name: 'Maria',
        favoriteMovies : []
    }

];


let topMovies = [
     {
        title: 'The Lord Of The Rings: The Two Towers',
        director: 'Pete Jackson',
        genre: 'Thriller'
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
     }

]

// READ (GET) response with topMovies
app.get('/movies', (req, res) => {
    res.status(200).json(topMovies);
});

// READ (GET) Returns details about single movie by title search
app.get('/movies/:title', (req, res) => {
    // Object Descruturing
    const { title } = req.params;
    const movie = topMovies.find(movie => movie.title === title);

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('no such movie found');
    }
})

// READ (GET) Returns details about genre by name
app.get('/movies/genre/:genreName', (req, res) => {
    // Object Descruturing
    const { genreName } = req.params;
    // searches through topMovies for genres by genre names (.genre.name) The .genre at the end very IMPORTANT, returns just the genre data instead of entire object.
    const genre = topMovies.find(movie => movie.genre === genreName).genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('no such genre found');
    }
})

// READ (GET) Returns movies that actor is in by actors name
app.get('/movies/actors/:actorName', (req, res) => {
    // Object Descruturing
    const { actorName } = req.params;
    // searches through topMovies for actor by actor names (.actors).
    const actor = topMovies.find(movie => movie.actors === actorName);

    if (actor) {
        res.status(200).json(actor);
    } else {
        res.status(400).send('no such actor found');
    }
})

// READ (GET) Returns details about director via director name
app.get('/movies/directors/:directorName', (req, res) => {
    // Object Descruturing
    const { directorName } = req.params;
    // searches through topMovies for director by director name (.director.name) The .director at the end very IMPORTANT, returns just the info about director instead of entire (movie) object.
    const director = topMovies.find(movie => movie.director === directorName).director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('no such director found');
    }
});

// CREATE (POST) New users registration 
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        // status code 201 = created
        res.status(201).json(newUser);
    } else {
        // status code 400 = bad request
        res.status(400).send('users need name');
    }
});

// UPDATE (PUT) Upated user name via id
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;
    // used two (==) equal instead of three (===) because one side is a 'string' other is a number. Is truthy
    let user = users.find(user => user.id == id);

    if (user) {
        user.name = updatedUser.name;
        // status code 200 = OK
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user');
    }
});

// CREATE (POST) Add movie to user Favorites
app.post('/users/:id/favorites/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
    // used two (==) equal instead of three (===) because one side is a 'string' other is a number. Is truthy
    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies.push(movieTitle);
        // status code 200 = OK
        res.status(200).send(`${movieTitle} has been added to ${user.name}'s array`);
    } else {
        res.status(400).send('no such user');
    }
});

// DELETE Remove movie to user Favorites
app.delete('/users/:id/favorites/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
    // used two (==) equal instead of three (===) because one side is a 'string' other is a number. Is truthy
    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter(title => title !==  movieTitle);
        // status code 200 = OK
        res.status(200).send(`${movieTitle} has been removed from ${user.name}'s array`);
    } else {
        res.status(400).send('no such user');
    }
});

// CREATE (POST) Add movie to user To Watch
app.post('/users/:id/toWatch/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
    // used two (==) equal instead of three (===) because one side is a 'string' other is a number. Is truthy
    let user = users.find(user => user.id == id);

    if (user) {
        user.toWatch.push(movieTitle);
        // status code 200 = OK
        res.status(200).send(`${movieTitle} has been added to ${user.name}'s array`);
    } else {
        res.status(400).send('no such user');
    }
});

// DELETE Remove movie to user To Watch
app.delete('/users/:id/toWatch/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
    // used two (==) equal instead of three (===) because one side is a 'string' other is a number. Is truthy
    let user = users.find(user => user.id == id);

    if (user) {
        user.toWatch = user.toWatch.filter(title => title !==  movieTitle);
        // status code 200 = OK
        res.status(200).send(`${movieTitle} has been removed from ${user.name}'s array`);
    } else {
        res.status(400).send('no such user');
    }
});

// DELETE Allows existing user to deregester 
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    // used two (==) equal instead of three (===) because one side is a 'string' other is a number. Is truthy
    let user = users.find(user => user.id == id);

    if (user) {
        users = users.filter(user => user.id != id)
        // status code 200 = OK
        res.status(200).send(`${user.name} has been deleted`);
    } else {
        res.status(400).send('no such user');
    }
});

// sends response below to homepage 
app.get('/', (req, res) => {
    res.send(`myFlix. All the greats in one place!`);
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