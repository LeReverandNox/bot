/*jslint node: true this:true es6:true */
/*global this*/

"use strict";
const Hapi = require("hapi");
const inert = require("inert");
const config = require("./config");
const routes = require("./routes");
const controllers = require("./controllers");
const services = require("./services");

const server = new Hapi.Server({
    connections: {
        routes: {
            cors: true
        },
        router: {
            stripTrailingSlash: true
        }
    }
});

server.app.config = config;

server.connection({
    port: config.server.port
});

server.register([
    inert,
    services,
    controllers,
    routes
], (err) => {
    if (err) {
        throw err;
    }

    server.start((err) => {
        if (err) {
            throw err;
        }
        console.log(`The Bot app is now running on port ${server.info.port}`);
    });
});