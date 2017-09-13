/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

const rp = require("request-promise");

module.exports = (server) => {
    const config = server.app.config;
    const services = server.app.services;

    const facebookApiService = {
        init: function() {
            this.pageAccessToken = config.bot.pageAccessToken;
            this.baseURL = config.facebook.baseURL;

            return this;
        },
        _postSendApi: async function (messageData) {
            const uri = `${this.baseURL}/me/messages`;
            const options = {
                uri,
                qs: {access_token: this.pageAccessToken},
                body: messageData,
                json: true
            };

            return rp.post(options)
                .catch((err) => {
                    console.error(err);

                    throw new Error("The message couldn't be sent.");
                });
        },
        sendTextMessage: async function (recipientId, messageText) {
            const messageData = {
                recipient: {
                    id: recipientId
                },
                message: {
                    text: messageText
                }
            };

            await this._postSendApi(messageData);
        },
        sendTypingOn: async function (recipientId) {
            const messageData = {
                recipient: {
                    id: recipientId
                },
                sender_action: "typing_on"
            };

            await this._postSendApi(messageData);
        },
        sendTypingOff: async function (recipientId) {
            const messageData = {
                recipient: {
                    id: recipientId
                },
                sender_action: "typing_off"
            };

            await this._postSendApi(messageData);
        },
        getProfile: async function (personId) {
            const uri = `${this.baseURL}/${personId}`;
            const options = {
                uri,
                qs: {
                    fields: "first_name,last_name",
                    access_token: this.pageAccessToken
                },
                json: true
            }

            return rp.get(options);
        },
        sendTextQuickReplies: async function (recipientId, replies, text) {
            const messageData = {
                recipient: {
                    id: recipientId
                },
                message: {
                    text: text,
                    quick_replies: replies
                }
            };

            await this._postSendApi(messageData);
        },
        sendGenericMessage: async function (recipientId, elements) {
            const messageData = {
                recipient: {
                    id: recipientId
                },
                message: {
                    attachment: {
                        type: "template",
                        payload: {
                            template_type: "generic",
                            elements: elements
                        }
                    }
                }
            };

            console.log("On envoie ca à l'api");
            console.log(messageData);
            console.log("***");
            await this._postSendApi(messageData);
        }
    };

    return facebookApiService.init();
};