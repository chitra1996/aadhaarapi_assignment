"use strict";

const { createLogger, format, transports } = require("winston");
const { combine, colorize, timestamp, printf } = format;

// const DailyRotateFile = require("winston-daily-rotate-file");

const customFormat = printf(info => {
    return `[${info.timestamp}] ${info.level}: ${info.message}`;
});

module.exports = {
    init: function() {
        this.logger = createLogger({
            level: "info",
            format: combine(timestamp(), format.json()),
            transports: [
                new transports.Console(),
                // Write to all logs with level `info` and below to `PANData.log`
                new transports.File({ filename: "PANData.log" })
            ]
        });

        // If we're not in production then log to the `console` with the format:
        if (process.env.NODE_ENV !== "production") {
            this.logger.add(
                new transports.Console({
                    colorize: true,
                    format: combine(colorize(), timestamp(), customFormat)
                })
            );
        }

        // this.logger.configure({
        //     level: "verbose",
        //     transports: [
        //         new DailyRotateFile({
        //             colorize: true,
        //         })
        //     ]
        // });
        return this.logger;
    }
};
