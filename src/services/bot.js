/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

module.exports = (server) => {
    const config = server.app.config;
    const services = server.app.services;

    const botService = {
        init: function () {
            return this;
        },
        receivedMessage: async function (event) {
            console.log(`C'est un message`);
            console.log(event);
            console.log("****");

            const senderId = event.sender.id;
            const text = event.message.text;
            const discussion = services.discussion.getDiscussion(senderId);
            discussion.messages.push(event);

            try {
                if (services.discussion.getNbMessages(discussion) === 1) {
                    const profile = await services.facebookApi.getProfile(senderId);
                    discussion.recipientProfile = profile;

                    await services.facebookApi.sendTextMessage(senderId, `Bonjour ${discussion.recipientProfile.first_name} ! =P`);
                    await services.facebookApi.sendTypingOn(senderId);
                } else {
                    await services.facebookApi.sendTextMessage(senderId, text);
                    await services.facebookApi.sendTypingOn(senderId);
                }
            } catch (err) {
                console.error(err);

                throw new Error("Error during message processing");
            }
        },
        receivedPostback: async function (event) {
            console.log(`C'est un postback`);
            console.log(event);
            console.log("****");
        }
    };

    return botService.init();
};