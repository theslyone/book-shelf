'use strict';

var request=require('request');

exports.searchBook = function(text, callback){
  request({ uri:'http://it-ebooks-api.info/v1/search/'+text+'', method:'GET' },
  function(err,response,body){
    if(err){
      callback(err);
    }
    else{
      var booksReponse = JSON.parse(body);
      callback(null, booksReponse.Books);
    }
  });
};
