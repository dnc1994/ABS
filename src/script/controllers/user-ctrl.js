/**
 * Created by shuding on 4/29/15.
 * <ds303077135@gmail.com>
 */
angular.module('ABS')
    .controller('UserCtrl', ['$scope', UserCtrl]);

function UserCtrl($scope) {
    $scope.users = [];

    api.user.all(function (data) {
        $scope.user = data;
    });
}