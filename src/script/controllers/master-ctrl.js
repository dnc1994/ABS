/**
 * Master Controller
 */

angular.module('ABS')
    .controller('MasterCtrl', ['$scope', '$cookieStore', '$location', '$rootScope', '$translate', MasterCtrl]);

function MasterCtrl($scope, $cookieStore, $location, $rootScope, $translate) {
    $rootScope.me = {};
    $rootScope.login = {};
    api.user.i(function (data) {
        if (data.length) {
            $rootScope.me = data[0];
            if (!$rootScope.me.user_type) {
                $scope.sidebarLists.push(['#/users', 'Admin', 'users']);
            }
        } else
            $location.path('#/login');
    });

    $rootScope.signin = function () {
        api.user.login($rootScope.login.username, $rootScope.login.password, function (status) {
            if (status == 'OK') {
                api.user.i(function (data) {
                    if (data.length) {
                        $rootScope.me = data[0];
                        $cookieStore.put('client', true);
                    } else
                        $location.path('#/login');
                    $scope.$apply();
                });
            }
        });
    };

    $rootScope.logout = function () {
        api.user.logout(function (status) {
            if (status == 'OK') {
                $cookieStore.put('client', false);
            }
        });
    };

    $rootScope.changeLang = function (lang) {
        $translate.use(lang);
    };

    // Sidebar data
    $scope.sidebarLists = [
        // ['#/', 'Status', 'tachometer'],
        ['#/books', 'Books', 'book'],
        ['#/orders', 'Orders', 'credit-card'],
        ['#/bills', 'Bills', 'table']
    ];

    $scope.getClass = function (path) {
        if ($location.path().substr(0, path.length - 1) == path.slice(1))
            return 'active';
        return '';
    };

    $rootScope.getCurrentView = function () {
        return ($location.path().split('/')[1] || 'home').toUpperCase();
    };

    /**
     * Sidebar Toggle & Cookie Control
     */
    var mobileView = 992;

    $scope.getWidth = function() {
        return window.innerWidth;
    };

    $scope.$watch($scope.getWidth, function(newValue, oldValue) {
        if (newValue >= mobileView) {
            if (angular.isDefined($cookieStore.get('toggle'))) {
                $scope.toggle = ! $cookieStore.get('toggle') ? false : true;
            } else {
                $scope.toggle = true;
            }
        } else {
            $scope.toggle = false;
        }

    });

    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
        $cookieStore.put('toggle', $scope.toggle);
    };

    window.onresize = function() {
        $scope.$apply();
    };
}
