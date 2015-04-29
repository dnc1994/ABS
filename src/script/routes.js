'use strict';

/**
 * Route configuration for the RDash module.
 */
angular
    .module('ABS')
    .config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            // For unmatched routes
            $urlRouterProvider.otherwise('/');

            // Application routes
            $stateProvider
                .state('index', {
                    url: '/',
                    templateUrl: 'templates/books.html'
                })
                .state('login', {
                    url: '/login',
                    templateUrl: 'templates/login.html'
                })
                .state('me', {
                    url: '/me',
                    templateUrl: 'templates/me.html'
                })
                .state('user', {
                    url: '/users',
                    templateUrl: 'templates/admin.html'
                })
                .state('userNew', {
                    url: '/users/new',
                    templateUrl: 'templates/admin-new.html'
                })
                .state('books', {
                    url: '/books',
                    templateUrl: 'templates/books.html'
                })
                .state('book', {
                    url: '/books/{bookId:int}',
                    templateUrl: 'templates/book.html',
                    controller: function ($scope, $stateParams) {
                        $scope.state = {
                            isbn: $stateParams.bookId
                        };
                    }
                })
                .state('bookEdit', {
                    url: '/books/{bookId:int}/edit',
                    templateUrl: 'templates/book-edit.html',
                    controller: function ($scope, $stateParams) {
                        $scope.state = {
                            isbn: $stateParams.bookId
                        };
                    }
                })
                .state('bookNew', {
                    url: '/books/new',
                    templateUrl: 'templates/book-new.html'
                })
                .state('orders', {
                    url: '/orders',
                    templateUrl: 'templates/orders.html'
                })
                .state('order', {
                    url: '/orders/{orderId:int}',
                    templateUrl: 'templates/order.html',
                    controller: function ($scope, $stateParams) {
                        $scope.state = {
                            order_id: $stateParams.orderId
                        };
                    }
                })
                .state('orderNew', {
                    url: '/orders/new',
                    templateUrl: 'templates/order-new.html'
                })
                .state('bills', {
                    url: '/bills',
                    templateUrl: 'templates/bills.html'
                });
        }
    ]);