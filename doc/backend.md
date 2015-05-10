# ABS / backend APIs

## user

| API | method | user group | response | description |
| --- | --- | --- | --- | --- |
| `/user/i` | GET | all | JSON, userdata of current user | query current user |
| `/user/all` | GET | `superadmin` | JSON, array of all users' info | get all users |
| `/user/new/{userdata}` | POST | `superadmin` | String, OK / Fail | create a new user |
| `/user/delete/{user_id}` | POST | `superadmin` | String, OK / Fail | delete a user |
| `/user/login/{username:password}` | POST | all | String, OK / Fail | login |

### detail & schemas

	userdata {
		user_id: Number,
		user_name: String,
		password: String,
		realname: String,
		work_id: String,
		gender: Bool,
		age: Number
	}

## book

| API | method | user group | response | description |
| --- | --- | --- | --- | --- |
| `/book/search/{keywords}` | GET | all | JSON, a list of search result | search books by keywords (ISBN, authors, ..) |
| `/book/data/{isbn}` | GET | all | JSON, bookdata of specific book | query for specific book |
| `/book/new/{bookdata}` | POST | all | String, OK / Fail | add a new book |
| `/book/delete/{isbn}` | POST | all | String, OK / Fail | remove a book |
| `/book/update/{isbn}/{bookdata}` | POST | all | String, OK / Failed | modify some attributes of specific book |
| `/book/sell/{isbn&amount}` | POST | all | String, OK / Fail | sell books from stock |

### detail & schemas

	bookdata {
		isbn: String,			// unique
		title: String,
		author: String,			// "yuege|jackyyf|orz"
		publisher: String,
		retail_price: Number,	// 21.50
		stock: Number
	}

## order

| API | method | user group | response | description |
| --- | --- | --- | --- | --- |
| `/order/all` | GET | all | JSON, array of orderdatas | get all orderdata |
| `/order/data/{order_id}` | GET | all | String, OK / Failed | get orderdata |
| `/order/new/{orderdata}` | POST | all | String, OK / Failed | create a new order |
| `/order/delete/{order_id}` | POST | all | String, OK / Failed | remove an order |
| `/order/pay/{order_id}` | POST | all | String, OK / Failed | finish payment |
| `/order/puton/{order_id}` | POST | all | String, OK / Failed | put books on shelf |

### detail & schemas

	orderdata {
		isbn: String,
		order_id: String,
		order_time: String,
		order_price: Number,
		order_amount: Number,
		order_status: Number
	}

## bill

| API | method | user group | response | description |
| --- | --- | --- | --- | --- |
| `/bill/{start_time&end_time}` | POST | all | JSON, array of billdata | query bill details |

### detail & schemas

	billdata {
		type: "incomes",
		time: String,
		isbn: String,
		amount: Number,
		in_total: Number
	}
	or 
	{
		type: "outgoings",
		time: String,
		order_id: String,
		out_total: Number
	}
