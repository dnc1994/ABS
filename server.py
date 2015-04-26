import web
import gevent
import psycopg2
import json
import md5

##### URLS #####

urls = (
	'/',				'test_view',
	'/user/login',		'user_login',
	'/user/all'	,		'user_all',
	'/user/new',		'user_new',
	'/user/delete',		'user_delete',
	'/book/search/?',	'book_search',
	'/book/data/?',		'book_data',
	'/book/new',		'book_new',
	'/book/delete',		'book_delete',
	'/book/update',		'book_update',
	'/book/sell',		'book_sell',
	'/order/all',		'order_all',
	'/order/data',		'order_data',
	'/order/new',		'order_new',
	'/order/delete',	'order_delete',
	'/order/pay',		'order_pay',
	'/bill/?',			'bill_summary'
)

app = web.application(urls, globals())

##### DATABASES #####

db = web.database(dbn='postgres', user='postgres', pw='whereshallwego', db='bookstore')

##### GLOBALS #####


##### FUNCTIONS #####

def qrets_to_json():
	pass

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

class user_all:
	def GET(self):
		pass

class user_new:
	def POST(self):
		data = json.loads(web.data())
		
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
