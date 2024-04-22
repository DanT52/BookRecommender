const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/user-model'); 

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/redirect"
  },
  async (accessToken, refreshToken, profile, done) => {
    // Check if user already exists in database
    const currentUser = await User.findOne({ googleId: profile.id });
    if (currentUser) {
      // already have the user
      done(null, currentUser);
    } else {
      // if not, create user in db
      const newUser = await new User({
        googleId: profile.id,
        displayName: profile.displayName
      }).save();
      done(null, newUser);
    }
  }
));

// Serialize and deserialize user instances to and from the session.
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});
