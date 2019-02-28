"use strict";

const router = require("express").Router();
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // destination folder for saving uploaded files -> ./uploads/
const config = require("../../config");

const logFileName = `PANData_${new Date().toISOString().split("T")[0]}.log`; // name of log file according to date.

router.route("/profile").post(upload.single("rawData"), (req, res) => {
    if (req.file) {
        let fileName = req.file.filename;

        fs.readFile("uploads/" + fileName, "utf8", (err, data) => {
            if (err) throw err;
            const content = data;
            const words = content.split(" ");
            var count = 0;
            const maskedContent = words.map(word => {
                if (word.match(/[A-Za-z]{5}\d{4}[A-Za-z]{1}/gim)) {
                    count = count + 1;
                    return `${count}) PAN number found: ##########`;
                    // return `${count}) PAN number found: ${word}`;
                }
            });

            const newFile = maskedContent.join(" ").replace(/\s\s+/g, "\n");

            fs.readFile(logFileName, "utf8", (err, data) => {
                if (err) throw err;
                if (newFile.length > 3) {
                    let Logobject = JSON.parse(data);

                    Logobject.Total_PAN_Count += parseInt(count);
                    let currentDate = new Date().toISOString();
                    Logobject.Logs.push({
                        TimeStamp: currentDate,
                        FileName: fileName,
                        Count: count
                    });
                    fs.writeFile(
                        logFileName,
                        JSON.stringify(Logobject, null, 2),
                        function(err) {
                            if (err) throw err;
                        }
                    );

                    if (Logobject.Total_PAN_Count < config.maxValue) {
                        res.setHeader(
                            "Content-disposition",
                            "attachment; filename=PANData.txt"
                        );
                        res.setHeader("Content-type", "text/plain");
                        res.charset = "UTF-8";
                        res.write(newFile);
                        res.end();
                    } else {
                        res.writeHead(200, { "Content-Type": "text/html" });
                        res.write(
                            "<p id='result1'>Error: Too many PAN numbers found in files, something seems fishy.</p>"
                        );
                        res.end();
                    }
                } else {
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.write(
                        "<p id='result1'>Error: No PAN numbers found in files.</p>"
                    );
                    res.end();
                }
            });
        });
    } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write("<p id='result1'>Error: Select a valid .txt file.</p>");
        res.end();
    }
});

module.exports = router;
