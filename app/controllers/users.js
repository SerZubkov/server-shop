/* eslint-disable consistent-return */
/**
 * Module dependencies.
 */
const mongoose = require('mongoose');
const only = require('only');
const _ = require('lodash');
const sendEmail = require('../libs/sendMail');

const User = require('../models/user');

/**
 * find by Id
 */

exports.findById = async (ctx, next) => {
  const id = ctx.params.userById;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    ctx.throw(404, 'Invalid Report id');
  }
  ctx.userById = await User.findById(id);

  if (!ctx.userById) {
    ctx.throw(404, 'Not found user');
  }
  await next();
};

/**
 * find by email
 */

exports.findByEmail = async (ctx, next) => {
  try {
    const user = await User.findOne(only(ctx.request.body, 'email'));
    ctx.body = user.getPublicFields();
  } catch (e) {
    ctx.throw(404, 'Not found user');
  }
  await next();
};
/**
 * find by id
 */

exports.findByIdReturn = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return;
  }
  const user = await User.findById(id);
  if (!user) {
    return;
  }
  return only(user, 'id name  email');
};


/**
 * Create an user
 */

exports.create = async (ctx) => {
  const user = await User.create(only(ctx.request.body, 'name surname email age gender password'));
  ctx.body = user.getPublicFields();

  await sendEmail({
    template: 'hello',
    subject: 'Привет',
    to: 'stalkerky@gmail.com',
    name: 'Sergey',
  });
};


/**
 * Get all users
 */

exports.getAllUsers = async (ctx) => {
  const users = await User.find({});
  ctx.body = users.map(item => _.pick(item, User.publicFields));
};


/**
 * Get one user by id
 */

exports.getOneUser = async (ctx) => {
  ctx.body = ctx.userById.getPublicFields();
};


/**
 * Update user
 */

exports.update = async (ctx) => {
  await ctx.userById.set(_.pick(ctx.request.body, User.publicFields)).save();
  ctx.body = ctx.userById.getPublicFields();
};


/**
 * Delete user
 */

exports.delete = async (ctx) => {
  await ctx.userById.remove();
  ctx.status = 200;
};
