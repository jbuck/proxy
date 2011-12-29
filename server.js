var http = require('http'),
    httpProxy = require('http-proxy'),
    fs = require('fs'),
    util = require('util'),
    configFile = './config.json',
    options = {
      hostnameOnly: true,
      router: {}
    },
    proxyServer = httpProxy.createServer(options);

fs.watchFile(configFile, function (curr,prev) {
  // only looking for file changes
  if (curr.mtime.toString() === prev.mtime.toString()) return;

  util.log('config updated');
  fs.readFile(configFile, 'utf8', function (err, data) {
    if (!err) {
      try {
        options.router = JSON.parse(data || '{}');
      } catch (e) {
        options.router = {};
      }
      proxyServer.close();
      proxyServer = httpProxy.createServer(options);
      proxyServer.listen(process.env.PORT || 80);
    }
  });
});

proxyServer.listen(process.env.PORT || 80);