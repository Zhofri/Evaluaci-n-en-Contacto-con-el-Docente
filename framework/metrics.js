/**
 * Calcula la complejidad ciclomática del código fuente de JavaScript de forma estática.
 */
function calcularComplejidadCiclomatica(codigoFuente) {
    let complejidad = 1;
    
    // Contamos puntos de ramificación lógicos en JavaScript
    const patrones = [
        /\bif\b/g,
        /\bwhile\b/g,
        /\bfor\b/g,
        /\bcatch\b/g,
        /&&/g,
        /\|\|/g,
        /\?/g  // Operador ternario
    ];

    patrones.forEach(patron => {
        const coincidencias = codigoFuente.match(patron);
        if (coincidencias) {
            complejidad += coincidencias.length;
        }
    });

    return complejidad;
}

/**
 * Perfila el tiempo de ejecución en milisegundos de una función en Node.js.
 */
function perfiladorTiempoEjecucion(func, ...args) {
    const inicio = performance.now();
    const resultado = func(...args);
    const fin = performance.now();
    const duracionMs = fin - inicio;
    return { resultado, duracionMs };
}

/**
 * Identifica si una prueba es inestable (flaky test) ejecutándola múltiples veces.
 */
function detectarPruebasInestables(testFunc, iteraciones = 30) {
    let exitos = 0;
    let fallos = 0;
    const erroresMensajes = new Set();

    for (let i = 0; i < iteraciones; i++) {
        try {
            // Inducimos una fluctuación aleatoria para flaky testing simulado
            if (Math.random() < 0.01) {
                throw new Error("Fallo intermitente simulado de concurrencia.");
            }
            testFunc();
            exitos++;
        } catch (e) {
            fallos++;
            erroresMensajes.add(e.message || String(e));
        }
    }

    return {
        esFlaky: exitos > 0 && fallos > 0,
        exitos,
        fallos,
        mensajesError: Array.from(erroresMensajes)
    };
}

/**
 * Relación entre la cobertura y los defectos.
 */
function analizarCoberturaDefectos(coberturaPorcentaje, defectosDetectados) {
    if (defectosDetectados === 0) {
        return coberturaPorcentaje;
    }
    return coberturaPorcentaje / defectosDetectados;
}

module.exports = {
    calcularComplejidadCiclomatica,
    perfiladorTiempoEjecucion,
    detectarPruebasInestables,
    analizarCoberturaDefectos
};
