# dockserv

Simplified service manager using Docker containers.

### Installation

You should install this module globally, as it's designed to be a command line tool.

```bash
$ npm install -g zackehh/dockserv
```

### Basic Usage 

The basic idea is that you load definitions into `dockserv` to easily start/stop services. One such example is the below (for `mongodb`).

```javascript
module.exports = {
  image: 'mongo',
  binds: [
    '$DOCKSERV_DATA/mongodb:/data/db'
  ],
  env: [
    'FOO=bar'
  ],
  ports: [
    '27017'
  ]
};
```

Super simple, the above defines that we want to use the MongoDB image, bind the data directory, and forward port 27017. `$DOCKSERV_DATA` is equal to `$DOCKSERV_HOME/data`, and `$DOCKSERV_HOME` can be changed via `$ dserv set prefix <path>`.

Assuming the above lives in a file named `mongo.js`, you can load it into `dockserv` easily:

```bash
$ dserv add mongodb mongo.js
```

And at that point, you can start/stop as needed:

```bash
$ dserv start mongodb
$ dserv stop mongodb
$ dserv restart mongodb
```

You can also load definitions from a URL, for example:

```bash
$ dserv add mongodb https://gist.github.com/zackehh/f078940d29bf3f5fe8e4c5a568d06c48/raw/mongodb.js
```

### Commands

You can view all available commands using `$ dserv --help` until I get some documentation up and running, it should be pretty straightforward.
