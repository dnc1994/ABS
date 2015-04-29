/**
 * Book Search Controller
 */

angular.module('ABS')
    .controller('BookSearchCtrl', ['$scope', '$location', BookSearchCtrl]);

function BookSearchCtrl($scope, $location) {
    $scope.books = {
        keywords: '',
        result: []
    };

    api.book.all(function (data) {
        $scope.books.result = data;
    });

    $scope.keywordsChange = function () {
        if ($scope.books.keywords.length) {
            $location.search('q', $scope.books.keywords);
            api.book.search($scope.books.keywords, function (data) {
                $scope.books.result = data;
            });
        }
        else {
            $location.search('q', null);
            api.book.all(function (data) {
                $scope.books.result = data;
            });
        }
    };

    if ($location.search().q) {
        $scope.books.keywords = $location.search().q;
        $scope.keywordsChange();
    }

    $scope.$watch(function(){
        return $location.search().q;
    }, function(){
        $scope.books.keywords = $location.search().q || '';
        $scope.keywordsChange();
    });
}
