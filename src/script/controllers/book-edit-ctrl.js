/**
 * Created by shuding on 4/29/15.
 * <ds303077135@gmail.com>
 */
/**
 * Book Edit Controller
 */

angular.module('ABS')
    .controller('BookEditCtrl', ['$scope', '$location', BookEditCtrl]);

function BookEditCtrl($scope, $location) {
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
    // Fetch book data
    api.book.data($scope.state.isbn, function (data) {
        if (data.length)
            $scope.book = data[0];
        else {
            // Handle error
        }
    });

    //$scope.state;
    $scope.goBack = function () {
        window.history.back();
    };

    $scope.update = function () {
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
            // Update must with the original isbn
            api.book.update($scope.state.isbn, $scope.book, function (data) {
                if (data == 'OK') {
                    // Update succ
                }
                else {
                    // Handle error
                }
            });
        }
    };
}
