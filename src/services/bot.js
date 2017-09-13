/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

module.exports = (server) => {
    const config = server.app.config;
    const services = server.app.services;

    const botService = {
        init: function () {
            this.NB_WANTED_ANIMALS = 2;
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

            const senderId = event.sender.id;
            let payload = event.postback.payload;
            const discussion = services.discussion.getDiscussion(senderId);
            discussion.messages.push(event);

            await services.facebookApi.sendTypingOn(discussion.recipientId);
            try {
                payload = JSON.parse(payload);
                if (payload.action === "adopt") {
                    await this.confirmAdoption(discussion, payload.name);
                } else {
                    await services.facebookApi.sendTextMessage(discussion.recipientId, "Je n'ai pas compris votre besoin.");
                }
            } catch (err) {
                console.error(err);
                throw new Error("Error during message processing");
            }
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
            try {
                if (payload === "WANT_DOG" || payload === "WANT_CAT") {
                    await this.proposeAnimals(discussion, payload);
                } else {
                    await services.facebookApi.sendTextMessage(discussion.recipientId, "Je n'ai pas compris votre besoin.");
                }
            } catch (err) {
                console.error(err);
                throw new Error("Error during message processing");
            }
        },
        askAnimalType: async function (discussion) {
            const replies = [
                {
                    "content_type": "text",
                    "title": "Un chien",
                    "payload": "WANT_DOG",
                    "image_url": "https://d30y9cdsu7xlg0.cloudfront.net/png/14830-200.png"
                },
                {
                    "content_type": "text",
                    "title": "Un chat",
                    "payload": "WANT_CAT",
                    "image_url": "http://dergibi.com/wp-content/uploads/2017/03/cat-with-long-tail-silhouette-277x300.png"
                }
            ];
            const text = "D'accord, quel genre d'animal souhaitez-vous adopter ?";

            await services.facebookApi.sendTextQuickReplies(discussion.recipientId, replies, text);
        },
        proposeAnimals: async function (discussion, type) {
            let animals;
            switch (type) {
                case "WANT_DOG":
                    animals = await services.animals.getDogs(this.NB_WANTED_ANIMALS);
                    break;
                case "WANT_CAT":
                    animals = await services.animals.getCats(this.NB_WANTED_ANIMALS);
                    break;
                default:
                    break;
            }

            const elements = animals.map((animal) => {
                return {
                    title: animal.name,
                    subtitle: "Adoptez moi par pitié",
                    image_url: animal.imageUrl,
                    buttons: [
                        {
                            type: "postback",
                            title: "Adopter",
                            payload: `{"action": "adopt", "name" : "${animal.name}"}`
                        }
                    ]

                };
            });

            await services.facebookApi.sendGenericMessage(discussion.recipientId, elements);
        },
        confirmAdoption: async function (discussion, name) {
            await services.facebookApi.sendTextMessage(discussion.recipientId, `Félicitations, vous avez adopté ${name}. Votre animal vous sera livré par Colissimo sous 72h. Merci de vérifier l'état du paquet lors de réception. Merci !`);

        }
    };

    return botService.init();
};