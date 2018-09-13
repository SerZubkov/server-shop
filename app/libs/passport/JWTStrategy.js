const passport = require('koa-passport');
const config = require('config');
const { Strategy, ExtractJwt } = require('passport-jwt');

const User = require('../../models/user');

passport.use(new Strategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.get('jwtSecret'),
}, ((payload, done) => {
  User.findById(payload.id, (err, user) => {
    if (err) {
      return done(err, false);
    }

    if (!user) {
      return done(null, false);
    }

    return done(null, user.getPublicFields());
  });
})));
