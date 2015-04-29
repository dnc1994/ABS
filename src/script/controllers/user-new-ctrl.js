/**
 * Created by shuding on 4/29/15.
 * <ds303077135@gmail.com>
 */
/**
 * Book New Controller
 */

angular.module('ABS')
    .controller('UserNewCtrl', ['$scope', '$location', UserNewCtrl]);

function UserNewCtrl($scope, $location) {
    $scope.user = {
        password: '',
        user_name: '',
        realname: '',
        work_id: '',
        gender: '',
        age: ''
    };
    $scope.error = {
        password: '',
        user_name: '',
        realname: '',
        work_id: '',
        gender: '',
        age: ''
    };
    //$scope.state;
    $scope.goBack = function () {
        window.history.back();
    };

    $scope.add = function () {
        var hasError = 0;

        if (!$scope.user.user_name.length) {
            $scope.error.user_name = 'has-error';
            hasError = 1;
        }
        else
            $scope.error.user_name = '';

        if ($scope.user.password.length < 8) {
            $scope.error.password = 'has-error';
            hasError = 1;
        }
        else
            $scope.error.password = '';

        if (!$scope.user.realname.length) {
            $scope.error.realname = 'has-error';
            hasError = 1;
        }
        else
            $scope.error.realname = '';

        $scope.user.work_id = +$scope.user.work_id || '';
        if ($scope.user.work_id <= 0) {
            $scope.error.work_id = 'has-error';
            hasError = 1;
        }
        else
            $scope.error.work_id = '';

        $scope.user.age = +$scope.user.age || '';
        if ($scope.user.age <= 0) {
            $scope.error.age = 'has-error';
            hasError = 1;
        }
        else
            $scope.error.age = '';

        if (!$scope.user.gender.length) {
            $scope.error.gender = 'has-error';
            hasError = 1;
        }
        else
            $scope.error.gender = '';

        if (!hasError) {
            api.user.new($scope.user, function (data) {

            });
        }
    };
}
