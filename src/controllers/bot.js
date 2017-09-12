/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

module.exports = (server) => {
    const services = server.app.services;
    const config = server.app.config;

    const botController = {
        getIndexAction: async (req, rep) => {

        },
        getWebhookAction: async (req, rep) => {
            const query = req.query;
            const hubMode = query['hub.mode'];
            const hubVerifyToken = query['hub.verify_token'];
            const hubChallenge = query['hub.challenge'];

            if (hubMode === 'subscribe' && hubVerifyToken === config.bot.verifyToken) {
                return rep(hubChallenge);
            } else {
                return rep().code(403);
            }
        },
        postWebhookAction: async (req, rep) => {

        }
    };

    return botController;
};