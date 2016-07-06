const dots = require('dot-notes');
const fs   = require('fs');
const path = require('path');

const configDir = path.join(
  __dirname,
  '..',
  'config'
);

const defPath = path.join(configDir, 'default.json');
const conPath = path.join(configDir,  'config.json');

exports.getConfig = getConfig;
exports.reset = reset;
exports.set = set;

function getConfig(cb) {
  var err, conf;

  try {
    conf = require(conPath);
    err  = null;
  } catch(e) {
    err = e;
  }

  return cb(err, conf);
}

function reset(cb) {
  del(function () {
    var outstream = fs.createWriteStream(conPath);
    var instream  = fs.createReadStream(defPath);

    instream.pipe(outstream);
    instream.on('error', cb);
    instream.on('end', cb);
  });
}

function set(key, value, cb) {
  getConfig(function (err, config) {
    if (err) {
      return cb(err);
    }

    dots.create(config, key, value);

    write(config, function (err) {
      if (err) {
        return cb(err);
      }
      cb();
    });
  });
}

/*
  Internals.
 */

function del(cb) {
  try {
    fs.accessSync(conPath);
    fs.unlink(conPath, function () {
      cb();
    });
  } catch(e) {
    cb();
  }
}

function write(config, cb) {
  del(function () {
    fs.writeFile(conPath, JSON.stringify(config, null, 2), cb);
  });
}
