"use strict";

const { createLogger, format, transports } = require("winston");
require("winston-daily-rotate-file");
const { combine, colorize, timestamp, printf } = format;

const customFormat = printf(info => {
    return `[${info.timestamp}]: ${info.message}`;
});

module.exports = {
    init: function() {
        this.transport = new transports.DailyRotateFile({
            filename: "PANData-%DATE%.log",
            datePattern: "YYYY-MM-DD-HH",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "14d"
        });

        this.logger = createLogger({
            level: "info",
            format: combine(colorize(), timestamp(), customFormat),
            transports: [this.transport]
        });

        return this.logger;
    }
};
