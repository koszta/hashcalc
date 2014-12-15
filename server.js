var http = require('http'),
    url = require('url');

notFound = function (res) {
  res.writeHead(404, {'content-type': 'application/json'});
  res.end(JSON.stringify({status: 'not_found'}));
}

methodNotAllowed = function(res, allowedMethods) {
  var allow = allowedMethods.join(', ');

  res.writeHead(405, {
    'content-type': 'application/json',
    'allow': allow
  });
  res.end(JSON.stringify({status: 'method_not_allowed', allow: allowedMethods}));
}

ensureAllowed = function(req, res, allowedMethods, callback) {
  if (allowedMethods.indexOf(req.method) < 0)
    return methodNotAllowed(res, allowedMethods);
  callback();
}

module.exports = http.createServer(function(req, res) {
  switch(url.parse(req.url).path) {
    case '/stats':
      ensureAllowed(req, res, ['GET'], function() {
        res.writeHead(200, {'content-type': 'application/json'});
        res.end(JSON.stringify({
          host: req.headers['host'],
          stats: {}
        }));
      });
      break;
    default:
      notFound(res);
      break;
  }
}).listen(process.env.PORT || 3000, process.env.HOST || 'localhost');
