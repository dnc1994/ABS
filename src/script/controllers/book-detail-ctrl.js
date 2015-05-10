/**
 * Book Detail Controller
 */

angular.module('ABS')
    .controller('BookDetailCtrl', ['$scope', BookDetailCtrl]);

function BookDetailCtrl($scope) {
    $scope.sellData = {
        amount: ''
    };

    api.book.data($scope.state.isbn, function (data) {
        if (data.length) {
            $scope.book = data[0];
            $scope.$apply();
        }
        else {

        }
    });

    //$scope.state;
    $scope.goBack = function () {
        window.history.back();
    };

    $scope.sell = function () {
        var amount = parseInt($scope.sellData.amount);

        if (amount > 0) {
            api.book.sell($scope.state.isbn, amount, function (data) {
                if (data == 'OK') {
                    alert('OK');
                    window.location.reload();
                }
            });
        }
    };
}
