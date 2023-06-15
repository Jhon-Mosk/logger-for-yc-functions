/** @module Logger */

/**
 * @class
 * debug: отладочные сообщения, не выводятся в prod
 * info: все ожидаемые события, учет которых запланирован.
 * warn: неожиданные/подозрительные события - иначе говоря аномалии, после которых еще возможно продолжение работы приложения.
 * error: событие, после которого невозможно дальнейшее выполнение программы.
 * fatal: событие, требующее по-настоящему немедленного вмешательства.
 * trace: трассировка до места вызова.
 */
class Logger {
    constructor(module = "unknown") {
        if (module !== "unknown") {
            this.path = module.filename.split("\\").slice(-2).join("\\");
        } else {
            this.path = module;
        }
    }

    /**
     * выводит сообщения для отладки
     * @param {String} msg - текст сообщения
     * @param {String} [label=nul] - текст подписи к сообщению
     */
    debug(msg, label = null) {
        if (msg instanceof Error) {
            msg = msg.name + ": " + msg.message + "\n" + msg.stack;
        }

        if (typeof msg === "object") {
            msg = JSON.stringify(msg, null, 2);
        }

        if (process.env.NODE_ENV === "dev") {
            const logMsg = {
                level: "DEBUG",
                message: `${this.path}:>> `,
            };

            if (label !== null) {
                logMsg.message += label + ":>> ";
            }

            logMsg.message += msg;

            console.log(JSON.stringify(logMsg));
        }
    }

    /**
     * выводит информационные сообщения
     * @param {String} msg - текст сообщения
     * @param {String} [label=nul] - текст подписи к сообщению
     */
    info(msg, label = null) {
        if (msg instanceof Error) {
            msg = msg.name + ": " + msg.message + "\n" + msg.stack;
        }

        if (typeof msg === "object") {
            msg = JSON.stringify(msg, null, 2);
        }

        const logMsg = {
            level: "INFO",
            message: `${this.path}:>> `,
        };

        if (label !== null) {
            logMsg.message += label + ":>> ";
        }

        logMsg.message += msg;

        console.log(JSON.stringify(logMsg));
    }

    /**
     * выводит предупреждения
     * @param {String} msg - текст сообщения
     * @param {String} [label=nul] - текст подписи к сообщению
     */
    warn(msg, label = null) {
        if (msg instanceof Error) {
            msg = msg.name + ": " + msg.message + "\n" + msg.stack;
        }

        if (typeof msg === "object") {
            msg = JSON.stringify(msg, null, 2);
        }

        const logMsg = {
            level: "WARN",
            message: `${this.path}:>> `,
        };

        if (label !== null) {
            logMsg.message += label + ":>> ";
        }

        logMsg.message += msg;

        console.log(JSON.stringify(logMsg));
    }

    /**
     * выводит ошибки
     * @param {String} msg - текст сообщения
     * @param {String} [label=nul] - текст подписи к сообщению
     */
    error(msg, label = null) {
        if (msg instanceof Error) {
            msg = msg.name + ": " + msg.message + "\n" + msg.stack;
        }

        if (typeof msg === "object") {
            msg = JSON.stringify(msg, null, 2);
        }

        const logMsg = {
            level: "ERROR",
            message: `${this.path}:>> `,
        };

        if (label !== null) {
            logMsg.message += label + ":>> ";
        }

        logMsg.message += msg;

        console.error(JSON.stringify(logMsg));
    }

    /**
     * выводит сообщение о фатальной ошибке
     * @param {String} msg - текст сообщения
     * @param {String} [label=nul] - текст подписи к сообщению
     */
    fatal(msg, label = null) {
        if (msg instanceof Error) {
            msg = msg.name + ": " + msg.message + "\n" + msg.stack;
        }

        if (typeof msg === "object") {
            msg = JSON.stringify(msg, null, 2);
        }

        const logMsg = {
            level: "FATAL",
            message: `${this.path}:>> `,
        };

        if (label !== null) {
            logMsg.message += label + ":>> ";
        }

        logMsg.message += msg;

        console.error(JSON.stringify(logMsg));
    }

    /**
     * выводит трассировку до сообщения
     * @param {String} msg - текст сообщения
     * @param {String} [label=nul] - текст подписи к сообщению
     */
    trace(msg, label = null) {
        if (msg instanceof Error) {
            msg = msg.name + ": " + msg.message + "\n" + msg.stack;
        }

        if (typeof msg === "object") {
            msg = JSON.stringify(msg, null, 2);
        }

        const logMsg = {
            level: "TRACE",
            message: `${this.path}:>> `,
        };

        if (label !== null) {
            logMsg.message += label + ":>> ";
        }

        logMsg.message += msg;

        console.log(JSON.stringify(logMsg));
    }
}

/**
 *
 * @param {module} module - модуль в котором вызван логгер
 * @returns {Logger} логгер
 */
const getLogger = (module) => {
    return new Logger(module);
};

module.exports = getLogger;
