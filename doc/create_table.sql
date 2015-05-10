drop table if exists users;

-- users: ��¼�û���Ϣ
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
-- user_id: �û�ID��ʹ��PostgreSQL��serial����ʵ������
-- user_name: �û��� | user_pw_md5: �����MD5ֵ
-- user_type: �û����ͣ�0Ϊ��������Ա��1Ϊ��ͨ����Ա
-- work_id: ���� | realname: ����
-- gender: �Ա�0ΪŮ��1Ϊ�� | age: ����

insert into users(user_name, user_pw_md5, user_type, work_id, realname, gender, age) values('root', '14976b0e726f29adc340d45ad30345c8', 0, 777, 'Mike Wallce', 1, 20);
-- ������������Աroot������Ϊ��ABS0042

drop table if exists incomes;

drop table if exists outgoings;

drop table if exists orders;

drop table if exists books;

-- books: ��¼ͼ����Ϣ
create table books
(
	isbn				varchar(13)			primary key,
	title				varchar(100),
	publisher			varchar(100),
	author				varchar(100),
	retail_price		numeric(8, 2),
	stock				integer				default				0
);
-- isbn: ͼ��ISBN��� | title: ͼ����� | publisher: ������
-- author: ���� | retail_price: ���ۼ� | stock: ���

create index isbn_index on books(isbn);
-- Ϊisbn��������

create table orders
(
	order_id			serial				primary key,
	order_time			timestamp,
	isbn				varchar(13)			references books	on delete set null,
	order_price			numeric(8, 2),		
	order_amount		integer,
	order_status		smallint
);
-- order_id: ������ | order_time: �µ�ʱ��
-- isbn: ͼ��ISBN��ţ�������books�����������ɾ��ʱ��Ϊ���Ա���������Ϣ�ɼ�
-- order_price: �����۸� | order_amount: ��������
-- order_status: ����״̬��0Ϊδ���1Ϊ�Ѹ��ͼ��δ�ϼܣ�2Ϊ���������ͼ�����ϼ�

-- incomes: ��¼���������
create table incomes
(
	in_id				serial				primary key,
	in_time				timestamp,
	isbn				varchar(13)			references books	on delete set null,
	amount				integer,
	in_total			numeric(8, 2)
);
-- in_id: ��Ŀ��� | in_time: ��Ŀ����ʱ�� | isbn: ͼ��ISBN���
-- amount: ������Ŀ | in_total: ����Ŀ�����ܶ�

-- outgoings: ��¼֧��������֧��
create table outgoings
(
	out_id				serial				primary key,
	out_time			timestamp,
	order_id			integer				references orders	on delete set null,
	out_total			numeric(8, 2)
);
-- out_id: ��Ŀ��� | out_time: ��Ŀ����ʱ��
-- order_id: ��Ӧ�Ķ������ | out_total: ����Ŀ֧���ܶ�