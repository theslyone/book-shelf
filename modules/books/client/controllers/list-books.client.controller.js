(function () {
  'use strict';

  angular
    .module('books')
    .controller('BooksListController', BooksListController);

  BooksListController.$inject = ['$scope', '$state', '$window', 'Authentication', 'bookResolve', 'BooksService', '_'];

  function BooksListController($scope, $state, $window, Authentication, book, BooksService, _) {
    var vm = this;
    vm.colors = ['blue', 'green', 'umber', 'springer'];
    vm.remoteSearch = '/api/books/search/{query}';
    vm.authentication = Authentication;
    vm.book = book;
    vm.books = [];
    vm.allbooks = 0;
    vm.error = null;
    vm.form = {};
    vm.removeBook = removeBook;
    vm.saveBook = saveBook;
    vm.tiltBook = tiltBook;

    vm.updateBooks = updateBooks;
    vm.requestTrade = requestTrade;
    vm.acceptTrade = acceptTrade;
    vm.rejectTrade = rejectTrade;
    vm.book.pendingApproval = function(){
      return _.find(vm.book.requests, { 'status': '' });
    };

    function removeBook() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.book.$remove($state.go('books.list'));
      }
    }

    function saveBook(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.bookForm');
        return false;
      }
      if(vm.authentication.user){
        vm.book.$save(successCallback, errorCallback);
      }
      else{
        $state.go('authentication.signin');
      }

      function successCallback(res) {
        $state.go('books.list');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function tiltBook(idx){
      var no = Math.floor((Math.random() * 20));
      //console.log(no % 2);
      return no % 2 > 0;
    }

    function updateBooks(){
      vm.books = BooksService.query({ all: vm.allbooks });
    }

    function requestTrade(){
      if(vm.authentication.user){
        book.requests.push({ user: vm.authentication.user });
        vm.book.$update(successCallback, errorCallback);
      }
      else{
        $state.go('authentication.signin');
      }

      function successCallback(res) {
        vm.success = "Request sent";
        vm.book.requested = true;
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function acceptTrade(){
      //TODO: user trade request based approval
      book.requests.forEach(function(request){
        request.status = "Trade Request Accepted";
      });
      vm.book.$update(successCallback, errorCallback);

      function successCallback(res) {
        vm.success = "Request accepted";
        vm.book.isCurrentUserOwner = true;
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function rejectTrade(){
      //TODO: user trade request based rejection
      book.requests.forEach(function(request){
        request.status = "Trade Request Rejected";
      });
      vm.book.$update(successCallback, errorCallback);

      function successCallback(res) {
        vm.success = "Request rejected";
        vm.book.isCurrentUserOwner = true;
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
