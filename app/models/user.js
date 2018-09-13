/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const crypto = require('crypto');
const config = require('config');

const { Schema } = mongoose;

/**
 * Users Schema
 */

const UserSchema = new Schema({
  name: {
    type: String,
    required: 'Укажите имя',
  },
  surname: {
    type: String,
    required: 'Укажите фамилию',
  },
  email: {
    type: String,
    unique: true,
    required: 'E-mail пользователя не должен быть пустым.',
    validate: [
      {
        validator: value => /^[-._a-z0-9]+@(?:[a-z0-9][-a-z0-9]+\.)+[a-z]{2,6}$/.test(value),
        msg: 'Укажите, пожайлуста корректный email!',
      },
    ],
    lowercase: true,
    trim: true,
  },
  age: Number,
  gender: {
    type: String,
    enum: ['M', 'D'],
    default: 'M',
  },
  passwordHash: {
    type: String,
    required: true,
  },
  salt: {
    required: true,
    type: String,
  },
}, {
  timestamps: true,
});

UserSchema.statics.publicFields = ['name', 'surname', 'email', 'age', 'gender', 'id'];

UserSchema.methods.getPublicFields = function () {
  return {
    name: this.name,
    email: this.email,
    surname: this.surname,
    age: this.age,
    gender: this.gender,
    id: this.id,
  };
};

UserSchema.virtual('id')
  .get(function () {
    return this._id;
  });

UserSchema.virtual('password')
  .set(function (password) {
    if (password !== undefined) {
      if (password.length < 4) {
        this.invalidate('password', 'Пароль должен быть минимум 4 символа.');
      }
    }

    this._plainPassword = password;

    if (password) {
      this.salt = crypto.randomBytes(config.crypto.hash.length).toString('base64');
      this.passwordHash = crypto.pbkdf2Sync(
        password,
        Buffer.from(this.salt, 'binary'),
        config.crypto.hash.iterations,
        config.crypto.hash.length,
        'sha256',
      ).toString('base64');
    } else {
      // remove password (unable to login w/ password any more, but can use providers)
      this.salt = undefined;
      this.passwordHash = undefined;
    }
  })
  .get(function () {
    return this._plainPassword;
  });

UserSchema.methods.checkPassword = function (password) {
  // empty password means no login by password
  if (!password) return false;
  // this user does not have password (the line below would hang!)
  if (!this.passwordHash) return false;

  return crypto.pbkdf2Sync(
    password,
    Buffer.from(this.salt, 'binary'),
    config.crypto.hash.iterations,
    config.crypto.hash.length,
    'sha256',
  ).toString('base64') === this.passwordHash;
};

module.exports = mongoose.model('User', UserSchema);
