/**
 * Created by shuding on 4/26/15.
 * <ds303077135@gmail.com>
 */

// Data for demo

var hostname = "http://10.147.106.43:4000/";
var cookie = document.cookie.indexOf('client=true') >= 0 ? 'ok' : '';

window.api = {
    user: {
        i: function (callback) {
            $.get(hostname + 'user/i', {}, function (i) {
                var data = JSON.parse(i);
                callback && callback(data);
            }).error(function () {
                cookie = '';
                window.location.hash = '#/login';
            });
        },
        logout: function (callback) {
            $.get(hostname + 'user/logout', {}, function (data) {
                if (data == 'OK') {
                    cookie = '';
                    window.location.hash = '#/';
                }
                callback && callback(data);
            });
        },
        login: function (username, password, callback) {
            $.post(hostname + 'user/login', JSON.stringify({
                username: username,
                password: password
            }), function (data) {
                if (data == 'OK') {
                    cookie = 'ok';
                    window.location.hash = '#/';
                }
                callback && callback(data);
            });
        },
        new: function (userdata, callback) {
            if (!cookie) {
                window.location.hash = '#/login';
                return;
            }
            var postObj = angular.copy(userdata);
            postObj.work_id = '' + postObj.work_id;
            postObj.gender = postObj.gender == 'Male' ? 1 : 0;
            $.post(hostname + 'user/new', JSON.stringify(postObj), function (data) {
                callback && callback(data);
            });
        },
        delete: function (user_id, callback) {
            if (!cookie) {
                window.location.hash = '#/login';
                return;
            }
            $.post(hostname + 'user/delete', user_id, function (data) {
                callback && callback(data);
            });
        },
        all: function (callback) {
            if (!cookie) {
                window.location.hash = '#/login';
                return;
            }
            $.get(hostname + 'user/all', {}, function (users) {
                callback && callback(JSON.parse(users));
            });
        }
    },
    book: {
        all: function (callback) {
            if (!cookie) {
                window.location.hash = '#/login';
                return;
            }
            $.get(hostname + 'book/all', {}, function (books) {
                callback && callback(JSON.parse(books));
            }).error(function () {
                cookie = '';
                window.location.hash = '#/login';
            });
        },
        search: function (keywords, callback) {
            if (!cookie) {
                window.location.hash = '#/login';
                return;
            }
            var ret = [];
            callback && callback(ret);
        },
        data: function (isbn, callback) {
            if (!cookie) {
                window.location.hash = '#/login';
                return;
            }
            $.get(hostname + 'book/data/' + isbn, {}, function (data) {
                callback && callback(JSON.parse(data));
            });
        },
        new: function (bookdata, callback) {
            if (!cookie) {
                window.location.hash = '#/login';
                return;
            }
            $.post(hostname + 'book/new', JSON.stringify(bookdata), function (data) {
                callback && callback(data);
            });
        },
        delete: function (isbn, callback) {
            if (!cookie) {
                window.location.hash = '#/login';
                return;
            }
            $.post(hostname + 'book/delete', JSON.stringify({
                isbn: isbn
            }), function (data) {
                callback && callback(data);
            });
        },
        update: function (isbn, bookdata, callback) {
            if (!cookie) {
                window.location.hash = '#/login';
                return;
            }
            var objData = angular.copy(bookdata);
            objData.isbn = '' + isbn;
            $.post(hostname + 'book/update', JSON.stringify(objData), function (data) {
                callback && callback(data);
            });
        },
        sell: function (isbn, amount, callback) {
            if (!cookie) {
                window.location.hash = '#/login';
                return;
            }
            $.post(hostname + 'book/new', JSON.stringify({
                isbn: isbn,
                amount: amount
            }), function (data) {
                callback && callback(data);
            });
        }
    },
    order: {
        all: function (callback) {
            if (!cookie) {
                window.location.hash = '#/login';
                return;
            }
            $.get(hostname + 'order/all', {}, function (data) {
                callback && callback(JSON.parse(data));
            });
        },
        data: function (order_id, callback) {
            if (!cookie) {
                window.location.hash = '#/login';
                return;
            }
            $.get(hostname + 'order/data/' + order_id, {}, function (data) {
                callback && callback(JSON.parse(data));
            });
        },
        new: function (orderdata, callback) {
            if (!cookie) {
                window.location.hash = '#/login';
                return;
            }
            $.post(hostname + 'order/new', JSON.stringify(orderdata), function (data) {
                callback && callback(data);
            });
        },
        pay: function (order_id, callback) {
            if (!cookie) {
                window.location.hash = '#/login';
                return;
            }
            $.post(hostname + 'order/pay', JSON.stringify({
                order_id: order_id
            }), function (data) {
                callback && callback(data);
            });
        },
        puton: function (order_id, callback) {
            if (!cookie) {
                window.location.hash = '#/login';
                return;
            }
            $.post(hostname + 'order/puton', JSON.stringify({
                order_id: order_id
            }), function (data) {
                callback && callback(data);
            });
        },
        delete: function (order_id, callback) {
            if (!cookie) {
                window.location.hash = '#/login';
                return;
            }
            $.post(hostname + 'order/delete', JSON.stringify({
                order_id: order_id
            }), function (data) {
                callback && callback(data);
            });
        }
    },
    bill: function (start_time, end_time, callback) {
        if (!cookie) {
            window.location.hash = '#/login';
            return;
        }
        $.post(hostname + 'bill', JSON.stringify({
            start_time: start_time,
            end_time: end_time
        }), function (data) {
            data = data || '[]';
            callback && callback(JSON.parse(data));
        });
    }
};
