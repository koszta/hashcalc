var server = require('../server'),
    request = require('supertest')(server);

require('chai').should();

describe('server', function() {
  describe('GET /stats', function() {
    it('should return 200', function(done) {
      request
        .get('/stats')
        .expect(200)
        .end(done);
    });

    it('should set content-type to application/json', function(done) {
      request
        .get('/stats')
        .expect('Content-Type', 'application/json')
        .end(done);
    });
  });
});
