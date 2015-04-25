# ABS / backend APIs

## user

| API | method | user group | response | description |
| --- |: --- :|: --- :| --- | --- |
| `/user/i` | GET | all | JSON, userdata of current user | query current user |
| `/user/all` | GET | `superadmin` | JSON, array of all users' info | get all users |
| `/user/new/{userdata}` | POST | `superadmin` | String, Ok / Failed | create a new user |
| `/user/delete/{user_id}` | POST | `superadmin` | String, Ok / Failed | delete a user |
| `/user/login/{username:password}` | POST | all | String, Ok / Failed | login |

### detail & schemas

	userdata {
		user_id: Number,
		username: String,
		password: String,
		realname: String,
		workid: String,
		gender: Bool,
		age: Number
	}

## book

| API | method | user group | response | description |
| --- |: --- :|: --- :| --- | --- |
| `/book/search/{keywords}` | GET | all | JSON, a list of search result | search books by keywords (ISBN, authors, ..) |
| `/book/data/{isbn}` | GET | all | JSON, bookdata of specific book | query for specific book |
| `/book/new/{bookdata}` | POST | all | String, Ok / Failed | add a new book |
| `/book/delete/{isbn}` | POST | all | String, Ok / Failed | remove a book |
| `/book/update/{isbn}/{bookdata}` | POST | all | String, Ok / Failed | modify some attributes of specific book |
| `/book/sell/{isbn&amount}` | POST | all | String, Ok / Failed | sell books from stock |

### detail & schemas

	bookdata {
		isbn: String,			// unique
		title: String,
		author: String,			// "yuege|jackyyf|orz"
		publisher: String,
		retail_price: Number,	// 21.50
		stock
	}

## order

| API | method | user group | response | description |
| --- |: --- :|: --- :| --- | --- |
| `/order/all` | GET | all | String, Ok / Failed | create a new order |
||
| `/order/new/{orderdata}` | POST | all | String, Ok / Failed | create a new order |
| `/order/delete/{order_id}` | POST | all | String, Ok / Failed | remove an order |
| `/order/pay/{order_id}` | POST | all | String, Ok / Failed | finish payment |

### detail & schemas

	orderdata {
		isbn: String,
		order_id: String,
		order_time: String,
		order_price: Number,
		order_amount: Number,
		payment_status: Bool
	}

## bill

| API | method | user group | response | description |
| --- |: --- :|: --- :| --- | --- |
| `/bill/{start_time&end_time}` | GET | all | JSON, array of billdata | query bill details |

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