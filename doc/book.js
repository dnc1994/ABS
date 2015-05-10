var request = require('request');

process.stdout.write('Enter book ID (http://book.douban.com/subject/xxxxxxx/):\n');
process.stdin.on('data', function(chunk) {
	(chunk + '').split(',').forEach(function (chunk) {
		chunk = chunk.replace(/\D/g, '');
		request.get({
			url:'https://api.douban.com/v2/book/' + chunk
		}, function(err, httpResponse, body){ 
			var json = JSON.parse(body);
			console.log("insert into books values('" + 
				json.isbn13 +  "', '" + 
				json.title + "', '" +
				json.publisher + "', '" +
				json.author.join(', ') + "', " +
				json.price.replace(/\D/g,'') + ", 0);");
		});
	});
});
