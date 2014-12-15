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

    describe('.host', function() {
      it('should be the same as in the host header', function(done) {
        request
          .get('/stats')
          .set('host', 'somehost.com')
          .end(function(err, res) {
            if (err) throw err;

            res.body.host.should.equal('somehost.com');
            done();
          });
      });
    });

    describe('.stats', function() {
      it('should be an object', function(done) {
        request
          .get('/stats')
          .set('host', 'somehost.com')
          .end(function(err, res) {
            if (err) throw err;

            res.body.stats.should.be.an('object');
            done();
          });
      });
    });
  });

  describe('GET /wrong_path', function() {
    it('should return 404', function(done) {
      request
        .get('/wrong_path')
        .expect(404)
        .end(done);
    });

    it('should set content-type to application/json', function(done) {
      request
        .get('/wrong_path')
        .expect('Content-Type', 'application/json')
        .end(done);
    });

    it('should send {"status": "not_found"}', function(done) {
      request
        .get('/wrong_path')
        .expect({status: 'not_found'})
        .end(done);
    });
  });
});
