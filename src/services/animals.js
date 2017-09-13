/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

const ai = require("apiai");

module.exports = (server) => {
    const config = server.app.config;
    const services = server.app.services;

    const animalsService = {
        init: function () {
            return this;
        },
        getDogs: async function (nb) {
            return [
                {
                    name: "Ouaf",
                    type: "Chien",
                    imageUrl: "https://static.pexels.com/photos/356378/pexels-photo-356378.jpeg"
                },
                {
                    name: "Paf",
                    type: "Chien",
                    imageUrl: "https://usercontent2.hubstatic.com/8709045_f496.jpg"
                }
            ];
        },
        getCats: async function (nb) {
            return [
                {
                    name: "Ronron",
                    type: "Chat",
                    imageUrl: "http://www.cats.org.uk/uploads/images/pages/photo_latest14.jpg"
                },
                {
                    name: "Minou",
                    type: "Chat",
                    imageUrl: "https://www.polyvore.com/cgi/img-thing?.out=jpg&size=l&tid=38632134"
                }
            ];
        }
    };

    return animalsService.init();
};