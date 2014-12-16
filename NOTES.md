# Notes

## Libraries

The external libraries only used for testing and they are not dependencies of the server, they are only added to the `devDependencies`. To install them run `npm install`.

## Running the server

`npm start`

By default it listens on 127.0.01, port 3000, you can easily specify them via environmental variables `HOST`, `PORT`.

## Running the tests

`npm test`

This will run the whole test suite with mocha, chai (should), supertest (for requests).

## Method Not Allowed

Even though it was not mentioned in the assignment, when someone sends a `POST /stats` or `GET /` it should not send a 404 according to the [HTTP Status Code Definitions](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html).

## process.hrtime()

Safer than new Date(), because it is not related to the time of day and therefore not subject to clock drift, see: [node api docs process.hrtime()](http://nodejs.org/api/process.html#process_process_hrtime).
