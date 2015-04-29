/**
 * Book Detail Controller
 */

angular.module('ABS')
    .controller('BookDetailCtrl', ['$scope', BookDetailCtrl]);

function BookDetailCtrl($scope) {
    api.book.data($scope.state.isbn, function (data) {
        if (data.length) {
            $scope.book = data[0];
        }
        else {

        }
    });

    //$scope.state;
    $scope.goBack = function () {
        window.history.back();
    };
}
