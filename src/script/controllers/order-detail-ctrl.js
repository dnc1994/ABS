/**
 * Order Detail Controller
 */

angular.module('ABS')
    .controller('OrderDetailCtrl', ['$scope', OrderDetailCtrl]);

function OrderDetailCtrl($scope) {
    api.order.data($scope.state.order_id, function (data) {
        if (data.length) {
            $scope.order = data[0];
            api.book.data($scope.order.isbn, function (data) {
                if (data.length)
                    $scope.book = data[0];
                else
                    $scope.book = {};
            });
        }
        else {
        }
    });

    // $scope.state;
    $scope.goBack = function () {
        window.history.back();
    };

    // Functions
    $scope.pay = function () {
        api.order.pay($scope.order.order_id, function (status) {
            if (status == 'OK')
                $scope.order.payment_status = 1;
        });
    };

    $scope.onShelf = function () {
        api.order.puton($scope.order.order_id, function (status) {
            if (status == 'OK')
                $scope.order.payment_status = 2;
        });
    };

    $scope.cancel = function () {
        api.order.delete($scope.order.order_id, function (status) {
            if (status == 'OK')
                $scope.goBack();
        });
    }
}
