const fs = require('fs');
const https = require('https');

const services = require('../service');

module.exports = function add(service, options, cb) {
  createStream(options, function (instream) {
    services.stream(service, instream, cb);
  });
};

function createStream(options, cb) {
  if (options.definition) {
    return cb(fs.createReadStream(options.definition));
  }

  if (options.url) {
    return https.get(options.url, cb);
  }
}
