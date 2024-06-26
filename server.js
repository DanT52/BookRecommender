require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const Book = require('./models/book-model.js');
const recommendBooks = require('./bookRecomender.js');
const MongoStore = require('connect-mongo');



const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.static('public'))


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
  saveUninitialized: false,
  store: MongoStore.create({ // Configure connect-mongo
    mongoUrl: process.env.MONGODB_URI,
    dbName: "book_recommender",
    collection: "sessions"
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
  }
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
    res.redirect('/close.html');
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

app.get('/my-books', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'User is not authenticated' });
  }

  try {
    const books = await Book.find({ user: req.user._id });
    res.json(books);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching books', error: err });
  }
});


app.post('/recommendations', async (req, res) => {
  try {
    const { booksToBaseRecommendationOn, booksToNotRecommend } = req.body;

    const recommendations = await recommendBooks(booksToBaseRecommendationOn, booksToNotRecommend, 3);
    res.json(recommendations);
  } catch (error) {
    console.error('Error recommending books:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.delete('/delete-book', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'User is not authenticated' });
  }

  const { title, author } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: 'Book title and author are required' });
  }

  // Use findOne() with a Promise
  Book.findOne({ title, author, user: req.user._id })
    .then(book => {
      if (!book) {
        // The book either doesn't exist or doesn't belong to the user
        return res.status(404).json({ message: 'Book not found or unauthorized' });
      }

      // If book exists, proceed to delete it
      return Book.deleteOne({ title, author, user: req.user._id });
    })
    .then(() => {
      // Deletion successful
      res.json({ message: 'Book successfully deleted' });
    })
    .catch(err => {
      // Handle any errors
      res.status(500).json({ message: 'Error deleting book', error: err });
    });
});





app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
