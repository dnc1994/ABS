drop table if exists users;

-- users: 记录用户信息
create table users
(
	user_id			serial			primary key,
	user_name		varchar(16),
	user_pw_md5		varchar(32),
	user_type		smallint,
	work_id			integer,
	realname		varchar(40),
	gender			smallint,
	age				smallint
);
-- user_id: 用户ID，使用PostgreSQL的serial类型实现自增
-- user_name: 用户名 | user_pw_md5: 密码的MD5值
-- user_type: 用户类型，0为超级管理员，1为普通管理员
-- work_id: 工号 | realname: 姓名
-- gender: 性别，0为女，1为男 | age: 年龄

insert into users(user_name, user_pw_md5, user_type, work_id, realname, gender, age) values('root', '14976b0e726f29adc340d45ad30345c8', 0, 777, 'Mike Wallce', 1, 20);
-- 创建超级管理员root，密码为：ABS0042

drop table if exists incomes;

drop table if exists outgoings;

drop table if exists orders;

drop table if exists books;

-- books: 记录图书信息
create table books
(
	isbn				varchar(13)			primary key,
	title				varchar(100),
	publisher			varchar(100),
	author				varchar(100),
	retail_price		numeric(8, 2),
	stock				integer				default				0
);
-- isbn: 图书ISBN编号 | title: 图书标题 | publisher: 出版社
-- author: 作者 | retail_price: 零售价 | stock: 库存

create index isbn_index on books(isbn);
-- 为isbn创建索引

create table orders
(
	order_id			serial				primary key,
	order_time			timestamp,
	isbn				varchar(13)			references books	on delete set null,
	order_price			numeric(8, 2),		
	order_amount		integer,
	order_status		smallint
);
-- order_id: 订单号 | order_time: 下单时间
-- isbn: 图书ISBN编号，是引用books的外键，级联删除时设为空以保留订单信息可见
-- order_price: 订购价格 | order_amount: 订购数量
-- order_status: 订单状态，0为未付款，1为已付款但图书未上架，2为订单完成且图书已上架

-- incomes: 记录卖书的收入
create table incomes
(
	in_id				serial				primary key,
	in_time				timestamp,
	isbn				varchar(13)			references books	on delete set null,
	amount				integer,
	in_total			numeric(8, 2)
);
-- in_id: 单目编号 | in_time: 单目创建时间 | isbn: 图书ISBN编号
-- amount: 卖出数目 | in_total: 本单目收入总额

-- outgoings: 记录支付订单的支出
create table outgoings
(
	out_id				serial				primary key,
	out_time			timestamp,
	order_id			integer				references orders	on delete set null,
	out_total			numeric(8, 2)
);
-- out_id: 单目编号 | out_time: 单目创建时间
-- order_id: 对应的订单编号 | out_total: 本单目支出总额