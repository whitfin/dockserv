const path = require('path');

const config = require('./config');
const docker = require('./docker');

exports.ensureService = ensureService;
exports.getHomeDirectory = getHomeDirectory;
exports.findServiceContainer = findServiceContainer;
exports.normalizeBinds = normalizeBinds;

function ensureService(service) {
  service.env   = service.env   || [];
  service.binds = service.binds || [];
  service.ports = service.ports || [];

  return service;
}

function findServiceContainer(service, cb) {
  docker.listContainers({ all: true }, function (err, containers) {
    if (err) {
      return cb(err);
    }

    var container = containers.find(function (container) {
      return container.Names.shift() === '/' + service.name + '_service';
    });

    cb(null, container && docker.getContainer(container.Id) || undefined);
  });
}

function getHomeDirectory() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

function normalizeBinds(binds) {
  return config.getConfig(function (err, config) {
    if (err) {
      return binds;
    }
    return binds.map(function (bind) {
      return bind
        .replace(/\$DOCKSERV_HOME/g, config.prefix)
        .replace(/\$DOCKSERV_DATA/g, path.join(config.prefix, 'data'))
        .replace(/\$HOME/g, getHomeDirectory());
    });
  })
}
