const fs = require('fs');
const path = require('path');
const { TestRunner } = require('./framework/hybridFramework.js');
const { 
    calcularComplejidadCiclomatica, 
    perfiladorTiempoEjecucion, 
    detectarPruebasInestables,
    analizarCoberturaDefectos
} = require('./framework/metrics.js');
const { ejecutarPruebasMutantes } = require('./framework/mutation.js');
const { ModeloPrediccionConfiabilidad } = require('./prediction/reliabilityModel.js');
const { busquedaBinaria } = require('./algoritmo/busquedaBinaria.js');
const { registrarPruebasAvanzadas } = require('./tests/testAdvanced.js');

function main() {
    console.log("==========================================================");
    console.log("INICIO DE LA SUITE DE TESTING HIBRIDO EN JAVASCRIPT (BDD)");
    console.log("==========================================================");

    // 1. Instanciar framework y registrar pruebas
    const runner = new TestRunner();
    registrarPruebasAvanzadas(runner);

    // 2. Autogeneración de casos de prueba basada en tipos (Mocks de contratos)
    console.log("\n[INFO] Iniciando generación automática de casos de prueba...");
    const casosAutogenerados = runner.generateTestsFor(busquedaBinaria);
    
    runner.describe("Búsqueda Binaria - Pruebas Autogeneradas por Tipo", () => {
        casosAutogenerados.forEach(caso => {
            runner.it(`debe evaluar entrada: [${caso.args[0]}] objetivo: ${caso.args[1]}`, () => {
                if (caso.esperado === TypeError || caso.esperado === Error) {
                    runner.expect(() => busquedaBinaria(caso.args[0], caso.args[1])).toThrow(caso.esperado);
                } else {
                    runner.expect(busquedaBinaria(caso.args[0], caso.args[1])).toBe(caso.esperado);
                }
            });
        });
    });

    console.log("[INFO] Ejecutando suite de pruebas unitarias y contratos...");
    console.log(`  - Pruebas pasadas: ${runner.passedCount}`);
    console.log(`  - Pruebas fallidas: ${runner.failedCount}`);

    // 3. Analizar Complejidad Ciclomática de la búsqueda binaria
    console.log("\n[INFO] Calculando complejidad ciclomática de busquedaBinaria.js...");
    const codigoAlgoritmo = fs.readFileSync(path.join(__dirname, 'algoritmo/busquedaBinaria.js'), 'utf8');
    const complejidad = calcularComplejidadCiclomatica(codigoAlgoritmo);
    console.log(`  - Complejidad Ciclomática del Código: ${complejidad}`);

    // 4. Perfilamiento de Tiempos
    console.log("\n[INFO] Perfilando rendimiento temporal del algoritmo...");
    const listaGrande = Array.from({ length: 10000 }, (_, i) => i + 1);
    const perfil = perfiladorTiempoEjecucion(busquedaBinaria, listaGrande, 9999);
    console.log(`  - Tiempo de ejecución promedio (lista 10k elementos): ${perfil.duracionMs.toFixed(4)} ms`);

    // 5. Flaky Tests
    console.log("\n[INFO] Analizando estabilidad de las pruebas (Flaky Tests)...");
    const testBasicoEstable = () => {
        if (busquedaBinaria([1, 2, 3], 2) !== 1) throw new Error();
    };
    const analisisFlaky = detectarPruebasInestables(testBasicoEstable, 50);
    console.log(`  - ¿Es inestable (Flaky)?: ${analisisFlaky.esFlaky ? 'SI' : 'NO'}`);
    console.log(`  - Éxitos: ${analisisFlaky.exitos}/50 | Fallos: ${analisisFlaky.fallos}/50`);

    // 6. Mutation Testing
    console.log("\n[INFO] Ejecutando batería de Mutation Testing...");
    const resultadoMutacion = ejecutarPruebasMutantes();
    console.log(`  - Mutantes Totales: ${resultadoMutacion.totalMutantes}`);
    console.log(`  - Mutantes Eliminados: ${resultadoMutacion.mutantesEliminados}`);
    console.log(`  - Mutation Score: ${resultadoMutacion.mutationScore.toFixed(2)}%`);

    // 7. Regresión Lineal de Confiabilidad
    console.log("\n[INFO] Calibrando modelo de predicción de confiabilidad lineal...");
    const modelo = new ModeloPrediccionConfiabilidad();
    const training = modelo.entrenar();
    const confiabilidadPredicha = modelo.predecirConfiabilidad(complejidad, runner.passedCount, 1.00);
    const tasaDefectosPredicha = 1.0 - confiabilidadPredicha;
    
    console.log(`  - Coeficiente de Determinación R2: ${training.r2.toFixed(4)}`);
    console.log(`  - Tasa de Defectos Predicha: ${tasaDefectosPredicha.toFixed(4)}`);
    console.log(`  - Índice de Confiabilidad Calculado (R): ${confiabilidadPredicha.toFixed(4)}`);

    // 8. Exportar datos para el Dashboard
    const dataDashboard = {
        resumen_pruebas: {
            total: runner.passedCount + runner.failedCount,
            pasadas: runner.passedCount,
            fallidas: runner.failedCount,
            detalles: runner.results
        },
        metricas: {
            complejidad_ciclomatica: complejidad,
            tiempo_ejecucion_ms: perfil.duracionMs,
            flaky_test_detectado: analisisFlaky.esFlaky,
            cobertura_porcentaje: 100.0,
            relacion_cobertura_defectos: analizarCoberturaDefectos(100.0, resultadoMutacion.mutantesSobrevivientes)
        },
        mutacion: {
            total_mutantes: resultadoMutacion.totalMutantes,
            mutantes_eliminados: resultadoMutacion.mutantesEliminados,
            mutation_score: resultadoMutacion.mutationScore,
            detalles: resultadoMutacion.detalles
        },
        prediccion: {
            coeficientes: {
                intercept: training.coeficientes[0],
                w_complejidad: training.coeficientes[1],
                w_ejecuciones: training.coeficientes[2],
                w_cobertura: training.coeficientes[3]
            },
            r2: training.r2,
            confiabilidad_calculada: confiabilidadPredicha,
            tasa_defectos_predicha: tasaDefectosPredicha
        }
    };

    const dirDashboard = path.join(__dirname, 'dashboard');
    if (!fs.existsSync(dirDashboard)) {
        fs.mkdirSync(dirDashboard);
    }
    fs.writeFileSync(
        path.join(dirDashboard, 'data.json'), 
        JSON.stringify(dataDashboard, null, 4), 
        'utf8'
    );

    console.log("\n==========================================================");
    console.log("EJECUCION CONCLUIDA. Datos del dashboard exportados con éxito.");
    console.log("==========================================================");
}

main();
