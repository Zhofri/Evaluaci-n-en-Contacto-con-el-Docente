const fs = require('fs');
const path = require('path');
const { calcularComplejidadCiclomatica, perfiladorTiempoEjecucion, detectarPruebasInestables } = require('../framework/metrics.js');
const { busquedaBinaria } = require('../algoritmo/busquedaBinaria.js');

console.log("========================================================================");
console.log("EJECUCIÓN AISLADA: SISTEMA DE MÉTRICAS AVANZADAS DE CALIDAD");
console.log("========================================================================");

console.log("\n1. Iniciando análisis estático (Complejidad Ciclomática):");
const rutaAlgoritmo = path.join(__dirname, '../algoritmo/busquedaBinaria.js');
const codigo = fs.readFileSync(rutaAlgoritmo, 'utf8');
const cc = calcularComplejidadCiclomatica(codigo);
console.log("   - Leyendo estructura de control de 'busquedaBinaria.js'...");
console.log(`   * Complejidad Ciclomática (M): ${cc}`);
console.log(`   * Caminos linealmente independientes requeridos para cobertura: ${cc}`);

console.log("\n2. Iniciando análisis dinámico (Perfilador de Tiempos):");
const lista = Array.from({length: 10000}, (_, i) => i + 1);
console.log("   - Ejecutando perfilador sobre lista de 10,000 elementos...");
const perfil = perfiladorTiempoEjecucion(busquedaBinaria, lista, 5000);
console.log(`   * Tiempo de procesamiento promedio: ${perfil.duracionMs.toFixed(4)} ms`);

console.log("\n3. Iniciando análisis de estabilidad (Flaky Test Detector):");
console.log("   - Evaluando aserción básica 50 veces seguidas...");
const testF = () => {
    if (busquedaBinaria([1, 2, 3], 2) !== 1) throw new Error("Aserción inestable");
};
const flaky = detectarPruebasInestables(testF, 50);
console.log(`   * Resultados: Éxitos ${flaky.exitos}/50 | Fallos ${flaky.fallos}/50`);
console.log(`   * Diagnóstico: Suite de pruebas clasificada como: ${flaky.esFlaky ? '⚠️ INESTABLE (FLAKY)' : '✓ ESTABLE'}`);

console.log("\n========================================================================");
console.log("MÉTRICAS AVANZADAS DE CALIDAD PROCESADAS");
console.log("========================================================================");
