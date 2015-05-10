/**
 * Book Detail Controller
 */

angular.module('ABS')
    .controller('BookDetailCtrl', ['$scope', BookDetailCtrl]);

function BookDetailCtrl($scope) {
    $scope.sellData = {
        amount: ''
    };
    $scope.doubanData = {
        succ: false
    };

    api.book.data($scope.state.isbn, function (data) {
        if (data.length) {
            $scope.book = data[0];
            $scope.$apply();
        }
        else {}
    });

    // Get data via douban API
    $.get('http://api.douban.com/v2/book/isbn/' + $scope.state.isbn, function (data) {
        console.log(data);
        $scope.doubanData.succ = true;
        $scope.doubanData.image = data.image;
        $scope.doubanData.pages = data.pages;
        $scope.doubanData.summary = data.summary;
        $scope.doubanData.keywords = data.tags.map(function (tag) {
            return tag.name;
        }).join(' / ');
        $scope.$apply();
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
