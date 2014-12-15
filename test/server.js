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

  describe('POST /hashcalc', function() {
    it('should return 200', function(done) {
      request
        .post('/hashcalc')
        .expect(200)
        .end(done);
    });

    it('should set content-type to application/json', function(done) {
      request
        .post('/hashcalc')
        .expect('Content-Type', 'application/json')
        .end(done);
    });

    describe('.host', function() {
      it('should be the same as in the host header', function(done) {
        request
          .post('/hashcalc')
          .set('host', 'somehost.com')
          .end(function(err, res) {
            if (err) throw err;

            res.body.host.should.equal('somehost.com');
            done();
          });
      });
    });

    describe('.hash', function() {
      it('should be d41d8cd98f00b204e9800998ecf8427e without sending data', function(done) {
        request
          .post('/hashcalc')
          .set('host', 'somehost.com')
          .end(function(err, res) {
            if (err) throw err;

            res.body.hash.should.equal('d41d8cd98f00b204e9800998ecf8427e');
            done();
          });
      });

      it('should be 098f6bcd4621d373cade4e832627b4f6 for test', function(done) {
        request
          .post('/hashcalc')
          .send('test')
          .set('host', 'somehost.com')
          .end(function(err, res) {
            if (err) throw err;

            res.body.hash.should.equal('098f6bcd4621d373cade4e832627b4f6');
            done();
          });
      });
    });

    describe('.time', function() {
      it('should be the time spent with hashing', function(done) {
        request
          .post('/hashcalc')
          .set('host', 'somehost.com')
          .end(function(err, res) {
            if (err) throw err;

            res.body.time.should.be.above(0);
            res.body.time.should.be.below(0.2);
            done();
          });
      });
    });

    describe('.size', function() {
      context('empty body', function() {
        it('should be 0', function(done) {
          request
            .post('/hashcalc')
            .set('host', 'somehost.com')
            .end(function(err, res) {
              if (err) throw err;

              res.body.size.should.be.equal(0);
              done();
            });
        });
      });

      context('test sent as body', function() {
        it('should be 4', function(done) {
          request
            .post('/hashcalc')
            .send('test')
            .set('host', 'somehost.com')
            .end(function(err, res) {
              if (err) throw err;

              res.body.size.should.be.equal(4);
              done();
            });
        });
      });
    });
  });

  describe('POST /stats', function() {
    it('should return 405', function(done) {
      request
        .post('/stats')
        .expect(405)
        .end(done);
    });

    it('should set content-type to application/json', function(done) {
      request
        .post('/stats')
        .expect('Content-Type', 'application/json')
        .end(done);
    });

    it('should set allow to GET', function(done) {
      request
        .post('/stats')
        .expect('Allow', 'GET')
        .end(done);
    });

    it('should send {"status": "method_not_allowed", "allow": ["GET"]}', function(done) {
      request
        .post('/stats')
        .expect({status: 'method_not_allowed', allow: ['GET']})
        .end(done);
    });
  });

  describe('GET /hashcalc', function() {
    it('should return 405', function(done) {
      request
        .get('/hashcalc')
        .expect(405)
        .end(done);
    });

    it('should set content-type to application/json', function(done) {
      request
        .get('/hashcalc')
        .expect('Content-Type', 'application/json')
        .end(done);
    });

    it('should set allow to POST', function(done) {
      request
        .get('/hashcalc')
        .expect('Allow', 'POST')
        .end(done);
    });

    it('should send {"status": "method_not_allowed", "allow": ["POST"]}', function(done) {
      request
        .get('/hashcalc')
        .expect({status: 'method_not_allowed', allow: ['POST']})
        .end(done);
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
