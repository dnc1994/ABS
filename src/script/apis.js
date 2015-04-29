/**
 * Created by shuding on 4/26/15.
 * <ds303077135@gmail.com>
 */

// Data for demo

var books = [{
    isbn: '9787532739974',
    title: '一九八四',
    author: '乔治·奥威尔 ',
    retail_price: '13.00',
    publisher: '上海译文出版社',
    stock: 2000
}, {
    isbn: '9787563358243',
    title: '哥伦比亚的倒影',
    author: '木心',
    retail_price: '22.00',
    publisher: '广西师范大学出版社',
    stock: 500
}, {
    isbn: '9780520071469',
    title: 'The New Typography',
    author: 'Jan/ McLean Tschichold',
    retail_price: '450.00',
    publisher: 'University of California Press',
    stock: 200
}, {
    isbn: '9780140621006',
    title: 'The Adventures of Sherlock Holmes',
    author: 'Sir Arthur Conan Doyle',
    retail_price: '15.00',
    publisher: 'Penguin Books',
    stock: 600
}, {
    isbn: '9787111375296',
    title: '数据库系统概念',
    author: 'Abraham Silberschatz / Henry F.Korth / S.Sudarshan',
    retail_price: '99.00',
    publisher: '机械工业出版社',
    stock: 1000
}];
var orders = [{
    isbn:           '9787532739974',
    order_id:       '001',
    order_time:     '1420030759037',
    order_price:    '10.00',
    order_amount:   '500',
    payment_status: 1
}, {
    isbn:           '9787532739974',
    order_id:       '002',
    order_time:     '1420090759037',
    order_price:    '10.00',
    order_amount:   '500',
    payment_status: 1
}, {
    isbn:           '9780140621006',
    order_id:       '003',
    order_time:     '1429040759037',
    order_price:    '13.00',
    order_amount:   '100',
    payment_status: 2
}, {
    isbn:           '9787111375296',
    order_id:       '004',
    order_time:     '1429540759037',
    order_price:    '80.00',
    order_amount:   '1000',
    payment_status: 0
}];
var bills = [{
    type: 'outgoings',
    time: '1420030759037',
    order_id: '001',
    out_total: 5000
}, {
    type: 'incomes',
    time: '1420030759047',
    isbn: '9787563358243',
    amount: '3',
    in_total: 66
}, {
    type: 'incomes',
    time: '1420050759037',
    isbn: '9787563358243',
    amount: '2',
    in_total: 44
}, {
    type: 'incomes',
    time: '1419700759037',
    isbn: '9787111375296',
    amount: '2',
    in_total: 198
}, {
    type: 'outgoings',
    time: '1420090759037',
    order_id: '002',
    out_total: 5000
}, {
    type: 'outgoings',
    time: '1429040759037',
    order_id: '003',
    out_total: 1300
}, {
    type: 'outgoings',
    time: '1429540759037',
    order_id: '004',
    out_total: 8000
}];
var users = [{
    user_id: 0,
    user_name: 'root',
    realname: 'John Root',
    work_id: '000',
    gender: 0,
    age: 20
}, {
    user_id: 1,
    user_name: 'testuser1',
    realname: '小明',
    work_id: '001',
    gender: 1,
    age: 30
}];

var cookie = 'test';

window.api = {
    user: {
        i: function (callback) {
            if (!cookie) {
                window.location.hash = '#/login';
                return;
            }
            callback && callback([{
                user_id: 0,
                user_name: 'root',
                realname: 'John Root',
                work_id: '000',
                gender: 0,
                age: 20
            }]);
        },
        logout: function (callback) {
            window.location.hash = '#/login';
            cookie = '';
            callback && callback('OK');
        },
        login: function (username, password, callback) {
            cookie = 'test';
            window.location.hash = '#/';
            callback && callback('OK');
        },
        new: function (userdata, callback) {
            if (!cookie) {
                window.location.hash = '#/login';
                return;
            }
            callback && callback('OK');
        },
        delete: function (user_id, callback) {
            if (!cookie) {
                window.location.hash = '#/login';
                return;
            }
            callback && callback('OK');
        },
        all: function (callback) {
            if (!cookie) {
                window.location.hash = '#/login';
                return;
            }
            callback && callback(users);
        }
    },
    book: {
        all: function (callback) {
            if (!cookie) {
                window.location.hash = '#/login';
                return;
            }
            callback && callback(books);
        },
        search: function (keywords, callback) {
            if (!cookie) {
                window.location.hash = '#/login';
                return;
            }
            var ret = [];
            books.forEach(function (book) {
                if (JSON.stringify(book).indexOf(keywords) !== -1)
                    ret.push(book);
            });
            callback && callback(ret);
        },
        data: function (isbn, callback) {
            if (!cookie) {
                window.location.hash = '#/login';
                return;
            }
            var ret = [];
            books.forEach(function (book) {
                if (book.isbn == isbn)
                    ret.push(book);
            });
            callback && callback(ret);
        },
        new: function (bookdata, callback) {
            if (!cookie) {
                window.location.hash = '#/login';
                return;
            }
            callback && callback('OK');
        },
        delete: function (isbn, callback) {
            if (!cookie) {
                window.location.hash = '#/login';
                return;
            }
            callback && callback('OK');
        },
        update: function (isbn, bookdata, callback) {
            if (!cookie) {
                window.location.hash = '#/login';
                return;
            }
            callback && callback('OK');
        },
        sell: function (isbn, amount, callback) {
            if (!cookie) {
                window.location.hash = '#/login';
                return;
            }
            callback && callback('OK');
        }
    },
    order: {
        all: function (callback) {
            if (!cookie) {
                window.location.hash = '#/login';
                return;
            }
            callback && callback(orders);
        },
        data: function (order_id, callback) {
            if (!cookie) {
                window.location.hash = '#/login';
                return;
            }
            var ret = [];
            orders.forEach(function (order) {
                if (order.order_id == order_id)
                    ret.push(order);
            });
            callback && callback(ret);
        },
        new: function (orderdata, callback) {
            if (!cookie) {
                window.location.hash = '#/login';
                return;
            }
            callback && callback('OK');
        },
        pay: function (order_id, callback) {
            if (!cookie) {
                window.location.hash = '#/login';
                return;
            }
            callback && callback('OK');
        },
        puton: function (order_id, callback) {
            if (!cookie) {
                window.location.hash = '#/login';
                return;
            }
            callback && callback('OK');
        },
        delete: function (order_id, callback) {
            if (!cookie) {
                window.location.hash = '#/login';
                return;
            }
            callback && callback('OK');
        }
    },
    bill: function (start_time, end_time, callback) {
        if (!cookie) {
            console.log(window.location.hash = '#/login');
            return;
        }
        callback && callback(bills);
    }
};
