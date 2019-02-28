"use strict";

const fs = require("fs");

module.exports = {
    init: function() {
        this.path = `PANData_${new Date().toISOString().split("T")[0]}.log`;

        if (!fs.existsSync(this.path)) {
            const logFile = fs.createWriteStream(this.path);
            logFile.write('{"Total_PAN_Count": 0 , "Logs": []}');
            logFile.end();
            console.log("File created");
        } else {
            const logFile = fs.readFile(this.path, "utf8", (err, data) => {
                if (data.length < 5) {
                    const logFile = fs.createWriteStream(this.path);
                    logFile.write('{"Total_PAN_Count": 0 , "Logs": []}');
                    logFile.end();
                    console.log("New file created");
                } else {
                    console.log("File exists");
                }
            });
        }
    }
};
