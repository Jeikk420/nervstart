/**
 * ============================================================
 * 🤖 ROBOT COMPARADOR DE PRECIOS — Chile
 * Jumbo · Santa Isabel · Tottus · Alvi · Acuenta
 * ============================================================
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const PRECIO_MIN = 500;
const PRECIO_MAX = 150000;

// ============================================================
// CORRECCIÓN DE TEXTO
// ============================================================

function levenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, (_, i) =>
        Array.from({ length: n + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0)
    );
    for (let i = 1; i <= m; i++)
        for (let j = 1; j <= n; j++)
            dp[i][j] = a[i-1] === b[j-1]
                ? dp[i-1][j-1]
                : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    return dp[m][n];
}

const DICCIONARIO = {
    'cloros':'clorox','clorosx':'clorox',
    'cocacola':'coca cola','kokacola':'coca cola',
    'hines':'heinz','heins':'heinz','hinz':'heinz',
    'lece':'leche','leece':'leche',
    'arros':'arroz','arrros':'arroz',
    'yogurt':'yogur','yoghurt':'yogur',
    'deterjente':'detergente',
    'champu':'shampoo',
    'mantequila':'mantequilla',
    'mayonessa':'mayonesa',
    'soprol':'soprole',
    'jabon':'jabón',
    'jamon':'jamón',
    'atun':'atún',
    'azucar':'azúcar',
    'salmon':'salmón',
};

const PALABRAS_PROTEGIDAS = new Set([
    'entera','descremada','semidescremada','larga','vida','sin','lactosa',
    'light','zero','original','natural','integral',
    'soprole','colun','nestle','parmalat',
    'heinz','carozzi','costa','jumbo','tottus',
]);

function corregirPalabra(p) {
    const w = p.toLowerCase();
    if (PALABRAS_PROTEGIDAS.has(w)) return w;
    if (DICCIONARIO[w]) return DICCIONARIO[w];
    let best = null, bestD = 3;
    for (const [err, ok] of Object.entries(DICCIONARIO)) {
        if (w.length < 4) continue;
        const d = levenshtein(w, err);
        if (d < bestD && d <= 2) { bestD = d; best = ok; }
    }
    return best || p;
}

function normalizarUnidades(t) {
    return t
        .replace(/\b(\d+(?:[.,]\d+)?)\s*litros?\b/gi,  '$1L')
        .replace(/\b(\d+(?:[.,]\d+)?)\s*lts?\b/gi,     '$1L')
        .replace(/\b(\d+(?:[.,]\d+)?)\s*kilogramos?\b/gi,'$1kg')
        .replace(/\b(\d+(?:[.,]\d+)?)\s*kilos?\b/gi,   '$1kg')
        .replace(/\b(\d+(?:[.,]\d+)?)\s*gramos?\b/gi,  '$1g')
        .replace(/\b(\d+(?:[.,]\d+)?)\s*mililitros?\b/gi,'$1ml')
        .replace(/\b(\d+(?:[.,]\d+)?)\s*ml\b/gi,       '$1ml')
        .replace(/\b(\d+(?:[.,]\d+)?)\s*cc\b/gi,       '$1ml')
        .replace(/\b(\d+(?:[.,]\d+)?)\s*unidades?\b/gi,'$1un');
}

function corregirTexto(t) {
    if (!t) return '';
    return normalizarUnidades(t.toLowerCase().trim().split(/\s+/).map(corregirPalabra).join(' '));
}

// ============================================================
// RELEVANCIA
// ============================================================

const STOPWORDS = new Set(['de','la','el','en','y','a','un','una','los','las','del','al','con','por','para','sin','sobre','se','le','lo','que','es','son','su']);

function kws(t) {
    return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
        .replace(/[^a-z\d\s]/g,' ').split(/\s+/)
        .filter(p => p.length > 1 && !STOPWORDS.has(p));
}

function relevancia(titulo, query) {
    if (!titulo) return 0;
    const tN = titulo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    const qN = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    const cQ = kws(qN), cT = new Set(kws(tN));
    if (!cQ.length) return 1;
    let hits = 0;
    for (const c of cQ) {
        if ([...cT].some(t => t===c||t.includes(c)||c.includes(t)||levenshtein(t,c)<=1)) hits++;
    }
    return hits / cQ.length;
}

// ============================================================
// HELPERS PUPPETEER
// ============================================================

const fmt = n => '$' + n.toLocaleString('es-CL');
const wait = ms => new Promise(r => setTimeout(r, ms));

async function cerrarPopups(page) {
    for (const sel of ['#onetrust-accept-btn-handler','[aria-label="Cerrar"]','[aria-label="close"]','button[class*="close"]']) {
        try { const e = await page.$(sel); if (e) { await e.click({delay:50}).catch(()=>{}); await wait(300); } } catch {}
    }
}

async function scrollear(page) {
    await page.evaluate(async () => {
        for (let i=0;i<6;i++){window.scrollBy(0,400);await new Promise(r=>setTimeout(r,200));}
        window.scrollTo(0,0);
    });
    await wait(500);
}

async function navegar(page, url, ms=4000) {
    try {
        await page.goto(url, { waitUntil:'networkidle2', timeout:45000 });
        await wait(ms);
        await cerrarPopups(page);
        return true;
    } catch { return false; }
}

// ============================================================
// EXTRACCIÓN DE PRECIO
// ============================================================

async function precioFontSize(page) {
    try {
        return await page.evaluate((min,max) => {
            const RE = /\$\s?\d{1,3}(?:\.\d{3})*(?!\d)/;
            const cands = [];
            for (const el of document.querySelectorAll('body *')) {
                const txt = Array.from(el.childNodes).filter(n=>n.nodeType===Node.TEXT_NODE).map(n=>n.textContent).join('').trim();
                if (!txt) continue;
                const m = txt.match(RE); if (!m) continue;
                const n = parseInt(m[0].replace(/[^\d]/g,''),10);
                if (isNaN(n)||n<min||n>max) continue;
                const s=window.getComputedStyle(el), r=el.getBoundingClientRect();
                if (!r.width||!r.height) continue;
                if (s.visibility==='hidden'||s.display==='none'||s.opacity==='0') continue;
                if (s.textDecorationLine?.includes('line-through')) continue;
                cands.push({n, fs:parseFloat(s.fontSize)||0, top:r.top});
            }
            if (!cands.length) return null;
            cands.sort((a,b)=>b.fs!==a.fs?b.fs-a.fs:a.top-b.top);
            return cands[0];
        }, PRECIO_MIN, PRECIO_MAX);
    } catch { return null; }
}

async function extraerPrecio(page) {
    const h = await precioFontSize(page);
    return h ? {texto:fmt(h.n), numero:h.n} : null;
}

async function precioTottus(page) {
    try {
        await page.waitForSelector('span.copy15', {timeout:12000});
        const ps = await page.$$eval('span.copy15', spans=>spans.map(el=>({
            t:el.textContent.trim(),
            tachado:window.getComputedStyle(el).textDecorationLine?.includes('line-through'),
            vis:el.offsetWidth>0&&el.offsetHeight>0,
        })));
        for (const p of ps) {
            if (p.tachado||!p.vis) continue;
            const m=p.t.match(/\d{1,3}(?:\.\d{3})*/); if (!m) continue;
            const n=parseInt(m[0].replace(/\./g,''),10);
            if (n>=PRECIO_MIN&&n<=PRECIO_MAX) return {texto:fmt(n),numero:n};
        }
    } catch {}
    return null;
}

// ============================================================
// BÚSQUEDA DE LINKS EN PÁGINA DE RESULTADOS
// ============================================================

async function mejorLink(page, selectores, query, limite=8) {
    let best=null, bestScore=-1;
    for (const sel of selectores) {
        try {
            await page.waitForSelector(sel, {timeout:5000});
            const links = await page.$$eval(sel, (els,lim)=>
                els.slice(0,lim).map(el=>{
                    const a=el.tagName==='A'?el:el.querySelector('a');
                    return {href:a?.href||'', texto:el.textContent?.trim()||''};
                }), limite
            );
            for (const l of links) {
                if (!l.href.startsWith('http')) continue;
                // Ignorar links que claramente son de otra categoría
                const urlLower = l.href.toLowerCase();
                if (urlLower.includes('panal')||urlLower.includes('paño')||urlLower.includes('hygiene')) continue;
                const score = relevancia(`${l.texto} ${l.href}`, query);
                if (score > bestScore) { bestScore=score; best=l; }
            }
            if (best && bestScore>=0.35) break;
        } catch {}
    }
    return {link:best, score:bestScore};
}

// ============================================================
// PROCESADORES POR TIENDA
// Cada uno crea su propia page para evitar "detached frame"
// ============================================================

async function procesarJumbo(browser, query) {
    const page = await browser.newPage();
    try {
        // Jumbo VTEX: la URL de búsqueda correcta
        const urls = [
            `https://www.jumbo.cl/${encodeURIComponent(query)}?map=ft`,
            `https://www.jumbo.cl/busca?q=${encodeURIComponent(query)}&map=ft`,
        ];
        // Selectores actualizados para VTEX IO (versión más reciente de Jumbo)
        const sels = [
            'a.vtex-product-summary-2-x-clearLink',
            '[class*="vtex-product-summary"] a',
            '[class*="productCard"] a',
            '[class*="galleryItem"] a',
            'article a[href*="/p"]',
            'a[href$="/p"]',
        ];
        for (const url of urls) {
            console.log(`   [jumbo] ↳ ${url}`);
            if (!await navegar(page, url, 5000)) continue;
            const {link, score} = await mejorLink(page, sels, query);
            if (!link || score<0.3) { console.log(`   [jumbo] ⚠ score bajo: ${score.toFixed(2)}`); continue; }
            console.log(`   [jumbo] ✓ score:${score.toFixed(2)} → ${link.href}`);
            if (!await navegar(page, link.href, 4000)) continue;
            const titulo = await page.title();
            const rel = relevancia(titulo, query);
            if (rel < 0.3) { console.log(`   [jumbo] ⚠ PDP no relevante (${rel.toFixed(2)}): ${titulo}`); continue; }
            const precio = await extraerPrecio(page);
            if (precio) { console.log(`   [jumbo] ✅ ${precio.texto}`); return precio; }
        }
        return null;
    } finally { await page.close().catch(()=>{}); }
}

async function procesarSantaIsabel(browser, query) {
    const page = await browser.newPage();
    try {
        const urls = [
            `https://www.santaisabel.cl/${encodeURIComponent(query)}?map=ft`,
            `https://www.santaisabel.cl/busca?q=${encodeURIComponent(query)}&map=ft`,
        ];
        const sels = [
            'a.vtex-product-summary-2-x-clearLink',
            '[class*="vtex-product-summary"] a',
            '[class*="productCard"] a',
            'article a[href*="/p"]',
            'a[href$="/p"]',
        ];
        for (const url of urls) {
            console.log(`   [santaisabel] ↳ ${url}`);
            if (!await navegar(page, url, 5000)) continue;
            const {link, score} = await mejorLink(page, sels, query);
            if (!link || score<0.3) { console.log(`   [santaisabel] ⚠ score: ${score.toFixed(2)}`); continue; }
            console.log(`   [santaisabel] ✓ score:${score.toFixed(2)} → ${link.href}`);
            if (!await navegar(page, link.href, 4000)) continue;
            const titulo = await page.title();
            const rel = relevancia(titulo, query);
            if (rel < 0.3) { console.log(`   [santaisabel] ⚠ PDP no relevante (${rel.toFixed(2)}): ${titulo}`); continue; }
            const precio = await extraerPrecio(page);
            if (precio) { console.log(`   [santaisabel] ✅ ${precio.texto}`); return precio; }
        }
        return null;
    } finally { await page.close().catch(()=>{}); }
}

async function procesarTottus(browser, query) {
    const page = await browser.newPage();
    try {
        const urls = [
            `https://www.tottus.cl/tottus-cl/busqueda?q=${encodeURIComponent(query)}`,
        ];
        const sels = [
            'a[href*="/articulo/"]',
            '[class*="ProductCard"] a',
            '[class*="pod-"] a',
            '[class*="product"] a[href*="articulo"]',
        ];
        for (const url of urls) {
            console.log(`   [tottus] ↳ ${url}`);
            if (!await navegar(page, url, 7000)) continue;
            await scrollear(page);
            const {link, score} = await mejorLink(page, sels, query);
            if (!link || score<0.3) { console.log(`   [tottus] ⚠ score: ${score.toFixed(2)}`); continue; }
            console.log(`   [tottus] ✓ score:${score.toFixed(2)} → ${link.href}`);
            if (!await navegar(page, link.href, 7000)) continue;
            await scrollear(page);
            const titulo = await page.title();
            const rel = relevancia(titulo, query);
            if (rel < 0.3) { console.log(`   [tottus] ⚠ PDP no relevante (${rel.toFixed(2)}): ${titulo}`); continue; }
            let precio = await precioTottus(page) || await extraerPrecio(page);
            if (precio) { console.log(`   [tottus] ✅ ${precio.texto}`); return precio; }
        }
        return null;
    } finally { await page.close().catch(()=>{}); }
}

async function procesarAlvi(browser, query) {
    const page = await browser.newPage();
    try {
        const q2 = query.split(' ').slice(0,2).join(' ');
        const urls = [
            `https://www.alvi.cl/search?q=${encodeURIComponent(query)}`,
            `https://www.alvi.cl/search?q=${encodeURIComponent(q2)}`,
        ];
        const sels = [
            'a[href*="/product/"]',
            '[class*="ProductCard"] a',
            '[class*="product-card"] a',
            'article a',
        ];
        for (const url of urls) {
            console.log(`   [alvi] ↳ ${url}`);
            if (!await navegar(page, url, 5000)) continue;
            const {link, score} = await mejorLink(page, sels, query);
            if (!link || score<0.3) { console.log(`   [alvi] ⚠ score: ${score.toFixed(2)}`); continue; }
            console.log(`   [alvi] ✓ score:${score.toFixed(2)} → ${link.href}`);
            if (!await navegar(page, link.href, 4000)) continue;
            const titulo = await page.title();
            const rel = relevancia(titulo, query);
            if (rel < 0.3) { console.log(`   [alvi] ⚠ PDP no relevante (${rel.toFixed(2)}): ${titulo}`); continue; }
            const precio = await extraerPrecio(page);
            if (precio) { console.log(`   [alvi] ✅ ${precio.texto}`); return precio; }
        }
        return null;
    } finally { await page.close().catch(()=>{}); }
}

async function procesarAcuenta(browser, query) {
    const page = await browser.newPage();
    try {
        const q2 = query.split(' ').slice(0,3).join(' ');
        const urls = [
            `https://www.acuenta.cl/search?q=${encodeURIComponent(query)}`,
            `https://www.acuenta.cl/search?q=${encodeURIComponent(q2)}`,
        ];
        const sels = [
            'a[href*="/p/"]',
            '[class*="ProductCard"] a',
            '[class*="product-summary"] a',
            '[class*="productCard"] a',
            'article a',
        ];
        for (const url of urls) {
            console.log(`   [acuenta] ↳ ${url}`);
            if (!await navegar(page, url, 5000)) continue;
            const {link, score} = await mejorLink(page, sels, query, 10);
            if (!link || score<0.35) { console.log(`   [acuenta] ⚠ score: ${score.toFixed(2)}`); continue; }
            // Verificar que la URL no sea de categoría errónea
            const urlLower = link.href.toLowerCase();
            if (urlLower.includes('panal')||urlLower.includes('paño')||urlLower.includes('bebe')) {
                console.log(`   [acuenta] ⚠ URL descartada por categoría: ${link.href}`);
                continue;
            }
            console.log(`   [acuenta] ✓ score:${score.toFixed(2)} → ${link.href}`);
            if (!await navegar(page, link.href, 4000)) continue;
            const titulo = await page.title();
            const rel = relevancia(titulo, query);
            if (rel < 0.35) { console.log(`   [acuenta] ⚠ PDP no relevante (${rel.toFixed(2)}): ${titulo}`); continue; }
            const precio = await extraerPrecio(page);
            if (precio) { console.log(`   [acuenta] ✅ ${precio.texto}`); return precio; }
        }
        return null;
    } finally { await page.close().catch(()=>{}); }
}

// ============================================================
// ORQUESTADOR — exportado para server.js
// ============================================================

async function buscarYComparar(queryOriginal) {
    const query = corregirTexto(queryOriginal) || queryOriginal;
    console.log(`\n🚀 Buscando: "${query}" (original: "${queryOriginal}")`);

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--no-sandbox','--disable-setuid-sandbox'],
    });

    try {
        // Ejecutamos todas las tiendas en paralelo
        const [j, si, t, a, ac] = await Promise.allSettled([
            procesarJumbo(browser, query),
            procesarSantaIsabel(browser, query),
            procesarTottus(browser, query),
            procesarAlvi(browser, query),
            procesarAcuenta(browser, query),
        ]);

        return {
            jumbo:       j.status==='fulfilled'  ? j.value  : null,
            santaisabel: si.status==='fulfilled' ? si.value : null,
            tottus:      t.status==='fulfilled'  ? t.value  : null,
            alvi:        a.status==='fulfilled'  ? a.value  : null,
            acuenta:     ac.status==='fulfilled' ? ac.value : null,
        };
    } finally {
        await browser.close().catch(()=>{});
    }
}

module.exports = { buscarYComparar };