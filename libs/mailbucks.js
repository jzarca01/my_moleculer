const shortHash = require("shorthash");
const dateTime = new Date().getTime();

function NewTempMail() {

}

NewTempMail.prototype.validateEmail = function(email) {
    var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return filter.test(email);
}

NewTempMail.prototype.createNewEmail = function(email)
{
    return new Promise((resolve, reject) => {
        if (this.validateEmail(email))
        {
            resolve(shortHash.unique(email + dateTime).concat("@mailbucks.tech"));
        }

        reject("Bad email : ", email);
    });
}

//NewTempMail.prototype.createNewEmail();

module.exports = NewTempMail;