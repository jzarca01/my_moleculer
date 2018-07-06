"use strict";
const config = require("../config/config.json");

const NewTempMail = require("../libs/mailbucks");
const newTempMail = new NewTempMail();

const Deliveroo = require("node-deliveroo");
const deliveroo = new Deliveroo();

module.exports = {
    name: "deliveroo",
    settings: {
        ...config.user,
        voucher: config.voucher,
        email: ""
    },
    metadata: {},
    /**
     * Service dependencies
     */
    //dependencies: [],
    actions: {
        account() {
            return this.createAccount(
                this.settings.mail,
                this.settings.password,
                this.settings.voucher
            );
        },
        voucher: {
            params: {
                new: "string"
            },
            handler(ctx) {
                this.settings.voucher = ctx.params.new;
                return `Voucher updated ${this.settings.voucher}`;
            }
        }
    },
    methods: {
        createAccount(mail, password, voucher) {
            return newTempMail
                .createNewEmail(mail)
                .then(email => {
                    this.setEmail(email);
                    return deliveroo.signUp(email, password);
                })
                .then(response =>
                    deliveroo.addVoucherToUser(response.user.id, this.settings.voucher)
                )
                .then(() => {
                    this.broker.call("pushover.send", {
                        title: "Deliveroo account",
                        message: `${this.settings.email}:${this.settings.password}`
                    });
                    return `Account created ${this.settings.email}:${this.settings.password}`;
                })
                .catch(err => `An error occured : ${err}`);
        },
        setEmail(email) {
            this.settings.email = email
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