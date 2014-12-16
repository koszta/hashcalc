var server = require('../server'),
    request = require('supertest')(server),
    http = require('http');

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

      describe('.active', function() {
        context('no active hashing', function() {
          it('should be 0', function(done) {
            request
              .get('/stats')
              .end(function(err, res) {
                if (err) throw err;

                res.body.stats.active.should.equal(0);
                done();
              });
          });
        });

        context('active hashing', function() {
          var req;

          beforeEach(function(done) {
            req = http.request({
              hostname: '127.0.0.1',
              port: 3000,
              path: '/hashcalc',
              method: 'POST'
            });
            req.write('test');
            setTimeout(done, 10);
          });

          afterEach(function() {
            req.end();
          });

          it('should return the number of active hashing', function(done) {
            request
              .get('/stats')
              .end(function(err, res) {
                if (err) throw err;

                res.body.stats.active.should.equal(1);
                done();
              });
          });
        });

        context('active hashing on different host', function() {
          var req;

          beforeEach(function(done) {
            req = http.request({
              hostname: '127.0.0.1',
              port: 3000,
              path: '/hashcalc',
              method: 'POST'
            });
            req.write('test');
            setTimeout(done, 10);
          });

          afterEach(function() {
            req.end();
          });

          it('should be 0', function(done) {
            request
              .get('/stats')
              .set('host', 'other-host.com')
              .end(function(err, res) {
                if (err) throw err;

                res.body.stats.active.should.equal(0);
                done();
              });
          });
        });
      });

      describe('.max_payload', function() {
        context('no hashing done on the host yet', function() {
          it('should be 0', function(done) {
            request
              .get('/stats')
              .set('host', 'no-hash.com')
              .end(function(err, res) {
                if (err) throw err;

                res.body.stats.max_payload.should.equal(0);
                done();
              });
          });
        });

        context('hashed a few bytes', function() {
          beforeEach(function(done) {
            request
              .post('/hashcalc')
              .set('host', 'hashed4bytes.com')
              .send('test')
              .end(done);
          });

          it('should be the number of bytes sent', function(done) {
            request
              .get('/stats')
              .set('host', 'hashed4bytes.com')
              .end(function(err, res) {
                if (err) throw err;

                res.body.stats.max_payload.should.equal(4);
                done();
              });
          });
        });
      });

      describe('.average_payload', function() {
        context('no hashing done on the host yet', function() {
          it('should be 0', function(done) {
            request
              .get('/stats')
              .set('host', 'no-hash.com')
              .end(function(err, res) {
                if (err) throw err;

                res.body.stats.average_payload.should.equal(0);
                done();
              });
          });
        });

        context('hashed a few bytes', function() {
          beforeEach(function(done) {
            request
              .post('/hashcalc')
              .set('host', 'average-payload.com')
              .send('test')
              .end(done);
          });

          beforeEach(function(done) {
            request
              .post('/hashcalc')
              .set('host', 'average-payload.com')
              .send('test')
              .end(done);
          });

          it('should be the number of bytes sent', function(done) {
            request
              .get('/stats')
              .set('host', 'average-payload.com')
              .end(function(err, res) {
                if (err) throw err;

                res.body.stats.average_payload.should.equal(4);
                done();
              });
          });
        });
      });

      describe('.average_time_per_mb', function() {
        context('no hashing done on the host yet', function() {
          it('should be 0', function(done) {
            request
              .get('/stats')
              .set('host', 'no-hash.com')
              .end(function(err, res) {
                if (err) throw err;

                res.body.stats.average_time_per_mb.should.equal(0);
                done();
              });
          });
        });

        context('hashed a few bytes', function() {
          beforeEach(function(done) {
            request
              .post('/hashcalc')
              .set('host', 'average-time-per-mb.com')
              .send('test')
              .end(done);
          });

          beforeEach(function(done) {
            request
              .post('/hashcalc')
              .set('host', 'average-time-per-mb.com')
              .send('test')
              .end(done);
          });

          it('should be the number of bytes sent', function(done) {
            request
              .get('/stats')
              .set('host', 'average-time-per-mb.com')
              .end(function(err, res) {
                if (err) throw err;

                res.body.stats.average_time_per_mb.should.be.above(10000);
                res.body.stats.average_time_per_mb.should.be.below(100000);
                done();
              });
          });
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
