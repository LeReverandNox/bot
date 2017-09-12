/*jslint node: true this: true es6: true */
/*global this */
"use strict";

const fs = require("fs");

exports.register = function (server, options, next) {
    server.app.services = {};
    fs.readdirSync(__dirname).forEach(function (file) {
        if (file !== "index.js" && file.indexOf('.js', file.length - 3) !== -1) {
            var name = file.substr(0, file.indexOf("."));
            server.app.services[name] = require("./" + name)(server);
        }
    });

    return next();
};

exports.register.attributes = {
    name: 'services'
};
