const mongoose = require("mongoose"),
  bcrypt = require("bcrypt"); // hashes user password and compares everytime user logs in

// user schema
const userSchema = mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  breweries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Brewery" }],
});

// brewery schema
const brewerySchema = mongoose.Schema({
  companyName: { type: String, required: true },
  owner: { type: String, required: true },
  admin: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  staff: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  beers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Beer" }],
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
});

// beer schema
const beerSchema = mongoose.Schema({
  name: { type: String, required: true },
  style: { type: String, required: true },
  abv: Number,
  category: [String],
  malt: [String],
  hops: [String],
  flavorNotes: String,
  aroma: String,
  nameSake: String,
  notes: String,
});

// category schema
const categorySchema = mongoose.Schema({
  name: { type: String, required: true },
});

// Movie schema being defined for Movies Collection. It follows a syntax of Key: {Value}, format.
let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
  },
  ImageUrl: String,
  Release: String,
  Featured: Boolean,
  Actors: [String],
});

// User schema being defined for Users Collection
// let userSchema = mongoose.Schema({
//   Username: { type: String, required: true }, // MUST have a username and MUST be a string
//   Password: { type: String, required: true },
//   Email: { type: String, required: true },
//   Birthday: Date, // Must be a value of the date type Date
//   // defines value will be an ObjectID by way of ref: 'Movie' ('Movie' name of model which links movieSchema to database)
//   FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
//   ToWatch: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
// });

// Function hashes users summited password
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

// Function compares submitted hashed password with hashed password stored in database
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

// Creation for db, will come out lowercase and plurals. eg. db.beers
const Beer = mongoose.model("Beer", beerSchema);
const User = mongoose.model("User", userSchema);
const Brewery = mongoose.model("Brewery", brewerySchema);
const Category = mongoose.model("Category", categorySchema);

// Watch capital letters and plurals. Below will make db.movies and db.users
let Movie = mongoose.model("Movie", movieSchema);

// export models
module.exports.Beer = Beer;
module.exports.Brewery = Brewery;
module.exports.Category = Category;
module.exports.User = User;

module.exports.Movie = Movie;
