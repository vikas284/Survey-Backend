var winston = require('winston');
const path = require('path')
var logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            level: 'info',
            filename: path.join(__dirname, '../logs/info.log'),
            handleExceptions: true,
            json: true,
            maxsize: 1024 * 1024 * 1024, //1GB
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.File({
            level: 'error',
            filename: path.join(__dirname, '../logs/error.log'),
            handleExceptions: true,
            json: true,
            maxsize: 1024 * 1024 * 1024, //1GB
            maxFiles: 5,
            colorize: false
        }),
    ],
    exitOnError: false
});

logger.setLevels({
    silent: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    verbose: 5,
    silly: 6
});


logger.stream = {
    write: function(message, encoding) {
        logger.info(message);
    }
};

logger.add(new winston.transports.Console({
    format: winston.format.simple(),
}));


module.exports = logger;