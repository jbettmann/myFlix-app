const express = require("express"),
  bodyParser = require("body-parser"),
  uuid = require("uuid"),
  morgan = require("morgan"),
  mongoose = require("mongoose"), // Intergrates mongoose into file
  Models = require("./models.js"), // allows access to database schema
  cors = require("cors"); // Cross-Orgin Resourse Sharing

const { check, validationResult } = require("express-validator");

// Refer to models named in models.js
const Movies = Models.Movie;
const Users = Models.User;

// allows Mongoose to conncect to database to perform CRUD operations on doc
mongoose.connect(
  process.env.CONNECTION_URI || "mongodb://localhost:27017/myFlixDB",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const app = express();

// List of allowed domains
let allowedOrigins = [
  "http://localhost:8080",
  "http://testsite.com",
  "http://localhost:49899",
  "http://localhost:4200",
  "https://bettsmyflix.netlify.app",
  "https://jbettmann.github.io",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      // If a specific origin isn't found on the list of allowed origins
      if (allowedOrigins.indexOf(origin) === -1) {
        let message = `The CORS policy for this application doesn't all access from origin ${origin}`;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let auth = require("./auth")(app); // (app) ensures Express is available in auth.js file
const passport = require("passport");
require("./passport");

/**
 * Logs basic request data in terminal using Morgan middleware library
 */
app.use(morgan("common"));

// sends static html page documentation.html
app.use(express.static("public"));

// sends response below to homepage
app.get("/", (req, res) => {
  res.send(`myFlix. All the greats, in one place!`);
});

let handleError = (err) => {
  console.error(err);
  res.status(500).send(`Error: ${err}`);
};

/**
 * GET: Returns a list of ALL movies to the user
 * Request body: Bearer token
 * @returns array of movie objects
 * @requires passport
 */
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find() // .find() grabs data on all documents in collection
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch(handleError);
  }
);

/**
 * GET: Returns data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
 * Request body: Bearer token
 * @param title (title of movie)
 * @returns movie object
 * @requires passport
 */
app.get(
  "/movies/:title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // condition to find specific user based on Username (similar to WHERE in SQL)
    Movies.findOne({ Title: req.params.title })
      .then((title) => {
        res.json(title);
      })
      .catch(handleError);
  }
);

/**
 * GET: Returns data about a genre (description) by name/title (e.g., “Fantasy”)
 * Request body: Bearer token
 * @param genre (name of genre)
 * @returns genre object
 * @requires passport
 */
app.get(
  "/movies/genres/:genre",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // condition to find specific user based on Username (similar to WHERE in SQL)
    Movies.findOne({ "Genre.Name": req.params.genre })
      .then((movie) => {
        res.json(movie.Genre.Description);
      })
      .catch(handleError);
  }
);

/**
 * GET: Returns data about a actor by name
 * Request body: Bearer token
 * @param actor (name of actor)
 * @returns actor object
 * @requires passport
 */
app.get(
  "/movies/actors/:actor",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // condition to find specific user based on Username (similar to WHERE in SQL)
    Movies.find({ Actors: req.params.actor })
      .then((movie) => {
        res.json(movie);
      })
      .catch(handleError);
  }
);

/**
 * GET: Returns data about a director (bio, birth year, death year) by name
 * Request body: Bearer token
 * @param director (name of director)
 * @returns director object
 * @requires passport
 */
app.get(
  "/movies/directors/:director",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // condition to find specific user based on Username (similar to WHERE in SQL)
    Movies.findOne({ "Director.Name": req.params.director })
      .then((movie) => {
        res.json(movie.Director);
      })
      .catch(handleError);
  }
);

/**
 * GET: Returns a list of ALL users
 * Request body: Bearer token
 * @returns array of user objects
 * @requires passport
 */
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.find() // .find() grabs data on all documents in collection
      .then((users) => {
        res.status(201).json(users);
      })
      .catch(handleError);
  }
);

/**
 * GET: Returns data on a single user (user object) by username
 * Request body: Bearer token
 * @param Username
 * @returns user object
 * @requires passport
 */
app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // condition to find specific user based on Username (similar to WHERE in SQL)
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch(handleError);
  }
);

/**
 * POST: Allows new users to register; Username, Password & Email are required fields!
 * Request body: Bearer token, JSON with user information
 * @returns user object
 */
app.post(
  "/users",
  [
    // Validation logic
    //minimum value of 5 characters are only allowed
    check("Username", "Username is required").isLength({ min: 5 }),

    // field can only contain letters and numbers
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),

    // Chain of methods like .not().isEmpty() which means "opposite of isEmpty" or "is not empty"
    check("Password", "Password is required").not().isEmpty(),

    // field must be formatted as an email address
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    // check if user already exists
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        // returns if user exists
        if (user) {
          return res.status(400).send(`${req.body.Username} already exists`);
          // creates and returns if user DOES NOT exist
        } else {
          Users.create({
            // .create takes and object based on schema
            Username: req.body.Username, // remember 'req.body' is request that user sends
            Password: hashedPassword, // Hashes password entered  when registering before storing in MongoDB
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch(handleError);
        }
      })
      .catch(handleError);
  }
);

// Defined for API endpoints
//     const newUser = req.body;

//     if (newUser.name) {
//         newUser.id = uuid.v4();
//         users.push(newUser);
//         // status code 201 = created
//         res.status(201).json(newUser);
//     } else {
//         // status code 400 = bad request
//         res.status(400).send('users need name');
//     }
/**
 * PUT: Allow users to update their user info (find by username)
 * Request body: Bearer token, updated user info
 * @param Username
 * @returns user object with updates
 * @requires passport
 */
app.put(
  "/users/:Username",
  [
    passport.authenticate("jwt", { session: false }),

    // Validation logic
    //minimum value of 5 characters are only allowed
    check("Username", "Username is required").isLength({ min: 5 }),

    // field can only contain letters and numbers
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),

    // Chain of methods like .not().isEmpty() which means "opposite of isEmpty" or "is not empty"
    check("Password", "Password is required").not().isEmpty(),

    // field must be formatted as an email address
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);
    let hashedPassword = Users.hashPassword(req.body.Password);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          handleError(err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 * POST: Allows users to add a movie to their list of favorites
 * Request body: Bearer token
 * @param username
 * @param movieId
 * @returns user object
 * @requires passport
 */
app.post(
  "/users/:Username/favorites/:movieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $addToSet: { FavoriteMovies: req.params.movieID } },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          handleError(err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 * DELETE: Allows users to remove a movie from their list of favorites
 * Request body: Bearer token
 * @param Username
 * @param movieId
 * @returns user object
 * @requires passport
 */
app.delete(
  "/users/:Username/favorites/:movieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.movieID } },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          handleError(err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 * POST: Allows users to add a movie to their list of to watch
 * Request body: Bearer token
 * @param username
 * @param movieId
 * @returns user object
 * @requires passport
 */
app.post(
  "/users/:Username/ToWatch/:movieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $addToSet: { ToWatch: req.params.movieID } },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          handleError(err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 * DELETE: Allows users to remove a movie from their list of to watch
 * Request body: Bearer token
 * @param Username
 * @param movieId
 * @returns user object
 * @requires passport
 */
app.delete(
  "/users/:Username/ToWatch/:movieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { ToWatch: req.params.movieID } },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          handleError(err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 * DELETE: Allows existing users to deregister
 * Request body: Bearer token
 * @param Username
 * @returns success message
 * @requires passport
 */
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(`${req.params.Username} was not found.`);
        } else {
          res.status(200).send(`${req.params.Username} was deleted.`);
        }
      })
      .catch(handleError);
  }
);

// catches and logs error if occurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Oopps! Something Broke!");
});

// process.env.PORT listens for pre-configured port number or, if not found, set port to pertain port number
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log(`Listening on Port ${port}`);
});
