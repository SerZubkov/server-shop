const passport = require('koa-passport');
const LocalStrategy = require('passport-local');

const User = require('../../models/user');

// Стратегия берёт поля из req.body
// Вызывает для них функцию
passport.use(new LocalStrategy({
  usernameField: 'email', // 'username' by default
  passwordField: 'password',
  passReqToCallback: true, // all strategies support ctx: req for more complex cases
},
((req, email, password, done) => {
  User.findOne({ email }, (err, user) => {
    if (err) {
      return done(err);
    }

    if (!user || !user.checkPassword(password)) {
      return done(null, false, { message: 'Нет такого пользователя или пароль неверен.' });
    }

    return done(null, user);
  });
})));
