/**
 * Book New Controller
 */

angular.module('ABS')
    .controller('BookNewCtrl', ['$scope', '$location', BookNewCtrl]);

function BookNewCtrl($scope, $location) {
    $scope.book = {
        isbn: '',
        title: '',
        author: '',
        retail_price: '',
        publisher: '',
        stock: 0
    };
    $scope.error = {
        isbn: '',
        title: '',
        author: '',
        retail_price: '',
        publisher: ''
    };
    //$scope.state;
    $scope.goBack = function () {
        window.history.back();
    };

    $scope.add = function () {
        var hasError = 0;

        $scope.book.isbn = +$scope.book.isbn || '';
        if (!Number.isSafeInteger($scope.book.isbn) ||
            $scope.book.isbn < 1) {
            $scope.error.isbn = 'has-error';
            hasError = 1;
        }
        else
            $scope.error.isbn = '';

        if (!$scope.book.title.length) {
            $scope.error.title = 'has-error';
            hasError = 1;
        }
        else
            $scope.error.title = '';

        if (!$scope.book.author.length) {
            $scope.error.author = 'has-error';
            hasError = 1;
        }
        else
            $scope.error.author = '';

        if (!$scope.book.publisher.length) {
            $scope.error.publisher = 'has-error';
            hasError = 1;
        }
        else
            $scope.error.publisher = '';

        $scope.book.retail_price = +$scope.book.retail_price || '';
        if ($scope.book.retail_price <= 0) {
            $scope.error.retail_price = 'has-error';
            hasError = 1;
        }
        else
            $scope.error.retail_price = '';

        if (!hasError) {
            api.book.new($scope.book, function (data) {

            });
        }
    };
}
