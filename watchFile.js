const fs = require("fs");
const config = require("./config");
var nodemailer = require("nodemailer");

const logFileName = `PANData_${new Date().toISOString().split("T")[0]}.log`; // name of log file according to date.

var transporter = nodemailer.createTransport({
    service: config.mail.host,
    auth: {
        user: config.mail.user,
        pass: config.mail.pass
    }
});

var mailOptions = {
    from: config.mail.from,
    to: config.mail.user,
    subject: "Error in File Uploads",
    text: "Too many PAN numbers in files found, something seems fishy."
};

function sendMail() {
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
}

fs.watch(logFileName, { encoding: "buffer" }, event => {
    if (event == "change") {
        fs.readFile(logFileName, "utf8", (err, data) => {
            if (err) throw err;
            const contents = data.split(" ");
            Total_PAN_Count = parseInt(contents[3]);
            if (Total_PAN_Count > config.maxValue) {
                sendMail();
                console.log(
                    "Error: Too many PAN numbers in files found, something seems fishy."
                );
            } else {
                console.log("File uploaded!");
            }
        });
    }
});
