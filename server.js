var http = require('http'),
    url = require('url');

notFound = function (res) {
  res.writeHead(404, {'content-type': 'application/json'});
  res.end(JSON.stringify({status: 'not_found'}));
}

module.exports = http.createServer(function(req, res) {
  switch(url.parse(req.url).path) {
    case '/stats':
      res.writeHead(200, {'content-type': 'application/json'});
      res.end(JSON.stringify({
        host: req.headers['host'],
        stats: {}
      }));
      break;
    default:
      notFound(res);
      break;
  }
}).listen(process.env.PORT || 3000, process.env.HOST || 'localhost');
