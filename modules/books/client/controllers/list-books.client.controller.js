(function () {
  'use strict';

  angular
    .module('books')
    .controller('BooksListController', BooksListController);

  BooksListController.$inject = ['$scope', '$state', '$window', 'Authentication', 'bookResolve', 'BooksService'];

  function BooksListController($scope, $state, $window, Authentication, book, BooksService) {
    var vm = this;
    vm.colors = ['blue', 'green', 'umber', 'springer'];
    vm.remoteSearch = '/api/books/search/{query}';
    vm.authentication = Authentication;
    vm.book = book;
    vm.books = [];
    vm.allbooks = true;
    vm.error = null;
    vm.form = {};
    vm.remove = removeBook;
    vm.save = saveBook;
    vm.tilt = tiltBook;

    vm.updateBooks = updateBooks;

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
      console.log(vm.book);
      vm.book.$save(successCallback, errorCallback);

      function successCallback(res) {
        vm.updateBooks();
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
      console.log("Updating books: " + vm.allbooks);
      vm.books = BooksService.query({ all: vm.allbooks });
    }
  }
}());
