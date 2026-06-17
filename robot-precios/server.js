const express = require('express');
const cors    = require('cors');
const { buscarYComparar } = require('./robot');

const app  = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Health check — para saber si el server está vivo
app.get('/ping', (_, res) => res.json({ ok: true }));

app.post('/buscar', async (req, res) => {
    const { producto } = req.body;

    if (!producto || !producto.trim()) {
        return res.status(400).json({ error: 'Debes ingresar un producto.' });
    }

    console.log(`\n📦 Nueva búsqueda: "${producto}"`);

    // El robot puede tardar varios minutos — desactivamos el timeout de Express
    req.setTimeout(0);
    res.setTimeout(0);

    try {
        const resultados = await buscarYComparar(producto.trim());

        // Filtramos nulls para que el frontend sepa cuáles no encontramos
        const respuesta = {};
        for (const [tienda, datos] of Object.entries(resultados)) {
            if (datos) respuesta[tienda] = datos;
        }

        console.log(`✅ Búsqueda completada. Tiendas con precio: ${Object.keys(respuesta).join(', ') || 'ninguna'}`);
        res.json(respuesta);

    } catch (err) {
        console.error('❌ Error en el robot:', err.message);
        res.status(500).json({ error: 'Error interno del robot: ' + err.message });
    }
});

app.listen(PORT, () => {
    console.log(`\n🚀 Servidor listo en http://localhost:${PORT}`);
    console.log(`   POST /buscar  — busca un producto`);
    console.log(`   GET  /ping    — health check\n`);
});