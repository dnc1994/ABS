/**
 * Book Search Controller
 */

angular.module('ABS')
    .controller('BookSearchCtrl', ['$scope', '$location', BookSearchCtrl]);

function BookSearchCtrl($scope, $location) {
    $scope.books = {
        keywords: '',
        result: [],
        raw: []
    };

    api.book.all(function (data) {
        $scope.books.raw = data;
        $scope.books.result = data;
        $scope.$apply();
    });

    $scope.keywordsChange = function () {
        if ($scope.books.keywords.length) {
            $location.search('q', $scope.books.keywords);
            var keywordsList = $scope.books.keywords.toUpperCase().trim().split(' ');
            $scope.books.result = [];
            $scope.books.raw.forEach(function (book) {
                var str = JSON.stringify(book).toUpperCase();
                book.rank = 0;
                keywordsList.forEach(function (keyword) {
                    if (str.indexOf(keyword) !== -1)
                        book.rank++;
                });
                if (book.rank > 0)
                    $scope.books.result.push(book);
            });
            $scope.$apply();
        }
        else {
            $location.search('q', null);
            api.book.all(function (data) {
                $scope.books.raw = data;
                $scope.books.result = data;
                $scope.$apply();
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
