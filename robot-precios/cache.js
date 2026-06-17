/**
 * ============================================================
 * 💾 CACHE — Sistema de caché en memoria
 * ============================================================
 */

const logger = require('./logger');
const config = require('./config');

class Cache {
    constructor(ttl = config.CACHE_TTL, maxEntries = config.CACHE_MAX_ENTRIES) {
        this.cache = new Map();
        this.ttl = ttl * 1000; // convertir a ms
        this.maxEntries = maxEntries;
    }

    set(key, value) {
        // Limpiar entradas expiradas
        this.cleanup();

        // Si alcanzamos el máximo, eliminar la entrada más antigua
        if (this.cache.size >= this.maxEntries) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
            logger.debug('Cache limit reached, removed oldest entry', { key: firstKey });
        }

        this.cache.set(key, {
            value,
            expiresAt: Date.now() + this.ttl,
        });
        logger.debug('Cache set', { key, ttl: this.ttl });
    }

    get(key) {
        const entry = this.cache.get(key);
        if (!entry) return null;

        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            logger.debug('Cache entry expired', { key });
            return null;
        }

        logger.debug('Cache hit', { key });
        return entry.value;
    }

    has(key) {
        return this.get(key) !== null;
    }

    clear() {
        this.cache.clear();
        logger.info('Cache cleared');
    }

    cleanup() {
        let removed = 0;
        for (const [key, entry] of this.cache.entries()) {
            if (Date.now() > entry.expiresAt) {
                this.cache.delete(key);
                removed++;
            }
        }
        if (removed > 0) {
            logger.debug('Cache cleanup', { removed });
        }
    }

    stats() {
        return {
            size: this.cache.size,
            maxEntries: this.maxEntries,
            ttl: this.ttl / 1000,
        };
    }
}

module.exports = new Cache();
