const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const users = require('../model/userDatabase');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      try {
        const user = users.find(u => u.username === jwt_payload.username);
    
      if (user) {
        console.log(user)
        // req.user=user
        return done(null, user);
      }

      return done(null, false);
      } catch (e) {
        console.log(e)
      }
      
    })
  );
};