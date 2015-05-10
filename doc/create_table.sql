drop table if exists users;

create table users
(
	user_id				serial				primary key,
	user_name			varchar(16),
	user_pw_md5			varchar(32),
	user_type			smallint,
	work_id				integer,
	realname			varchar(40),
	gender				smallint,
	age					smallint
	
);
-- user_type {0=root, 1=admin}
-- gender {0=female, 1=male}

insert into users(user_name, user_pw_md5, user_type, work_id, realname, gender, age) values('root', '8a22a370b0783d91fbcbd899f95431bb', 0, 777, 'Farter', 1, 20);
-- root's password: madamadadane

drop table if exists incomes;

drop table if exists outgoings;

drop table if exists orders;

drop table if exists books;

create table books
(
	isbn				varchar(13)			primary key,
	title				varchar(100),
	publisher			varchar(100),
	author				varchar(100),
	retail_price		numeric(8, 2),
	stock				integer				default				0
);

create table orders
(
	order_id			serial				primary key,
	order_time			timestamp,
	isbn				varchar(13)			references books	on delete cascade,
	order_price			numeric(8, 2),		
	order_amount		integer,
	order_status		smallint
);
-- order_status {0=unpaid, 1=paid, 2=done}

create table incomes
(
	in_id				serial				primary key,
	in_time				timestamp,
	isbn				varchar(13)			references books	on delete cascade,
	amount				integer,
	in_total			numeric(8, 2)
);

create table outgoings
(
	out_id				serial				primary key,
	out_time			timestamp,
	order_id			integer				references orders	on delete cascade,
	out_total			numeric(8, 2)
);
