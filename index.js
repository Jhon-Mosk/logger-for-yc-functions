/** @module Logger */

const { cwd } = require("node:process");

const workDir = cwd();

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
      this.path = module.filename.slice(workDir.length + 1);
    } else {
      this.path = module;
    }
  }

  /**
   * для подготовки сообщения для Yandex.Cloud Logging
   * @param {string} level уровень лога
   * @param {string} msg сообщение
   * @param {string} label подпись
   * @returns {{level: string, message: string}} сообщение
   */
  #prepareMessageForYC = (level, msg, label = null) => {
    const levels = {
      debug: "DEBUG",
      info: "INFO",
      warn: "WARN",
      error: "ERROR",
      fatal: "FATAL",
      trace: "TRACE",
    };

    if (msg instanceof Error) {
      msg = msg.name + ": " + msg.message + "\n" + msg.stack;
    }

    if (typeof msg === "object") {
      msg = JSON.stringify(msg, null, 2);
    }

    const logMsg = {
      level: levels[level],
      message: `${this.path}:>> `,
    };

    if (label !== null) {
      logMsg.message += label + ":>> ";
    }

    logMsg.message += msg;

    return logMsg;
  };

  /**
   * для подготовки сообщения для консоли
   * @param {string} level уровень лога
   * @param {string} msg сообщение
   * @param {string} label подпись
   * @returns {string} сообщение
   */
  #prepareMessageForConsole = (level, msg, label = null) => {
    if (msg instanceof Error) {
      msg = msg.name + ": " + msg.message + "\n" + msg.stack;
    }

    if (typeof msg === "object") {
      msg = JSON.stringify(msg, null, 2);
    }

    const COLORS = {
      black: 0,
      red: 1,
      green: 2,
      yellow: 3,
      blue: 4,
      magenta: 5,
      cyan: 6,
      white: 7,
    };
    const ANSI = {
      b: 1, // bold (increased intensity)
      f: 2, // faint (decreased intensity)
      i: 3, // italic
      u: 4, // underline
      l: 5, // blink slow
      h: 6, // blink rapid
      n: 7, // negative
      c: 8, // conceal
      s: 9, // strikethrough
    };
    const esc = (code, s) => `\x1b[${code}m${s}\x1b[0m`;
    const colorCode = (color, background = false) =>
      background ? "4" + COLORS[color] : "3" + COLORS[color];
    const levels = {
      debug: colorCode("blue"),
      info: colorCode("green"),
      warn: colorCode("yellow"),
      error: colorCode("red"),
      fatal: colorCode("red", true),
      trace: colorCode("cyan"),
    };

    const date = new Date().toLocaleString();
    const escLabel = label !== null ? `${esc(ANSI["u"], label)}:>> ` : "";
    const message = `${date}: ${esc(
      levels[level],
      level.toUpperCase()
    )}: ${escLabel} ${msg}`;

    return message;
  };

  /**
   * выводит сообщения для отладки
   * @param {String} msg - текст сообщения
   * @param {String} [label=nul] - текст подписи к сообщению
   */
  debug(msg, label = null) {
    if (process.env.NODE_ENV === "local") {
      console.log(this.#prepareMessageForConsole("debug", msg, label));
    } else if (process.env.NODE_ENV === "dev") {
      console.log(
        JSON.stringify(this.#prepareMessageForYC("debug", msg, label))
      );
    }
  }

  /**
   * выводит информационные сообщения
   * @param {String} msg - текст сообщения
   * @param {String} [label=nul] - текст подписи к сообщению
   */
  info(msg, label = null) {
    if (process.env.NODE_ENV === "local") {
      console.log(this.#prepareMessageForConsole("info", msg, label));
    } else {
      console.log(
        JSON.stringify(this.#prepareMessageForYC("info", msg, label))
      );
    }
  }

  /**
   * выводит предупреждения
   * @param {String} msg - текст сообщения
   * @param {String} [label=nul] - текст подписи к сообщению
   */
  warn(msg, label = null) {
    if (process.env.NODE_ENV === "local") {
      console.log(this.#prepareMessageForConsole("warn", msg, label));
    } else {
      console.log(
        JSON.stringify(this.#prepareMessageForYC("warn", msg, label))
      );
    }
  }

  /**
   * выводит ошибки
   * @param {String} msg - текст сообщения
   * @param {String} [label=nul] - текст подписи к сообщению
   */
  error(msg, label = null) {
    if (process.env.NODE_ENV === "local") {
      console.log(this.#prepareMessageForConsole("error", msg, label));
    } else {
      console.log(
        JSON.stringify(this.#prepareMessageForYC("error", msg, label))
      );
    }
  }

  /**
   * выводит сообщение о фатальной ошибке
   * @param {String} msg - текст сообщения
   * @param {String} [label=nul] - текст подписи к сообщению
   */
  fatal(msg, label = null) {
    if (process.env.NODE_ENV === "local") {
      console.log(this.#prepareMessageForConsole("fatal", msg, label));
    } else {
      console.log(
        JSON.stringify(this.#prepareMessageForYC("fatal", msg, label))
      );
    }
  }

  /**
   * выводит трассировку до сообщения
   * @param {String} msg - текст сообщения
   * @param {String} [label=nul] - текст подписи к сообщению
   */
  trace(msg, label = null) {
    if (process.env.NODE_ENV === "local") {
      console.log(this.#prepareMessageForConsole("trace", msg, label));
    } else {
      console.log(
        JSON.stringify(this.#prepareMessageForYC("trace", msg, label))
      );
    }
  }
}

/**
 *
 * @param {module} module - модуль в котором вызван логгер
 * @returns {Logger} логгер
 */
const getLogger = (module) => new Logger(module);

module.exports = getLogger;
