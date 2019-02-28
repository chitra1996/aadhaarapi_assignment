"use strict";

const router = require("express").Router();
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // destination folder for saving uploaded files -> ./uploads/
const log = require("./logger").logger;
const config = require("../../config");

var x = {
    userID: "",
    data: [
        {
            fileName: "",
            PAN: "",
            count: ""
        }
    ]
};

router
    .route("/profile")
    .post(upload.single("rawData"), function(req, res, next) {
        let fileName = req.file.originalname;
        fs.readFile(fileName, "utf8", (err, data) => {
            if (err) throw err;
            const content = data;
            const words = content.split(" ");
            const pans = {};
            var count = 0;
            const maskedContent = words.map(word => {
                if (word.search(/[A-Za-z]{5}\d{4}[A-Za-z]{1}/) !== -1) {
                    pans[word] = (pans[word] || 0) + 1;
                    count = count + 1;
                    return `${count}) PAN number found: **********`;
                }
            });
            const newFile = maskedContent.join(" ").replace(/\s\s+/g, "\n");
            if (count <= config.configValue && newFile.length > 5) {
                log.info({
                    Data: [
                        {
                            fileName: fileName,
                            count: count,
                            status: "uploaded"
                        }
                    ]
                });
                res.setHeader(
                    "Content-disposition",
                    "attachment; filename=PANData.txt"
                );
                res.setHeader("Content-type", "text/plain");
                res.charset = "UTF-8";
                res.write(newFile);
                res.end();
            } else {
                log.info({
                    Data: [
                        {
                            fileName: fileName,
                            count: count,
                            status: "file contains too many PANs"
                        }
                    ]
                });
                res.writeHead(200, { "Content-Type": "text/html" });
                res.write(
                    "<p id='result1'>Error: file contains no PAN or too many PANs</p>"
                );
                res.end();
            }
        });
    });

module.exports = router;
