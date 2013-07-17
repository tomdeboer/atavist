/**
 * atavist
 * make things with markdown.
 */

var express = require('express'),
    http    = require('http'),
    _       = require('lodash/dist/lodash.underscore'),
    mdtree  = require('mdtree'),
    cons    = require('consolidate');

/**
 * Default settings
 */
exports.defaults = {
  // Port that the server starts on
  port: 8000,
  // NB: all paths should be absolute
  // Content directory
  base: 'content',
  // View directory
  views: 'views',
  // Public files directory
  public: 'public',
  // View engine
  engine: cons.hogan,
  // View file extension
  extension: 'html',
  // Express logger
  logger: 'dev',
  // Use gzip?
  compress: true
};

/**
 * Express setup
 */

exports.setup = function (config, done) {

  var app = express(),
      server = http.createServer(app);

  config = _.defaults(config, exports.defaults);

  app.set('port', config.port || 8000);

  // Views
  app.set('views', config.views);
  app.set('view engine', config.extension);
  app.engine('html', config.engine);

  // Logging
  app.use(express.logger(config.logger));
  // gzip
  if (config.compress) app.use(express.compress());

  // Favicon
  if (config.favicon) app.use(express.favicon(config.favicon));
  // Use express routing
  app.use(app.router);
  // Serve static files
  app.use(express.static(config.public));

  /**
   * Content setup & routing
   */

  // Search the content directory for all articles
  mdtree.build(config.base, function (err, tree) {

    if (err) return done(err);

    // Flatten the list of files for navigation
    var files = mdtree.files(tree);

    // Iterate through them, creating a URL and setting up a route
    files.forEach(function (file) {
      file.url = ('/' + file.urlPath.replace(config.base, '')).replace(/\/\//, '/');
      file.files = files;
      app.get(file.url, function (req, res) {
        res.render(file.layout || 'index', file);
      });
    });

    done(null, {
      app: app,
      server: server,
      tree: tree,
      files: files
    });

  });
};

exports.start = function (ata, cb) {
  ata.server.listen(ata.app.get('port'), cb);
};

exports.stop = function (ata, cb) {
  ata.server.close(cb);
};

