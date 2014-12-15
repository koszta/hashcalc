var http = require('http');

module.exports = http.createServer(function(req, res) {
  res.writeHead(200, {'content-type': 'application/json'})
  res.end(JSON.stringify({}));
}).listen(process.env.PORT || 3000, process.env.HOST || 'localhost');
