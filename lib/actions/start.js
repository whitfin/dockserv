const docker = require('../docker');
const util   = require('../util');

module.exports = function start(service, opts, cb) {
  service = util.ensureService(service);

  util.findServiceContainer(service, function (err, container) {
    if (err) {
      return cb(err);
    }

    if (container) {
      return cb('Service already started!');
    }

    ensureImage(service, opts, cb);
  })
};

function ensureImage(service, opts, cb) {
  docker.listImages(function (err, images) {
    if (err) {
      return cb(err);
    }

    var tag = [ service.image, opts.version ].join(':');

    var local = images
      .filter(function (image) {
        return image['RepoTags'].indexOf(tag) !== -1;
      })
      .sort(function (a, b) {
        if (a['Created'] < b['Created']) {
          return -1
        }

        if (a['Created'] > b['Created']) {
          return 1;
        }

        return 0;
      })
      .shift();

    if (!local) {
      return pullImage(tag, service, cb);
    }

    startImage(local.Id, service, cb);
  });
}

function pullImage(tag, service, cb) {
  console.info('Pulling latest image...');
  docker.pull(tag, function (err, stream) {
    if (err) {
      return cb(err);
    }
    stream.on('data', function (d) { });
    stream.once('end', function () {
      startImage(tag, service, cb);
    });
  });
}

function startImage(tag, service, cb) {
  var opts = {
    Image: tag,
    AttachStdin : false,
    AttachStdout: true,
    AttachStderr: true,
    Binds: util.normalizeBinds(service.binds),
    Env: service.env,
    Tty: false,
    name: service.name + '_service'
  };

  if (service.ports.length) {
    opts.ExposedPorts = { };
    opts.PortBindings = { };
  }

  service.ports.forEach(function (port) {
    opts.ExposedPorts[port] = { };
    opts.PortBindings[port] = [{
      HostIP: '0.0.0.0',
      HostPort: port
    }];
  });

  console.info('Creating container...');

  docker.createContainer(opts, function (err, container) {
    if (err) {
      return cb(err);
    }
    startContainer(container, service, cb);
  });
}

function startContainer(container, service, cb) {
  console.info('Starting service...');
  container.start({ }, function(err) {
    if (err) {
      return cb(err);
    }

    var shortId = container.id.substr(0, 12);
    console.info('Service ' + service.name + ' started successfully at ' + shortId + '.');

    cb(null, container.id);
  });
}
