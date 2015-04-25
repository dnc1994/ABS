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

insert into users values(1, 'root', '438fadf2a25a28f2f273dd4837347fa8', 0, 777, 'Farter', 1, 20);

drop table if exists income;

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
	stock				integer
);

create table orders
(
	order_id			serial				primary key,
	order_time			timestamp,
	isbn				varchar(13)			references books	on delete cascade,
	order_price			numeric(8, 2),		
	order_amount		integer,
	payment_status		smallint
);

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
