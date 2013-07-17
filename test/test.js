var t = require('tap'),
    path = require('path'),
    Browser = require("zombie");

var atavist = require('../'),
    root = __dirname + '/data',
    config = {
      base: root + '/content',
      views: root + '/views',
      public: root + '/public',
      port: 0
    };

console.log(root);

t.test('setup returns correct objects', function (t) {
  atavist.setup(config, function (err, data) {
    t.notOk(err, 'does not return an error');
    t.ok(data.app, 'gives back the app object');
    t.ok(data.server, 'gives back the server object');
    t.ok(data.tree, 'gives back the tree object');
    t.ok(data.files, 'gives back the files object');
    t.equal(data.files.length, 2, 'finds two files');
    t.end();
  });
});

t.test('server can be started', function (t) {
  atavist.setup(config, function (err, data) {
    t.notOk(err, 'setup does not return an error');
    atavist.start(data, function () {
      t.ok(this.address(), 'address can be called');
      t.ok(this.address().port, 'was assigned a port');
      var browser = new Browser();
      browser.visit("http://localhost:" + this.address().port, function () {
        // Form submitted, new page loaded.
        t.ok(browser.success);
        t.equal(browser.text("title"), "Index");
        atavist.stop(data);
        t.end();
      });
    });
  });
});

t.test('files can be visited', function (t) {
  atavist.setup(config, function (err, data) {
    t.notOk(err, 'setup does not return an error');
    atavist.start(data, function () {
      var url = "http://localhost:" + this.address().port + '/some-article';
      var browser = new Browser();
      browser.visit(url, function () {
        // Form submitted, new page loaded.
        t.ok(browser.success);
        t.equal(browser.text("title"), "Some article");
        atavist.stop(data);
        t.end();
      });
    });
  });
});