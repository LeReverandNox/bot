/*jslint node: true this: true es6: true */
/*global this */
"use strict";

const fs = require("fs");

exports.register = function (server, options, next) {
    fs.readdirSync(__dirname).forEach(function (file) {
        if (file !== "index.js") {
            var name = file.substr(0, file.indexOf("."));
            require("./" + name)(server);
        }
    });

    return next();
};

exports.register.attributes = {
    name: 'routes'
};
