/*jslint node: true this:true es6:true */
/*global this*/

"use strict";
module.exports = function (server) {
    const controllers = server.app.controllers;

    const baseRoutes = [
        {
            method: "GET",
            path: "/",
            handler: controllers.bot.getIndexAction
        },
        {
            method: "GET",
            path: "/webhook",
            handler: controllers.bot.getWebhookAction
        },
        {
            method: "POST",
            path: "/webhook",
            handler: controllers.bot.postWebhookAction
        }
    ];

    server.route(baseRoutes);
};
