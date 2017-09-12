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

            return rp.post(options);
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

            try {
                await this._postSendApi(messageData);
            } catch (err) {
                console.error(err);

                throw new Error("The message couldn't be sent.");
            }
        },
        sendTypingOn: async function (recipientId) {
            const messageData = {
                recipient: {
                    id: recipientId
                },
                sender_action: "typing_on"
            };

            try {
                await this._postSendApi(messageData);
            } catch (err) {
                console.error(err);

                throw new Error("The message couldn't be sent.");
            }
        },
        sendTypingOff: async function (recipientId) {
            const messageData = {
                recipient: {
                    id: recipientId
                },
                sender_action: "typing_off"
            };

            try {
                await this._postSendApi(messageData);
            } catch (err) {
                console.error(err);

                throw new Error("The message couldn't be sent.");
            }
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
        }
    };

    return facebookApiService.init();
};