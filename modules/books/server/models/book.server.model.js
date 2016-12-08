'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Book Schema
 */
var BookSchema = new Schema({
  id: {
    type: Number,
    trim: true
  },
  title: {
    type: String,
    default: '',
    required: 'Please fill Book title',
    trim: true
  },
  isbn: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    default: 'blue',
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Book', BookSchema);
