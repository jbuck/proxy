#!/usr/bin/env node

const filePath = '/var/nodejs/proxy/config.json',
      validCommands = ['list', 'add', 'remove'];

var fs = require('fs')
    config = require(filePath);

function errorStr(error) {
  if (error) {
    console.log("error: " + error);
  }
  console.log("usage: configurator.js list \n\
  or   configurator.js add key=value [key=value]...\n\
  or   configurator.js remove key [key]...");
  process.exit(1);
}

var argv = process.argv;
argv.shift();
argv.shift();

if (argv.length == 0) {
  errorStr();
}

if (validCommands.indexOf(argv[0]) == -1) {
  errorStr("unknown command '" + argv[0] + "'");
}

var command = argv.shift();

if (command == "list") {
  console.log(config);
  return;
}

if (command == "add") {
  if (argv.length == 0) {
    errorStr("no key to add");
  }

  argv.forEach(function(value, index, arr) {
    var m = value.match(/^(.+?)=(.+)$/);
    if (!m) {
      errorStr("invalid key-value tuple '" + value + "'");
    }

    config[m[1]] = m[2];
  });
} else if (command == "remove") {
  if (argv.length == 0) {
    errorStr("no key to remove");
  }

  argv.forEach(function(value, index, arr) {
    delete config[value];
  });
}

var output = JSON.stringify(config, null, 2) + "\n";
fs.writeFileSync(filePath, output);
