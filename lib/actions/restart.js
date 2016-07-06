const util = require('../util');

module.exports = function restart(service, opts, cb) {
  util.findServiceContainer(service, function (err, container) {
    if (err) {
      return cb(err);
    }

    if (!container) {
      return cb('Service not running!');
    }

    container.restart({ }, function(err) {
      if (err) {
        return cb(err);
      }
      console.log('Service ' + service.name + ' restarted successfully.');
      cb(null);
    });
  });
};
