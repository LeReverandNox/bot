/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

module.exports = (server) => {
    const config = server.app.config;
    const services = server.app.services;

    const discussionService = {
        init: function () {
            this.discussions = [];
            return this;
        },
        getDiscussion: function (recipientId) {
            let discussion;
            if (!this._isDiscussionExits(recipientId)) {
                discussion = this._newDiscussion(recipientId);
            } else {
                discussion = this.discussions.find((discussion) => {
                    return discussion.recipientId === recipientId;
                });
            }

            return discussion;
        },
        _newDiscussion: function (recipientId) {
            const discussion = {
                recipientId,
                recipientProfile: null,
                messages: []
            };
            this.discussions.push(discussion);

            return discussion;
        },
        _isDiscussionExits: function (recipientId) {
            for (let discussion of this.discussions) {
                if (discussion.recipientId === recipientId)
                    return true;
            }
            return false;
        },
        getNbMessages: function (discussion) {
            return discussion.messages.length;
        }
    };

    return discussionService.init();
};