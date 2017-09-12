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
            const payload = req.payload;
            console.log("Voici la payload d'un post sur /webhook");
            console.log(payload);
            console.log("***");

            try {
                if (payload.object !== 'page') {
                    throw new Error("Hit not coming from a page, skipping...");
                }

                const entries = payload.entry;
                let entry;
                for(entry of entries) {
                    const pageID = entry.id;
                    const timeOfEvent = entry.time;

                    const events = entry.messaging;
                    if (!events) {
                        throw new Error("No event to process, skipping...");
                    }

                    let event;
                    for (event of events) {
                        if (event.message) {
                            await services.bot.receivedMessage(event);
                        } else if (event.postback) {
                            await services.bot.receivedPostback(event);
                        } else {
                            console.log("Webhook received unknown event: ", event);
                        }
                    };
                };
            } catch (e) {
                console.error(e);
            }

            return rep().code(200);
        }
    };

    return botController;
};