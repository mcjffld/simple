'use strict';

var Hapi = require('hapi');
var Path = require('path');

var server = new Hapi.Server();


var winston = require('winston');

winston.add(winston.transports.DailyRotateFile, {filename: 'logs/test', datePattern: '.yyyy-MM-dd'});

var toCommonLogFormat = require('hapi-common-log');

server.connection({
    host: 'localhost',
    port: Number(process.argv[2] || 3000)
});

server.ext('onPostHandler', function (request, reply) {
  winston.info(toCommonLogFormat(request));
  reply(request.response);
});


server.route({
  path: '/',
  method:'GET',
  handler: {
    view: 'index.html'
  }
});

server.views({
  engines: {
    html: require('handlebars')
  },
  path: Path.join(__dirname, 'templates'),
  helpersPath: 'helpers'
});


server.start();
