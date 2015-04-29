/**
 * Bill Controller
 */

angular.module('ABS')
    .controller('BillCtrl', ['$scope', '$location', '$translate', BillCtrl]);

function BillCtrl($scope, $location, $translate) {
    $scope.bill = [];

    // Stuff with charts
    $scope.chartOutgoing = {};
    $scope.chartOutgoing.labels = [];
    $scope.chartOutgoing.series = ['Outgoing'];
    $scope.chartOutgoing.data = [[]];
    $scope.chartIncome = {};
    $scope.chartIncome.labels = [];
    $scope.chartIncome.series = ['Income'];
    $scope.chartIncome.data = [[]];
    $scope.chartTotal = {};
    $scope.chartTotal.labels = [];
    $scope.chartTotal.series = ['Income', 'Outgoing'];
    $scope.chartTotal.data = [[], []];

    // Query
    $scope.query = function (start_time, end_time) {
        api.bill(start_time, end_time, function (data) {
            $scope.bill = data;

            $scope.chartOutgoing.labels = [];
            $scope.chartOutgoing.data = [[]];
            $scope.bill.forEach(function (bill) {
                if (bill.type == 'outgoings') {
                    $scope.chartOutgoing.labels.push((new Date(+bill.time)).toJSON().split('T')[0]);
                    $scope.chartOutgoing.data[0].push(bill.out_total);
                    $scope.chartTotal.labels.push((new Date(+bill.time)).toJSON().split('T')[0]);
                    $scope.chartTotal.data[1].push(bill.out_total);
                    $scope.chartTotal.data[0].push(null);
                }
                else if (bill.type == 'incomes') {
                    $scope.chartIncome.labels.push((new Date(+bill.time)).toJSON().split('T')[0]);
                    $scope.chartIncome.data[0].push(bill.in_total);
                    $scope.chartTotal.labels.push((new Date(+bill.time)).toJSON().split('T')[0]);
                    $scope.chartTotal.data[0].push(bill.in_total);
                    $scope.chartTotal.data[1].push(null);
                }
            });

            /*
             Instead of

             $location.search({
             'from': start_time,
             'to': end_time
             });

             , two unique statement will keep the `v` param from overwrite
             */
            $location.search('from', start_time);
            $location.search('to', end_time);

            // Hack the non-HTML5-mode bug
            window.location.hash = '#' + $location.$$url;
        });
    };

    var search = $location.search();

    // Split view
    $scope.view = {
        splitView: !search.v
    };
    $scope.viewChange = function () {
        $location.search('v', $scope.view.splitView ? null : true);
    };

    $scope.sort = {
        incomeSortMethod: false,
        outgoingSortMethod: false,
        incomeSortBy: '-time',
        outgoingSortBy: '-time'
    };
    $scope.changeSortMethod = function () {
        $scope.sort.incomeSortBy = $scope.sort.incomeSortMethod ? '-in_total' : '-time';
        $scope.sort.outgoingSortBy = $scope.sort.outgoingSortMethod ? '-out_total' : '-time';
    };

    // Stuff with the datepicker, a closure
    ;(function () {
        var datePicker = jQuery('#reportrange');

        if (search.from && search.to) {
            datePicker.find('span').html(search.from.replace(/-/g, '/') + ' - ' + search.to.replace(/-/g, '/'));
            $scope.query(search.from, search.to); // Init state
        }
        else {
            datePicker.find('span').html(moment().subtract(29, 'days').format('YYYY/MM/D') + ' - ' + moment().format('YYYY/MM/D'));
            $scope.query(moment().subtract(29, 'days').format('YYYY-MM-D'), moment().format('YYYY-MM-D'));
        }

        var rangesTranslate = [
            $translate.instant('Today'),
            [moment(), moment()],
            $translate.instant('Yesterday'),
            [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            $translate.instant('Last 7 Days'),
            [moment().subtract(6, 'days'), moment()],
            $translate.instant('Last 30 Days'),
            [moment().subtract(29, 'days'), moment()],
            $translate.instant('This Month'),
            [moment().startOf('month'), moment().endOf('month')],
            $translate.instant('Last Month'),
            [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        ];
        var rangesObj = {};
        for (var i = 0; i < rangesTranslate.length; i += 2)
            rangesObj[rangesTranslate[i]] = rangesTranslate[i + 1];

        datePicker.daterangepicker({
            format: 'YYYY/MM/D',
            startDate: moment().subtract(29, 'days'),
            endDate: moment(),
            minDate: '2011/10/5',
            maxDate: '2015/12/31',
            dateLimit: { days: 60 },
            showDropdowns: false,
            showWeekNumbers: true,
            timePicker: false,
            timePickerIncrement: 1,
            timePicker12Hour: true,
            ranges: rangesObj,
            opens: 'right',
            drops: 'down',
            buttonClasses: ['btn', 'btn-sm'],
            applyClass: 'btn-primary',
            cancelClass: 'btn-default',
            separator: ' to ',
            locale: {
                applyLabel: $translate.instant('OK'),
                cancelLabel: $translate.instant('Cancel'),
                fromLabel: $translate.instant('From'),
                toLabel: $translate.instant('To'),
                customRangeLabel: $translate.instant('Custom'),
                daysOfWeek: [
                    $translate.instant('Su'),
                    $translate.instant('Mo'),
                    $translate.instant('Tu'),
                    $translate.instant('We'),
                    $translate.instant('Th'),
                    $translate.instant('Fr'),
                    $translate.instant('Sa')
                ],
                monthNames: [
                    $translate.instant('January'),
                    $translate.instant('February'),
                    $translate.instant('March'),
                    $translate.instant('April'),
                    $translate.instant('May'),
                    $translate.instant('June'),
                    $translate.instant('July'),
                    $translate.instant('August'),
                    $translate.instant('September'),
                    $translate.instant('October'),
                    $translate.instant('November'),
                    $translate.instant('December')
                ],
                firstDay: 1
            }
        }, function(start, end) {
            $scope.query(start.format('YYYY-MM-D'), end.format('YYYY-MM-D'));
            datePicker.find('span').html(start.format('YYYY/MM/D') + ' - ' + end.format('YYYY/MM/D'));
        });
    })();
}
