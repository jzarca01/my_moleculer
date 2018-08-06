"use strict";
const shell = require("shelljs");
const config = require("../config/config.json");


module.exports = {
    name: "xbox",
    settings: {
        ...config.xbox,
    },
    metadata: {},
    /**
     * Service dependencies
     */
    //dependencies: [],
    actions: {
        off() {
            shell.exec('xbox-poweroff --all', this.puts);
            return "Asking Xbox to turn off";
        },
        on() {
            shell.exec(`xbox-poweron ${this.settings.xboxId}`, this.puts);
            return "Asking Xbox to turn on";
        }
    },
    events: {},
    methods: {
        puts(error, stdout, stderr) {
            console.log("stdout", stdout);
            console.log("stderr", stderr);
            console.log("error", error);
        }
    },
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