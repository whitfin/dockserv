const fs   = require('fs');
const path = require('path');

const services = path.join(
  __dirname, '..', 'services'
);

exports.get = get;
exports.set = set;
exports.stream = stream;

function get(service) {
  var serv = path.join(services, service);

  try {
    serv = require(serv);
  } catch(e) {
    return;
  }

  return serv;
}

function set(service, definition, cb) {
  stream(service, fs.createReadStream(definition), cb);
}

function stream(service, instream, cb) {
  var serv = path.join(services, service + '.js');
  var outstream = fs.createWriteStream(serv);

  instream.pipe(outstream);

  outstream.on('finish', function () {
    outstream.close(cb);
  });
}
