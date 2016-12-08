'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Book = mongoose.model('Book'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  itBooks = require('../search/it-ebooks');

exports.search = function(req, res){
  itBooks.searchBook(req.params.query, function(err, books){
    if(err){
      res.jsonp([]);
    }
    else{
      var response = { results: [] };

      if(books instanceof Array){
        var booksMap = books.map(function(book){
          return { id: book.ID, title: book.Title, isbn: book.isbn, image: book.Image, description: book.Description };
        });
        response = { results: booksMap };
        //console.log(JSON.stringify(response, null, 4));
      }
      res.jsonp(response);
    }
  });
};

/**
 * Create a Book
 */
exports.create = function(req, res) {
  //console.log(JSON.stringify(req.body, null, 4));
  var book = new Book(req.body);
  book.id = req.body.search.id;
  book.title = req.body.search.title;
  book.isbn = req.body.search.isbn;
  book.image = req.body.search.image;
  book.description = req.body.search.description;
  book.color = req.body.color || 'blue';

  book.user = req.user;
  //console.log(JSON.stringify(book, null, 4));

  book.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(book);
    }
  });
};

/**
 * Show the current Book
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var book = req.book ? req.book.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  book.isCurrentUserOwner = req.user && book.user && book.user._id.toString() === req.user._id.toString();

  res.jsonp(book);
};

/**
 * Update a Book
 */
exports.update = function(req, res) {
  var book = req.book;

  book = _.extend(book, req.body);

  book.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(book);
    }
  });
};

/**
 * Delete an Book
 */
exports.delete = function(req, res) {
  var book = req.book;

  book.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(book);
    }
  });
};

/**
 * List of Books
 */
exports.list = function(req, res) {
  var bookQuery = Book.find();
  if(req.query.all){
    var allBooks = JSON.parse(req.query.all);
    console.log(allBooks);
    if(!allBooks){
      bookQuery.where('user').equals(req.user);
      console.log("book query where user id = " + req.user._id);
    }
  }
  bookQuery.sort('-created').populate('user', 'displayName').exec(function(err, books) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(books);
    }
  });
};

/**
 * Book middleware
 */
exports.bookByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Book is invalid'
    });
  }

  Book.findById(id).populate('user', 'displayName').exec(function (err, book) {
    if (err) {
      return next(err);
    } else if (!book) {
      return res.status(404).send({
        message: 'No Book with that identifier has been found'
      });
    }
    req.book = book;
    next();
  });
};
