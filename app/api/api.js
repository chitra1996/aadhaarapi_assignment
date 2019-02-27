"use strict";

const router = require("express").Router();
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // destination folder for saving uploaded files -> ./uploads/
const log = require("./logger").logger;

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
            log.info({
                Data: [
                    {
                        fileName: fileName,
                        count: count
                    }
                ]
            });
            const newFile = maskedContent.join(" ").replace(/\s\s+/g, "\n");
            res.setHeader(
                "Content-disposition",
                "attachment; filename=PANData.txt"
            );
            res.setHeader("Content-type", "text/plain");
            res.charset = "UTF-8";
            res.write(newFile);
            res.end();
        });
    });

module.exports = router;
