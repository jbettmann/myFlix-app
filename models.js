
const mongoose = require('mongoose');
// Movie schema being defined for Movies Collection. It follows a syntax of Key: {Value}, format.
let movieSchema = mongoose.Schema( {
    Title: {type: String, requirted: true},
    Description: {type: String, requirted: true},
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String
    },
    ImageUrl: String,
    Release: String,
    Featured: Boolean,
    Actors: [String]
});

// User schema being defined for Users Collection 
let userSchema = mongoose.Schema( {
    Username: {type: String, requirted: true}, // MUST have a username and MUST be a string
    Password: {type: String, requirted: true},
    Email: {type: String, requirted: true},
    Birthday: Date, // Must be a value of the date type Date
    // defines value will be an ObjectID by way of ref: 'Movie' ('Movie' name of model which links movieSchema to database)
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}],
    ToWatch: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

// Watch capital letters and plurals. Below will make db.movies and db.users
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;