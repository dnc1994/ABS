/**
 * Book New Controller
 */

angular.module('ABS')
    .controller('OrderNewCtrl', ['$scope', '$location', OrderNewCtrl]);

function OrderNewCtrl($scope, $location) {
    $scope.book = {
        isbn: '',
        title: '',
        author: '',
        retail_price: '',
        publisher: ''
    };
    $scope.order = {
        order_price: '',
        order_amount: ''
    };
    $scope.error = {
        isbn: '',
        title: '',
        author: '',
        retail_price: '',
        publisher: '',
        order_price: '',
        order_amount: ''
    };

    // Disable editing with book information
    $scope.lock = false;

    // $scope.state;
    $scope.goBack = function () {
        window.history.back();
    };

    $scope.isbnChange = function () {
        $scope.book.isbn = +$scope.book.isbn || '';
        if ($scope.book.isbn)
            api.book.data($scope.book.isbn, function (data) {
                console.log(data);
                if (data.length) {
                    $scope.lock = true;
                    for (var prop in data[0])
                        if (data[0].hasOwnProperty(prop))
                            $scope.book[prop] = data[0][prop];
                }
                else if ($scope.lock) {
                    $scope.lock = false;
                    for (var prop in $scope.book)
                        if ($scope.book.hasOwnProperty(prop) && prop != 'isbn')
                            $scope.book[prop] = '';
                }
            });
        else if ($scope.lock) {
            $scope.lock = false;
            for (var prop in $scope.book)
                if ($scope.book.hasOwnProperty(prop) && prop != 'isbn')
                    $scope.book[prop] = '';
        }
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
        if ($scope.book.retail_price <= 0 || !$scope.book.retail_price) {
            $scope.error.retail_price = 'has-error';
            hasError = 1;
        }
        else
            $scope.error.retail_price = '';

        console.log($scope.order);
        $scope.order.order_price = +$scope.order.order_price || '';
        if ($scope.order.order_price < 0 || !$scope.order.order_price) {
            $scope.error.order_price = 'has-error';
        }
        else
            $scope.error.order_price = '';

        $scope.order.order_amount = +$scope.order.order_amount || '';
        if ($scope.order.order_amount < 0 || !$scope.order.order_amount) {
            $scope.error.order_amount = 'has-error';
        }
        else
            $scope.error.order_amount = '';

        if (!hasError) {
            var orderdata = {
                isbn: $scope.book.isbn,
                order_time: (new Date()).getTime(),
                order_price: $scope.order.order_price,
                order_amount: $scope.order.order_amount,
                order_status: 0
            };
            if ($scope.lock) {
                // Already have this book
                api.order.new(orderdata, function (status) {
                    if (status == 'OK')
                        $scope.goBack();
                    else {
                        // Handle ERROR
                    }
                });
            }
            else {
                var bookdata = {
                    isbn: $scope.book.isbn,
                    title: $scope.book.title,
                    author: $scope.book.author,
                    publisher: $scope.book.publisher,
                    retail_price: $scope.book.retail_price,
                    stock: 0
                };
                api.book.new(bookdata, function (status) {
                    if (status == 'OK') {
                        api.order.new(orderdata, function (status) {
                            if (status == 'OK')
                                $scope.goBack();
                            else {
                                // Handle ERROR
                            }
                        });
                    }
                    else {
                        // Handle ERROR
                    }
                });
            }
        }
    };
}
