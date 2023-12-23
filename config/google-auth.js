var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const users = require('../model/userDatabase');
const passport = require('passport');

passport.use(new GoogleStrategy({
    clientID:    "619740585323-4d652apb4qjejb1et3lcku8a2383a3eu.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:4000/auth/google/callback"
  },
  function(request, accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
    console.log(accessToken, profile);
    try {
        const user = users .find(u => u.username === profile.name);
    
      if (user) {
        console.log(user)
        // req.user=user
        return done(null, user);
      }
      let username=profile.name
      const newUser = { username };
      users.push(newUser);
      console.log(username)

      return done(null, username);
      } catch (e) {
        console.log(e)
      }
  }
));

passport.serializeUser((user, done) => {
  done(null,true);
});

// Deserialize user from the session
passport.deserializeUser((id, done) => {
  const user = users.find(u => u.id === id);
  done(null, user);
});