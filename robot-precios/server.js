const express = require('express');
const cors = require('cors');
const logger = require('./logger');
const config = require('./config');
const cache = require('./cache');
const { buscarYComparar } = require('./robot');

const app = express();

app.use(cors());
app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
});

// Health check
app.get('/ping', (_, res) => {
    res.json({ ok: true, timestamp: new Date().toISOString() });
});

// Stats endpoint
app.get('/stats', (_, res) => {
    res.json({
        cache: cache.stats(),
        environment: config.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});

// Búsqueda de producto
app.post('/buscar', async (req, res) => {
    const { producto } = req.body;

    if (!producto || !producto.trim()) {
        logger.warn('Empty product search attempted');
        return res.status(400).json({ error: 'Debes ingresar un producto.' });
    }

    logger.info(`Búsqueda iniciada: "${producto}"`);

    // Desactivar timeouts de Express
    req.setTimeout(0);
    res.setTimeout(0);

    try {
        const resultados = await buscarYComparar(producto.trim());

        // Filtrar nulls
        const respuesta = {};
        for (const [tienda, datos] of Object.entries(resultados)) {
            if (datos) respuesta[tienda] = datos;
        }

        const tiendas = Object.keys(respuesta).join(', ') || 'ninguna';
        logger.info(`Búsqueda completada. Tiendas encontradas: ${tiendas}`);
        res.json(respuesta);

    } catch (err) {
        logger.error('Search error', { error: err.message });
        res.status(500).json({ error: 'Error interno del robot: ' + err.message });
    }
});

// Error handler
app.use((err, req, res, next) => {
    logger.error('Unhandled error', { error: err.message, path: req.path });
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(config.PORT, () => {
    logger.info(`🚀 Server started`, {
        port: config.PORT,
        environment: config.NODE_ENV,
        headless: config.HEADLESS,
    });
    logger.info('Available endpoints:', {
        'POST /buscar': 'Search for a product',
        'GET /ping': 'Health check',
        'GET /stats': 'Server statistics',
    });
});

module.exports = app;
