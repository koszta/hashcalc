var http = require('http'),
    url = require('url'),
    crypto = require('crypto')
    stats = {};

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
  var start = process.hrtime();
      host = req.headers['host'],
      hostStats = stats[host] = stats[host] || {
        active: 0,
        maxSize: 0,
        sumSize: 0,
        count: 0,
        sumTime: 0
      };

  switch(url.parse(req.url).path) {
    case '/stats':
      ensureAllowed(req, res, ['GET'], function() {
        res.writeHead(200, {'content-type': 'application/json'});
        res.end(JSON.stringify({
          host: host,
          stats: {
            active: hostStats.active,
            max_payload: hostStats.maxSize,
            average_payload: hostStats.count > 0 ? hostStats.sumSize / hostStats.count : 0,
            average_time_per_mb: hostStats.sumSize > 0 ? hostStats.sumTime / (hostStats.sumSize / 1048576) : 0
          }
        }));
      });
      break;
    case '/hashcalc':
      ensureAllowed(req, res, ['POST'], function() {
        var hash = crypto.createHash('md5'),
            size = 0;

        hostStats.active++;
        req.on('data', function(data) {
          size += data.length;
          hash.update(data);
        });

        req.on('end', function() {
          var digest = hash.digest('hex'),
              end = process.hrtime(start),
              time = end[0] * 1000 + end[1] / 1000000;

          res.writeHead(200, {'content-type': 'application/json'});
          res.end(JSON.stringify({
            host: req.headers['host'],
            hash: digest,
            time: time,
            size: size
          }));
          hostStats.active--;
          hostStats.maxSize = hostStats.maxSize < size ? size : hostStats.maxSize;
          hostStats.sumSize += size;
          hostStats.count++;
          hostStats.sumTime += time;
        });
      });
      break;
    default:
      notFound(res);
      break;
  }
}).listen(process.env.PORT || 3000, process.env.HOST || 'localhost');
