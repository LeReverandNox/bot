/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

const rp = require("request-promise");
const catNames = require("cat-names");
const dogNames = require("dog-names");

module.exports = (server) => {
    const config = server.app.config;
    const services = server.app.services;

    const animalsService = {
        init: function () {
            this.dogApiUrl = config.dog.apiUrl;
            this.catApiUrl = config.cat.apiUrl;

            return this;
        },
        getDogs: async function (nb) {
            const dogs = [];

            for (let i = 0; i < nb ; i += 1) {
                let options = {
                    json: true,
                    uri: `${this.dogApiUrl}/breeds/image/random`
                };

                let dogImageUrl = await rp.get(options).then(res => res.message);
                let dog = {
                    name: dogNames.allRandom(),
                    type: "Chien",
                    imageUrl: dogImageUrl
                };

                dogs.push(dog);
            }

            return dogs;
        },
        getCats: async function (nb) {
            const cats = [];

            for (let i = 0; i < nb; i += 1) {
                let options = {
                    uri: `${this.catApiUrl}`
                };

                let catImageUrl = await rp.get(options).then(res => JSON.parse(res)).then(res => res.file);
                let cat = {
                    name: catNames.random(),
                    type: "Chat",
                    imageUrl: catImageUrl
                };

                cats.push(cat);
            }

            return cats;
        }
    };

    return animalsService.init();
};