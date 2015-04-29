/**
 * Order Search Controller
 */

angular.module('ABS')
    .controller('OrderSearchCtrl', ['$scope', '$location', '$filter', OrderSearchCtrl]);

function OrderSearchCtrl($scope, $location, $filter) {
    $scope.orders = {
        show: [],
        all: [],
        filter: [true, true, true],
        keywords: '',
        // Search by isbn
        isbn: $location.search().isbn || ''
    };

    api.order.all(function (data) {
        $scope.orders.all = data;
        $scope.orders.show = data;
    });

    $scope.filterChange = function () {
        var filters = [
            $scope.orders.filter[0] ? 0 : -1,
            $scope.orders.filter[1] ? 1 : -1,
            $scope.orders.filter[2] ? 2 : -1
        ];

        $scope.orders.show = [];
        $scope.orders.all.forEach(function (order) {
            if (filters.indexOf(order.payment_status) != -1)
                $scope.orders.show.push(order);
        });
    };

    $scope.$watch(function(){
        return $location.search().isbn;
    }, function(){
        $scope.orders.isbn = $location.search().isbn || '';
    });
}
