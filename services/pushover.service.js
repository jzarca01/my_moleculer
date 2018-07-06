"use strict";
const Pushover = require('node-pushover');
const config = require("../config/config.json");

module.exports = {
    name: "pushover",
    settings: config.pushover,
    metadata: {},
    /**
     * Service dependencies
     */
    //dependencies: [],
    actions: {
        send: {
            params: {
                title: "string",
                message: "string"
            },
            handler(ctx) {
                this.push.send(ctx.params.title, ctx.params.message)
            }
        }
    },
    /**
     * Service created lifecycle event handler
     */
    created() {
        this.push = new Pushover({
            token: this.settings.appKey,
            user: this.settings.userKey
        });
    },

    /**
     * Service started lifecycle event handler
     */
    started() {},

    /**
     * Service stopped lifecycle event handler
     */
    stopped() {}
};