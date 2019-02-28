const chokidar = require("chokidar");
// const log = require("./logger").logger;

chokidar
    .watch("../../PANData.log", {
        ignored: /[\/\\]\./,
        persistent: true,
        alwaysStat: true,
        ignoreInitial: false
    }).on("change", (event, path) => {
        console.log(event,path);
        log.info({
            Data: [
                {
                    fileName: fileName,
                    count: count,
                    status: "LIMIT CROSSED"
                }
            ]
        });
    });

