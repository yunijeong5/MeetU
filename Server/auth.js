import passport from 'passport';
import passportLocal from 'passport-local';
import users from './users.js';

const { Strategy } = passportLocal;

// Passport Configuration
// Create a new LocalStrategy object to handle authentication using username and
// password credentials from the client. The LocalStrategy object is used to
// authenticate a user using a username and password.

const strategy = new Strategy(async (username, password, done) => {

  // try {
  //   const user = await db.readUserPwd(username, password);
  //   if (!user) { // user doesn't exist
  //     return done(null, false, { message: 'Wrong username or password' });
  //   } //exists
  //   return done(null, user);
  // } 
  // catch (err) {
  //   return done(err);
  // }
});

// Configure passport to use the LocalStrategy object.
// The LocalStrategy object is used to authenticate a user using a username and
// password. There are other strategies available, but this is the simplest.
passport.use(strategy);

// Convert user object to a unique identifier.
passport.serializeUser((user, done) => {
  done(null, user);
});

// Convert a unique identifier to a user object.
passport.deserializeUser((uid, done) => {
  done(null, uid);
});

export default {
  configure: (app) => {
    app.use(passport.initialize());
    app.use(passport.session());
  },

  authenticate: (domain, where) => {
    return passport.authenticate(domain, where);
  },
};
