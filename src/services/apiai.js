/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

const ai = require("apiai");

module.exports = (server) => {
    const config = server.app.config;
    const services = server.app.services;

    const apiaiService = {
        init: function () {
            this.clientAccessToken = config.apiAi.clientAccessToken;
            this.agent = ai(this.clientAccessToken);

            return this;
        },
        isAdoptingAnimal: async function (text) {
            return new Promise((resolve, reject) => {
                const request = this.agent.textRequest(text, {
                    sessionId: '<unique session id>'
                });

                request.on('response', (response) => {
                    const result = response.result;
                    const metadata = result.metadata;
                    const intentName = metadata.intentName

                    if (intentName === "Adopter un animal") {
                        return resolve();
                    }
                    return reject();
                });

                request.on('error', (err) => {
                    console.error(err);
                    return reject(err);
                });

                request.end();
            });
        }
    };

    return apiaiService.init();
};