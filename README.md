# Interview assignment

The main deliverable of this assignment is a *Hash Computation Service* program, written in *Javascript* using *Node.js*.

## Context

You are creating an HTTP-based service for computing MD5 hashes of raw data. The client will be able to send any data (usually a file) to the service, to which the service responds with the computed hash. The server will keep some statistics of the requests. These statistics are also available to the client.

## Requirements

A server accepting HTTP requests with the following URL end-points:
  - `/hashcalc` (`POST`): Computes the MD5 hash of all data in the request body. (More details below.)
  - `/stats` (`GET`): Return statistics for the current host. (More details below.)

All other URL's will result in a "Not found" response.

### Hash calculation

The "payload" data used for computing the hash is the *raw data from the request body*, thus disregarding any content-type request header. The response is a JSON object with the following structure:
```javascript
{
  "host": <host_name>, // Host name found in the HTTP request's "Host" header.
  "hash": <hash_value>, // In hexadecimal format (e.g. "78fcf6aa242b950ae9627e529dc0067f").
  "time": <processing_time>, // Processing time of the request (data transfer + hash computation) in milliseconds.
  "size": <payload_size> // Size of the payload in bytes.
}
```

### Statistics

The statistics to return should only take into account the hash-calculation requests made with the *same hostname* (i.e. with the same HTTP "Host" header) as the statistics request.

The following statistics should be returned:
  - The number of currently active hash computations.
  - The size in bytes of the largest encountered payload.
  - The average size in bytes of the all payloads.
  - The average processing time (in milliseconds) *per megabyte* (2^20 bytes) of payload data.

The response is a JSON object with the following structure:
```javascript
{
  "host": <host_name>,
  "stats": {
    "active": <active_computations>,
    "max_payload": <maximum_payload>, // In bytes.
    "average_payload": <average_payload>, // In bytes.
    "average_time_per_mb": <average_time_per_mb> // A decimal number (float). In MB's per millisecond.
  }
}
```

## Constraints

- The program should be written in Javascript.
- The program should run with any 0.10.* of Node.js.
- You can only use libraries that are listed on the API page of Node.js (http://nodejs.org/api/). Don't use external code and don't use any NPM packages.
- The program needs to be able to handle arbitrarily sized request bodies (think gigabytes and even bigger!).
- The program's memory usage should be limited to somewhere in the order of megabytes.
- The statistics do *not* have to be persistent between program executions.

## Deliverables

- The Javascript source code of the program, runnable with Node.js 0.10.*
- A document describing briefly your technical analysis and choices. Also discuss any shortcuts you (might) have taken. Consider to be shortcuts all differences between what you would normally deliver professionally and what you have delivered for this assignment.
