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
        receivedEvent: async function (event) {
            if (event.message) {
                if (event.message.quick_reply) {
                    await this.receivedQuickReply(event);
                } else {
                    await this.receivedMessage(event);
                }
            } else if (event.postback) {
                await this.receivedPostback(event);
            } else {
                console.log("Webhook received unknown event: ", event);
            }
        },
        receivedMessage: async function (event) {
            console.log(`C'est un message`);
            console.log(event);
            console.log("****");

            const senderId = event.sender.id;
            const text = event.message.text;
            const discussion = services.discussion.getDiscussion(senderId);
            discussion.messages.push(event);

            await services.facebookApi.sendTypingOn(discussion.recipientId);
            try {
                if (services.discussion.getNbMessages(discussion) === 1) {
                    const profile = await services.facebookApi.getProfile(discussion.recipientId);
                    discussion.recipientProfile = profile;

                    await services.facebookApi.sendTextMessage(discussion.recipientId, `Bonjour ${discussion.recipientProfile.first_name} ! =P`);
                } else {
                    try {
                        await services.apiai.isAdoptingAnimal(text);
                        await this.askAnimalType(discussion);
                    } catch (err) {
                        console.log(err);
                        await services.facebookApi.sendTextMessage(discussion.recipientId, "Je n'ai pas compris votre besoin.");
                    }
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
        },
        receivedQuickReply: async function (event) {
            console.log(`C'est une quick_reply`);
            console.log(event);
            console.log("****");

            const senderId = event.sender.id;
            const text = event.message.text;
            const payload = event.message.quick_reply.payload;
            const discussion = services.discussion.getDiscussion(senderId);
            discussion.messages.push(event);

            await services.facebookApi.sendTypingOn(discussion.recipientId);

            if (payload === "WANT_DOG" || payload === "WANT_CAT") {
                await this.proposeAnimals(discussion, payload);
            } else {
                await services.facebookApi.sendTextMessage(discussion.recipientId, "Je n'ai pas compris votre besoin.");
            }
        },
        askAnimalType: async function (discussion) {
            const replies = [
                {
                    "content_type": "text",
                    "title": "Un chien",
                    "payload": "WANT_DOG"
                },
                {
                    "content_type": "text",
                    "title": "Un chat",
                    "payload": "WANT_CAT"
                }
            ];
            const text = "D'accord, quel genre d'animal souhaitez-vous adopter ?";

            await services.facebookApi.sendTextQuickReplies(discussion.recipientId, replies, text);
        },
        proposeAnimals: async function (discussion, type) {
            let animals;
            switch (type) {
                case "WANT_DOG":
                    animals = await services.animals.getDogs(2);
                    break;
                case "WANT_CAT":
                    animals = await services.animals.getCats(2);
                    break;
                default:
                    break;
            }

            console.log("On va envoyer ces animaux");
            console.log(animals);

            const elements = [
                {
                    title: animals[0].name,
                    subtitle: "Un animal qu'il est mignon !",
                    image_url: animals[0].imageUrl
                },
                {
                    title: animals[1].name,
                    subtitle: "Un animal qu'il est mignon aussi !",
                    image_url: animals[1].imageUrl
                }
            ];

            await services.facebookApi.sendGenericMessage(discussion.recipientId, elements);
        }
    };

    return botService.init();
};