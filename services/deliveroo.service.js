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
        email: null,
        current_step: null
    },
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
        },
        track() {
            return this.trackOrder(this.settings.email, this.settings.password)
        }
    },
    methods: {
        async createAccount(mail, password, voucher) {
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
        },
        setCurrentStep(step) {
            this.settings.current_step = step;
        },
        resetCurrentStep() {
            this.settings.current_step = null;
        },
        trackOrder(mail, password) {
            deliveroo.login(mail, password)
                .then(response => deliveroo.getHistory(response.user.id))
                .then(response => response.orders[0])
                .then(latestOrder => latestOrder.consumer_status)
                .then(orderDetails => {
                    if (orderDetails.current_step !== this.settings.current_step) {
                        this.setCurrentStep(orderDetails);
                        this.broker.call("googlehome.send", {
                            message: `Votre livraison en est à l'étape: ${orderDetails.title}, elle arrivera dans ${orderDetails.eta_minutes} minutes`
                        });
                    }
                    if (this.settings.current_step.code === "COMPLETE") {
                        this.resetCurrentStep()
                        this.setEmail(null)
                    } else {
                        setTimeout(function () {
                            this.trackOrder(mail, password)
                        }, 120000);
                    }
                })
                .catch(err => {
                    this.broker.call("googlehome.send", {
                        message: `Un problème est survenu avec le traqueur`
                    });
                    console.log("err", err)
                })
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