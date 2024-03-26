require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const Book = require('./book-model.js');


const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:5500', // Allow only your frontend to make requests
  credentials: true, // Allow cookies to be sent with requests
  methods: ['GET', 'POST', 'PUT', 'DELETE'] // Specify which HTTP methods are allowed
};

app.use(cors(corsOptions));
// Passport config
require('./passport-setup');


// Connect to MongoDB

mongoose.connect(process.env.MONGODB_URI, {
  dbName: "book_recommender",
})



// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());``


// Auth with Google
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile'] // This asks for their profile info
  }));
  
  // Callback route for google to redirect to
  app.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
    // User is now authenticated and can be redirected to another route or page
    //res.send('You reached the callback URI');
    res.redirect('http://localhost:5500/close.html');
});
  

app.get('/auth/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
  });
});

app.get('/auth/status', (req, res) => {
  res.json({ isAuthenticated: req.isAuthenticated() }); // Returns true if user is logged in
});


app.post('/add-book', (req, res) => {

  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'User is not authenticated' });
  }

  const { title, author } = req.body; // Assuming you're sending these in the request body

  const newBook = new Book({
    title,
    author,
    user: req.user._id // Associate the book with the logged-in user
  });

  newBook.save()
    .then(book => res.json(book))
    .catch(err => res.status(400).json({ message: 'Error saving book', error: err }));
});

app.get('/my-books', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'User is not authenticated' });
  }

  Book.find({ user: req.user._id })
    .then(books => res.json(books))
    .catch(err => res.status(400).json({ message: 'Error fetching books', error: err }));
});




app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
