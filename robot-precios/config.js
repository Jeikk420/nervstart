/**
 * ============================================================
 * ⚙️ CONFIG — Configuración centralizada
 * ============================================================
 */

require('dotenv').config();

const config = {
    // Server
    PORT: parseInt(process.env.PORT || '3000', 10),
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    // Puppeteer
    HEADLESS: process.env.HEADLESS === 'true',
    TIMEOUT_MS: parseInt(process.env.TIMEOUT_MS || '45000', 10),
    NAV_TIMEOUT: parseInt(process.env.NAV_TIMEOUT || '5000', 10),
    
    // Cache
    CACHE_TTL: parseInt(process.env.CACHE_TTL || '3600', 10), // 1 hora
    CACHE_MAX_ENTRIES: parseInt(process.env.CACHE_MAX_ENTRIES || '100', 10),
    
    // Logging
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    
    // Price range
    PRECIO_MIN: 500,
    PRECIO_MAX: 150000,
};

module.exports = config;
