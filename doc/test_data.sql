delete from books;

delete from orders;

delete from income;

delete from outgoings;

insert into books values('9787121215742', 'Developing Next Generation Web App with AngularJS', 'O''REILLY', 'Brad Green & Shyam Seshadri', 55.00, 15);

insert into books values('9787115308153', 'Android Software Security and Reverse Engineering', 'POSTS & TELECOM PRESS', 'Feng Shengqiang', 69.00, 15);

insert into books values('9787121254413', 'Android Kernel-Level Development', 'PUBLISHING HOUSE OF ELECTRONICS INDUSTRY', 'Wang Zhenli', 79.00, 15);

insert into books values('9787113191641', 'Android Source Code Analysis', 'CHINA RAILWAY PUBLISHING HOUSE', 'Li Jun', 79.00, 115);

insert into books values('9787115351470', 'Software Defined Network', 'POST & TELECOM PRESS', 'Thomas D.Nadeau & Ken Gray', 79.00, 79);

insert into orders(order_time, isbn, order_price, order_amount, payment_status) values(now(), '9787121215742', 40.00, 150, 0);

insert into orders(order_time, isbn, order_price, order_amount, payment_status) values(now(), '9787115308153', 40.00, 250, 1);

insert into orders(order_time, isbn, order_price, order_amount, payment_status) values(now(), '9787121254413', 20.00, 1500, 0);


insert into users values(2, 'Zemin', '8a22a370b0783d91fbcbd899f95431bb', 1, 100, 'Jiang Zemin', 1, 88);

insert into users values(3, 'CodingYue', '8a22a370b0783d91fbcbd899f95431bb', 1, 101, 'Yang Yue', 1, 20);

insert into users values(4, 'ChickenLeg', '8a22a370b0783d91fbcbd899f95431bb', 1, 102, 'Zhou Xiyou', 1, 19);

insert into users values(5, 'XiDoubleBig', '8a22a370b0783d91fbcbd899f95431bb', 1, 103, 'Xi Dada', 1, 21);