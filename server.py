import web
import gevent
import psycopg2
import json
import md5

##### URLS #####

urls = (
	'/',				'test_view',
	'/user/delete',		'user_delete',
	'/user/login',		'user_login',
	
)


##### DATABASES #####

db = web.database(dbn='postgres', user='postgres', pw='whereshallwego', db='bookstore')

##### GLOBALS #####



##### FUNCTIONS #####

def qrets_to_json():
	pass

##### REQUEST HANDLERS #####

class test_view:
	def GET(self):
		uid = 2
		qvars = dict(uid=uid)
		##num_deleted = db.delete('users', where='user_id = $uid', vars=qvars)
		num_deleted = db.query('DELETE FROM users WHERE user_id = 2')
		return str(num_deleted) + ' users deleted.'

class user_delete:
	def POST(self):
		data = json.loads(web.data())
		uid = data['user_id']
		qvars = dict(uid=uid)
		num_deleted = db.delete('users', where='user_id = $uid', vars=qvars)
		return str(num_deleted) + ' users deleted.'

class user_login:
	def POST(self):
		data = json.loads(web.data())
		uname = data['username']
		passwd = data['password']
		passwd_md5 = md5.md5(passwd).hexdigest()
		qvars = dict(uname=uname)
		qrets = list(db.select('users', where='user_name = $uname', vars=qvars))
		if not qrets:
			return 'Login Failed.'
		else:
			if rets[0].user_pw_md5 == passwd_md5:
				return 'Login Successful.'
			else:
				return 'Login Failed.'

		
if __name__ == '__main__':
	app = web.application(urls, globals())
	app.run()
