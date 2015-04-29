/**
 * Created by shuding on 4/29/15.
 * <ds303077135@gmail.com>
 */

angular.module('ABS')
    .filter('sum', function() {
        return function(input, prop) {
            var sum = 0;
            for (var i = 0; i < input.length; ++i)
                sum += +(input[i][prop] || 0);
            return sum;
        };
    });