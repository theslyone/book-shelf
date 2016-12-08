(function () {
  'use strict';

  angular
    .module('books')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'All Books',
      state: 'books.list',
      roles: ['*']
    });
    
    /*menuService.addMenuItem('topbar', {
      title: 'Books',
      state: 'books',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'books', {
      title: 'All Books',
      state: 'books.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'books', {
      title: 'My Books',
      state: 'books.my-books',
      roles: ['user']
    });*/
  }
}());
