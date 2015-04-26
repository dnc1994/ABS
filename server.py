import web
import gevent
import psycopg2
import json
import md5
from decimal import Decimal

##### URLS #####

urls = (
	'/',					'test_view',
	'/user/login',			'user_login',
	'/user/i',				'user_i',
	'/user/all',			'user_all',
	'/user/new',			'user_new',
	'/user/delete',			'user_delete',
	'/book/search/(.+)',	'book_search',
	'/book/data/(.+)',		'book_data',
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

app = web.application(urls, globals())

##### DATABASES #####

db = web.database(dbn='postgres', user='postgres', pw='whereshallwego', db='bookstore')

##### GLOBALS #####



##### FUNCTIONS #####

class fakefloat(float):
	def __init__(self, value):
		self._value = value
	def __repr__(self):
		return str(self._value)

def defaultencode(o):
	if isinstance(o, Decimal):
		return fakefloat(o)
	raise TypeError(repr(o) + " is not JSON serializable")

##### REQUEST HANDLERS #####

class test_view:
	return 'TEST'

class user_login:
	def POST(self):
		data = json.loads(web.data())
		uname = data['username']
		passwd = data['password']
		passwd_md5 = md5.md5(passwd).hexdigest()
		qvars = dict(uname=uname)
		qrets = list(db.select('users', where='user_name = $uname', vars=qvars))
		if qrets:
			if rets[0].user_pw_md5 == passwd_md5:
				web.setcookie('loggedin', 1)
				return 'OK'
			else:
				return 'Fail'
		else:
			return 'Fail'

class user_i:
	def GET(self):
		pass
			
class user_all:
	def GET(self):
		qrets = list(db.select('users'))
		for r in qrets:
			del r['user_pw_md5']
		resp = ', '.join([json.dumps(r) for r in qrets])
		return '[' + resp + ']'

class user_new:
	def POST(self):
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
		
class user_delete:
	def POST(self):
		data = json.loads(web.data())
		uid = data['user_id']
		qvars = dict(uid=uid)
		num_deleted = db.delete('users', where='user_id = $uid', vars=qvars)
		if num_deleted == 0:
			return 'Fail'
		else:
			return 'OK'	

# temporary equivalent to book_data
class book_search:
	def GET(self, isbn):
		if (not isbn.isdigit()) or (not len(isbn) == 13):
			return '[]'
		qvars = dict(isbn=isbn)
		qrets = list(db.select('books', where='isbn = $isbn', vars=qvars))
		if qrets:
			return '[' + json.dumps(qrets[0], default=defaultencode) + ']'
		else:
			return '[]'
	
class book_data:
	def GET(self, isbn):
		if (not isbn.isdigit()) or (not len(isbn) == 13):
			return '[]'
		qvars = dict(isbn=isbn)
		qrets = list(db.select('books', where='isbn = $isbn', vars=qvars))
		if qrets:
			return '[' + json.dumps(qrets[0], default=defaultencode) + ']'
		else:
			return '[]'
			
class book_new:
	def POST(self):
		data = json.loads(web.data())
		qvars = data
		qrets = db.query('INSERT INTO books(isbn, title, publisher, author) VALUES($isbn, $title, $publisher, $author)', vars=qvars)
		if qrets:
			return 'OK'
		else:
			return 'Fail'

class book_update:
	def POST(self):
		data = json.loads(web.data())
		qvars = data
		num_updated = db.query('UPDATE books SET title = $title, publisher = $publisher, author = $author, retail_price = $retail_price, stock = $stock', vars=qvars)
		if num_updated == 0:
			return 'Fail'
		else:
			return 'OK'

class book_delete:
	def POST(self):
		data = json.loads(web.data())
		isbn = data['isbn']
		qvars = dict(isbn=isbn)
		num_deleted = db.delete('books', where='isbn = $isbn', vars=qvars)
		if num_deleted == 0:
			return 'Fail'
		else:
			return 'OK'

class book_sell:
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
			num_updated = db.query('UPDATE books SET stock = $stock WHERE isbn = $isbn', vars=qvars)
			if num_updated == 0:
				return 'Fail'
			qvars2 = dict(isbn=isbn, amount=amount, in_total=amount*retail_price)
			qrets2 = db.query('INSERT INTO incomes(in_time, isbn, amount, in_total) VALUES(now(), $isbn, $amount, $in_total)', vars=qvars2)
			if not qrets2:
				return 'Fail'
			return 'OK'

class order_data:
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
			
class order_all:			
	def GET(self):
		qrets = list(db.select('orders'))
		for r in qrets:
			r['order_time'] = str(r['order_time'])
		resp = ', '.join([json.dumps(r, default=defaultencode)for r in qrets])
		return '[' + resp + ']'
	
class order_new:
	def POST(self):
		data = json.loads(web.data())
		qvars = data
		qrets = db.query('INSERT INTO orders(order_time, isbn, order_price, order_amount, order_status) VALUES(now(), $isbn, $order_price, $order_amount, 0)', vars=qvars)
		if qrets:
			return 'OK'
		else:
			return 'Fail'
			
class order_delete:
	def POST(self):
		data = json.loads(web.data())
		oid = data['order_id']
		qvars = dict(oid=oid)
		num_deleted = db.delete('orders', where='order_id = $oid', vars=qvars)
		if num_deleted == 0:
			return 'Fail'
		else:
			return 'OK'

class order_pay:
	def POST(self):
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
			num_updated = db.query('UPDATE orders SET order_status = 1 WHERE order_id = $oid', vars=qvars)
			if num_updated == 0:
				return 'Fail'
			qvars2 = dict(oid=oid, out_total=order_price*order_amount)
			qrets2 = db.query('INSERT INTO outgoings(out_time, order_id, out_total) VALUES(now(), $oid, $out_total)', vars=qvars2)
			if qrets2:
				return 'OK'
			else:
				return 'Fail'
				
class order_puton:
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
			if qrets3:
				return 'OK'
			else:
				return 'Fail'				
				
class bill_summary:
	def GET(self):
		st_time = '2015-04-26'
		ed_time = '2015-04-28'
		qvars = dict(st=st_time, ed=ed_time)
		qrets = list(db.select('incomes', where='in_time > $st AND in_time < $ed', vars=qvars))
		qrets2 = list(db.select('outgoings', where='out_time > $st AND out_time < $ed', vars=qvars))
		if (not qrets) and (not qrets2):
			return '[]'
		for r in qrets:
			del r['in_time']
			r['type'] = 'incomes'
		for r in qrets2:
			del r['out_time']
			r['type'] = 'outgoings'
		resp = ', '.join([json.dumps(r, default=defaultencode)for r in qrets]) + ', '.join([json.dumps(r, default=defaultencode)for r in qrets2])
		return '[' + resp + ']'
		
##### END #####
			
if __name__ == '__main__':
	app = web.application(urls, globals())
	app.run()
