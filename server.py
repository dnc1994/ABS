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
	'/book/search/(.+)',		'book_search',
	'/book/data/(.+)',		'book_data',
	'/book/new',			'book_new',
	'/book/update',			'book_update',
	'/book/delete',			'book_delete',
	'/book/sell',			'book_sell',
	'/order/all',			'order_all',
	'/order/data',			'order_data',
	'/order/new',			'order_new',
	'/order/delete',		'order_delete',
	'/order/pay',			'order_pay',
	'/bill/?',				'bill_summary'
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
	pass

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
		return
			
class user_all:
	def GET(self):
		qrets = list(db.select('users'))
		for r in qrets:
			del r['user_pw_md5']
		resp = ', '.join([json.dumps(dict(r))for r in qrets])
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

	'''
	'/book/update',		'book_update',
	'/book/sell',		'book_sell',
	'''

# temporary equivalent to book_data
class book_search:
	def GET(self, isbn):
		if (not isbn.isdigit()) or (not len(isbn) == 13):
			return '[]'
		qvars = dict(isbn=isbn)
		qrets = list(db.select('books', where='isbn = $isbn', vars=qvars))
		if qrets:
			return '[' + json.dumps(dict(qrets[0]), default=defaultencode) + ']'
		else:
			return '[]'
	
class book_data:
	def GET(self, isbn):
		if (not isbn.isdigit()) or (not len(isbn) == 13):
			return '[]'
		qvars = dict(isbn=isbn)
		qrets = list(db.select('books', where='isbn = $isbn', vars=qvars))
		if qrets:
			return '[' + json.dumps(dict(qrets[0]), default=defaultencode) + ']'
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
	'''		
	def GET(self):
		data = {}
		data['isbn'] = '1234567890121'
		data['title'] = 'COMPLETE COMIC RACK'
		data['author'] = 'YOSHIYUKI SADAMOTO'
		data['publisher'] = 'GAINAX'
		data['retail_price'] = 71.00
		data['stock'] = 831
		qvars = data
		num_updated = db.query('UPDATE books SET title = $title, publisher = $publisher, author = $author, retail_price = $retail_price, stock = $stock WHERE isbn = $isbn', vars=qvars)
		if num_updated == 0:
			return 'Fail'
		else:
			return 'OK'''
			
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
			qvars2 = dict(in_time='now()', isbn=isbn, amount=amount, in_total=amount*retail_price)
			qrets2 = db.query('INSERT INTO incomes(in_time, isbn, amount, in_total) VALUES($in_time, $isbn, $amount, $in_total)', vars=qvars2)
			if not qrets2:
				return 'Fail'
			return OK

	def GET(self):
		data = {}
		data['isbn'] = '9787121215742'
		data['amount'] = 1
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
			
##### END #####
			
if __name__ == '__main__':
	app = web.application(urls, globals())
	app.run()
