const util = require('../util');

module.exports = function stop(service, opts, cb) {
  util.findServiceContainer(service, function (err, container) {
    if (err) {
      return cb(err);
    }

    if (!container) {
      return cb('Service not running!');
    }

    container.remove({ force: true }, function(err) {
      if (err) {
        return cb(err);
      }
      console.log('Service ' + service.name + ' stopped successfully.');
      cb(null);
    });
  });
};
