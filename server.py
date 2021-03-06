# -*- encoding: utf-8 -*-

# 用gevent实现异步
from gevent import monkey; monkey.patch_all()
from gevent.pywsgi import WSGIServer
import gevent
import web
import psycopg2

import os
import json
import md5
from decimal import Decimal

##### SETTINGS #####

# 指定后端服务器端口
PORT = 4000
# 演示模式，关闭同源限制、输出调试信息等
DEMO_MODE = True

# 设置session属性
web.config.debug = False
web.config.session_parameters['cookie_name'] = 'SESSION'
web.config.session_parameters['ignore_expiry'] = True 
web.config.session_parameters['timeout'] = 1800

##### URLS #####

# URL路由
urls = (
	'/',					'test_view',
	'/user/login',			'user_login',
	'/user/logout',			'user_logout',
	'/user/i',				'user_i',
	'/user/all',			'user_all',
	'/user/new',			'user_new',
	'/user/delete',			'user_delete',
	'/book/data/(.+)',		'book_data',
	'/book/all',			'book_all',
	'/book/new',			'book_new',
	'/book/update',			'book_update',
	'/book/delete',			'book_delete',
	'/book/sell',			'book_sell',
	'/order/data/(.+)',		'order_data',
	'/order/all',			'order_all',
	'/order/new',			'order_new',
	'/order/delete',		'order_delete',
	'/order/pay',			'order_pay',
	'/order/puton',			'order_puton',
	'/bill',				'bill_summary'
)

##### DATABASES #####

# 连接PostgreSQL数据库
db = web.database(dbn='postgres', user='postgres', pw='whereshallwego', db='bookstore')

##### GLOBALS #####

app = web.application(urls, globals())

# 设置并初始化session
session = web.session.Session(app, web.session.DiskStore('sessions'),
	initializer={
		'logged_in': 0,
		'user_id': None,
		'user_type': None
	}
)

##### FUNCTIONS #####

# 用于将Decimal对象序列化为JSON对象
class fakefloat(float):
	def __init__(self, value):
		self._value = value
	def __repr__(self):
		return str(self._value)

def defaultencode(o):
	if isinstance(o, Decimal):
		return fakefloat(o)
	raise TypeError(repr(o) + " is not JSON serializable")

# 检查用户是否已登入
def logged_in(f):
	def decorated(*args, **kwargs):
		if DEMO_MODE:
			print dict(session)
			# 用于在本机演示时关闭同源限制
			web.header('Access-Control-Allow-Origin', '*')
			web.header('Access-Control-Allow-Credentials', 'true')
		if session.logged_in != 1:
			web.ctx.status = '404 not found'
			return
		return f(*args, **kwargs)
	return decorated

# 检查用户是否为超级管理员	
def root_only(f):
	def decorated(*args, **kwargs):
		if session.user_type != 0:
			web.ctx.status = '404 not found'
			return
		return f(*args, **kwargs)
	return decorated
	
##### REQUEST HANDLERS #####

class test_view:
	def GET(self):
		return 'TEST'

# 用户登录	
class user_login:		
	def POST(self):
		if DEMO_MODE:
			web.header('Access-Control-Allow-Origin', '*')
			web.header('Access-Control-Allow-Credentials', 'true')
		data = json.loads(web.data())
		uname = data['username']
		passwd = data['password']
		# 储存密码的MD5值
		passwd_md5 = md5.md5(passwd).hexdigest()
		qvars = dict(uname=uname)
		qrets = list(db.select('users', where='user_name = $uname', vars=qvars))
		if qrets:
			if qrets[0].user_pw_md5 == passwd_md5:
				session.logged_in = 1
				session.user_id = qrets[0].user_id
				session.user_type = qrets[0].user_type
				if DEMO_MODE:
					print 'LOGIN OK'
				return 'OK'
			else:
				return 'Fail'
		else:
			return 'Fail'

# 用户注销
class user_logout:
	@logged_in
	def GET(self):
		session.logged_in = 0
		return 'OK'

# 获取用户个人信息		
class user_i:
	@logged_in
	def GET(self):
		qvars = dict(uid=session.user_id)
		qrets = list(db.select('users', where='user_id = $uid', vars=qvars))
		if qrets:
			del qrets[0]['user_pw_md5']
			return '[' + json.dumps(qrets[0]) + ']'
		else:
			return '[]'

# [超级管理员可用] 获取所有用户信息
class user_all:
	@root_only
	@logged_in
	def GET(self):
		qrets = list(db.select('users'))
		# 从响应中移除密码的MD5值
		for r in qrets:
			del r['user_pw_md5']
		resp = ', '.join([json.dumps(r) for r in qrets])
		return '[' + resp + ']'

# [超级管理员可用] 创建用户
class user_new:
	@root_only
	@logged_in
	def POST(self):
		if session.user_type != 0:
			return 'Fail'
		data = json.loads(web.data())
		qvars = data
		passwd = data['password']
		passwd_md5 = md5.md5(passwd).hexdigest()
		del qvars['password']
		qvars['user_pw_md5'] = passwd_md5
		qrets = db.query('INSERT INTO users(user_name, user_pw_md5, user_type, work_id, realname, gender, age) VALUES($user_name, $user_pw_md5, 1, $work_id, $realname, $gender, $age)', vars=qvars)
		if qrets:
			return 'OK'
		else:
			return 'Fail'

# [超级管理员可用] 删除用户
class user_delete:
	@root_only
	@logged_in
	def POST(self):
		if session.user_type != 0:
			return 'Fail'
		data = json.loads(web.data())
		uid = data['user_id']
		qvars = dict(uid=uid)
		num_deleted = db.delete('users', where='user_id = $uid', vars=qvars)
		if num_deleted == 0:
			return 'Fail'
		else:
			return 'OK'	

# 获取图书信息			
class book_data:
	@logged_in
	def GET(self, isbn):
		if (not isbn.isdigit()) or (not len(isbn) == 13):
			return '[]'
		qvars = dict(isbn=isbn)
		qrets = list(db.select('books', where='isbn = $isbn', vars=qvars))
		if qrets:
			return '[' + json.dumps(qrets[0], default=defaultencode) + ']'
		else:
			return '[]'

# 获取所有图书信息			
class book_all:
	@logged_in
	def GET(self):
		qrets = list(db.select('books'))
		resp = ', '.join([json.dumps(r, default=defaultencode) for r in qrets])
		return '[' + resp + ']'

# 创建图书		
class book_new:
	@logged_in
	def POST(self):
		data = json.loads(web.data())
		qvars = data
		qrets = db.query('INSERT INTO books(isbn, title, publisher, author, retail_price) VALUES($isbn, $title, $publisher, $author, $retail_price)', vars=qvars)
		if qrets:
			return 'OK'
		else:
			return 'Fail'

# 更新图书信息
class book_update:
	@logged_in
	def POST(self):
		data = json.loads(web.data())
		qvars = data
		num_updated = db.query('UPDATE books SET title = $title, publisher = $publisher, author = $author, retail_price = $retail_price, stock = $stock WHERE isbn = $isbn', vars=qvars)
		if num_updated == 0:
			return 'Fail'
		else:
			return 'OK'

# 删除图书			
class book_delete:
	@logged_in
	def POST(self):
		data = json.loads(web.data())
		isbn = data['isbn']
		qvars = dict(isbn=isbn)
		num_deleted = db.delete('books', where='isbn = $isbn', vars=qvars)
		if num_deleted == 0:
			return 'Fail'
		else:
			return 'OK'

# 卖出图书			
class book_sell:
	@logged_in
	def POST(self):
		data = json.loads(web.data())
		isbn = data['isbn']
		amount = data['amount']
		qvars = dict(isbn=isbn)
		qrets = list(db.select('books', where='isbn = $isbn', vars=qvars))
		if not qrets:
			return 'Fail'
		else:
			new_stock = qrets[0].stock - amount
			retail_price = float(qrets[0].retail_price)
			if (new_stock < 0):
				return 'Fail'
			qvars['stock'] = new_stock
			t = db.transaction()
			try:
				num_updated = db.query('UPDATE books SET stock = $stock WHERE isbn = $isbn', vars=qvars)
				if num_updated == 0:
					return 'Fail'
				qvars2 = dict(isbn=isbn, amount=amount, in_total=amount*retail_price)
				qrets2 = db.query('INSERT INTO incomes(in_time, isbn, amount, in_total) VALUES(now(), $isbn, $amount, $in_total)', vars=qvars2)
				if not qrets2:
					return 'Fail'
			except:
				t.rollback()
				return 'Fail'
			else:
				t.commit()
				return 'OK'

# 获取订单信息
class order_data:
	@logged_in
	def GET(self, oid):
		if not oid.isdigit():
			return '[]'
		qvars = dict(oid=oid)
		qrets = list(db.select('orders', where='order_id = $oid', vars=qvars))
		if qrets:
			qrets[0]['order_time'] = str(qrets[0]['order_time'])
			return '[' + json.dumps(qrets[0], default=defaultencode) + ']'
		else:
			return '[]'

# 获取所有订单信息			
class order_all:
	@logged_in
	def GET(self):
		qrets = list(db.select('orders'))
		for r in qrets:
			r['order_time'] = str(r['order_time'])
		resp = ', '.join([json.dumps(r, default=defaultencode)for r in qrets])
		return '[' + resp + ']'

# 创建订单		
class order_new:
	@logged_in
	def POST(self):
		data = json.loads(web.data())
		qvars = data
		qrets = db.query('INSERT INTO orders(order_time, isbn, order_price, order_amount, order_status) VALUES(now(), $isbn, $order_price, $order_amount, 0)', vars=qvars)
		if qrets:
			return 'OK'
		else:
			return 'Fail'

# 删除订单			
class order_delete:
	@logged_in
	def POST(self):
		data = json.loads(web.data())
		oid = data['order_id']
		qvars = dict(oid=oid)
		num_deleted = db.delete('orders', where='order_id = $oid', vars=qvars)
		if num_deleted == 0:
			return 'Fail'
		else:
			return 'OK'

# 支付订单
class order_pay:
	@logged_in
	def POST(self):
		print web.data()
		data = json.loads(web.data())
		oid = data['order_id']
		qvars = dict(oid=oid)
		qrets = list(db.select('orders', where='order_id = $oid', vars=qvars))
		if not qrets:
			return 'Fail'
		else:
			order_status = qrets[0].order_status
			if order_status != 0:
				return 'Fail'
			order_price = qrets[0].order_price
			order_amount = qrets[0].order_amount
			# 使用事务保证两个操作的原子性
			t = db.transaction()
			try:
				num_updated = db.query('UPDATE orders SET order_status = 1 WHERE order_id = $oid', vars=qvars)
				if num_updated == 0:
					return 'Fail'
				qvars2 = dict(oid=oid, out_total=order_price*order_amount)
				qrets2 = db.query('INSERT INTO outgoings(out_time, order_id, out_total) VALUES(now(), $oid, $out_total)', vars=qvars2)
				if not qrets2:
					return 'Fail'
			except:
				t.rollback()
				return 'Fail'
			else:
				t.commit()
				return 'OK'
			
# 图书上架				
class order_puton:
	@logged_in
	def POST(self):
		data = json.loads(web.data())
		oid = data['order_id']
		qvars = dict(oid=oid)
		qrets = list(db.select('orders', where='order_id = $oid', vars=qvars))
		if not qrets:
			return 'Fail'
		else:
			order_status = qrets[0].order_status
			if order_status != 1:
				return 'Fail'
			isbn = qrets[0].isbn
			order_amount = qrets[0].order_amount
			# 使用事务保证两个操作的原子性
			t = db.transaction()
			try:
				num_updated = db.query('UPDATE orders SET order_status = 2 WHERE order_id = $oid', vars=qvars)
				if num_updated == 0:
					return 'Fail'
				qvars2 = dict(isbn=isbn)
				qrets2 = list(db.select('books', where='isbn = $isbn', vars=qvars2))
				if not qrets2:
					return 'Fail'
				new_stock = qrets2[0].stock + order_amount
				qvars3 = dict(isbn=isbn, stock=new_stock)
				qrets3 = db.query('UPDATE books SET stock = $stock WHERE isbn = $isbn', vars=qvars3)
				if not qrets3:
					return 'Fail'				
			except:
				t.rollback()
				return 'Fail'
			else:
				t.commit()
				return 'OK'

#　查询账单	
class bill_summary:
	@logged_in
	def POST(self):
		data = json.loads(web.data())
		st_time = data['start_time']
		ed_time = data['end_time']
		qvars = dict(st=st_time, ed=ed_time)
		qrets = list(db.select('incomes', where='in_time > $st AND in_time < $ed', vars=qvars))
		qrets2 = list(db.select('outgoings', where='out_time > $st AND out_time < $ed', vars=qvars))
		if (not qrets) and (not qrets2):
			return '[]'
		for r in qrets:
			r['in_time'] = r['in_time'].strftime('%Y-%m-%d %H:%M:%S')
			r['type'] = 'incomes'
		for r in qrets2:
			r['out_time'] = r['out_time'].strftime('%Y-%m-%d %H:%M:%S')
			r['type'] = 'outgoings'
		resp = ', '.join([', '.join([json.dumps(r, default=defaultencode)for r in qrets]), ', '.join([json.dumps(r, default=defaultencode)for r in qrets2])])
		return '[' + resp + ']'
		
##### END #####

if __name__ == '__main__':
	app = app.wsgifunc()
	print 'Severing on %s...' % (PORT)
	WSGIServer(('', PORT), app).serve_forever()
