/* eslint-disable no-unused-vars */
/**
 * Module dependencies.
 */
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('config');
const uuid = require('uuid/v4');
const only = require('only');

const Token = require('../models/tokens');

/**
 * Create token for User
 */

exports.addToken = async (payload) => {
  const refreshToken = uuid();
  const token = jwt.sign(payload, config.jwtSecret, { expiresIn: config.expiresIn });
  await Token.create({
    user: payload.id,
    refreshToken,
  });

  return {
    user: payload.name,
    type: 'Bearer',
    refreshToken,
    token,
  };
};

/**
 * Find token
 */

exports.findByToken = async (token) => {
  const refreshToken = await Token.findOne({ refreshToken: token });
  return only(refreshToken, 'id refreshToken user');
};

/**
 * Remove token
 */

exports.removeToken = async (ctx, id) => {
  const res = await Token.findOneAndDelete(id);
  return res;
};
