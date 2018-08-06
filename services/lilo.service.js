"use strict";
const shell = require("shelljs");

module.exports = {
    name: "lilo",
    settings: {},
    metadata: {},
    /**
     * Service dependencies
     */
    //dependencies: [],
    actions: {
        off() {
            shell.exec("node ~/LILO/index.js --light 00");
            return "Asking LILO to turn off the lights";
        },
        on: {
            params: {
                weekend: "string"
            },
            handler(ctx) {
                const timeFrame = ctx.params.weekend === 'true' ? "12,00,23,59" : "09,00,23,00";
                shell.exec(`node ~/LILO/index.js --time ${timeFrame}`);
                return `LILO Mode Weekend: ${ctx.params.weekend === 'true' ? "enabled" : "disabled"}`;
            }
        }
    },
    events: {},
    methods: {},
    /**
     * Service created lifecycle event handler
     */
    created() {},

    /**
     * Service started lifecycle event handler
     */
    started() {},

    /**
     * Service stopped lifecycle event handler
     */
    stopped() {}
};