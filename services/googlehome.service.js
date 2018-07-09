"use strict";
const googlehome = require('google-home-notifier');

module.exports = {
    name: "googlehome",
    settings: {
        name: 'Google-Home',
        language: 'fr'
    },
    metadata: {},
    /**
     * Service dependencies
     */
    //dependencies: [],
    actions: {
        send: {
            params: {
                message: "string"
            },
            handler(ctx) {
                googlehome.notify(ctx.params.message, res => {
                    console.log(res);
                });
            }
        }
    },
    /**
     * Service created lifecycle event handler
     */
    created() {
        googlehome.device(this.settings.name, this.settings.language)
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