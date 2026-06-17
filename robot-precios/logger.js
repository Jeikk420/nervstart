/**
 * ============================================================
 * 📝 LOGGER — Sistema de logging con niveles
 * ============================================================
 */

const fs = require('fs');
const path = require('path');

const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
};

const LOG_LEVEL = process.env.LOG_LEVEL?.toUpperCase() || 'INFO';
const CURRENT_LEVEL = LOG_LEVELS[LOG_LEVEL] || LOG_LEVELS.INFO;
const LOG_DIR = path.join(__dirname, '../logs');

// Crear directorio de logs si no existe
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

const getTimestamp = () => new Date().toISOString();

const getLogFile = () => {
    const date = new Date().toISOString().split('T')[0];
    return path.join(LOG_DIR, `app-${date}.log`);
};

const writeToFile = (level, message, data) => {
    try {
        const timestamp = getTimestamp();
        const logLine = `[${timestamp}] [${level}] ${message}${data ? ' ' + JSON.stringify(data) : ''}\n`;
        fs.appendFileSync(getLogFile(), logLine);
    } catch (err) {
        console.error('Error writing to log file:', err);
    }
};

const formatConsoleOutput = (level, message, data) => {
    const colors = {
        DEBUG: '\x1b[36m',  // cyan
        INFO: '\x1b[32m',   // green
        WARN: '\x1b[33m',   // yellow
        ERROR: '\x1b[31m',  // red
        RESET: '\x1b[0m',
    };
    const color = colors[level] || '';
    const reset = colors.RESET;
    return `${color}[${level}]${reset} ${message}${data ? ' ' + JSON.stringify(data) : ''}`;
};

const logger = {
    debug: (message, data) => {
        if (CURRENT_LEVEL <= LOG_LEVELS.DEBUG) {
            console.log(formatConsoleOutput('DEBUG', message, data));
            writeToFile('DEBUG', message, data);
        }
    },
    info: (message, data) => {
        if (CURRENT_LEVEL <= LOG_LEVELS.INFO) {
            console.log(formatConsoleOutput('INFO', message, data));
            writeToFile('INFO', message, data);
        }
    },
    warn: (message, data) => {
        if (CURRENT_LEVEL <= LOG_LEVELS.WARN) {
            console.warn(formatConsoleOutput('WARN', message, data));
            writeToFile('WARN', message, data);
        }
    },
    error: (message, data) => {
        if (CURRENT_LEVEL <= LOG_LEVELS.ERROR) {
            console.error(formatConsoleOutput('ERROR', message, data));
            writeToFile('ERROR', message, data);
        }
    },
};

module.exports = logger;
