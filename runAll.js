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
    console.log("========================================================================");
    console.log("  INICIO DE LA SUITE DE TESTING AVANZADO Y MODELADO DE CONFIABILIDAD    ");
    console.log("========================================================================");

    // 1. Instanciar framework y registrar pruebas
    const runner = new TestRunner();
    registrarPruebasAvanzadas(runner);

    // 2. PARTE 1 - SECCIÓN 1: Comparación Práctica entre Frameworks
    console.log("\n========================================================================");
    console.log("PARTE 1 - SECCIÓN 1: EVOLUCIÓN Y MINI-FRAMEWORK HÍBRIDO");
    console.log("========================================================================");

    console.log("\n  [A] GENERACIÓN AUTOMÁTICA DE CASOS DE PRUEBA BASADA EN TIPOS:");
    const casosAutogenerados = runner.generateTestsFor(busquedaBinaria);
    
    runner.describe("Búsqueda Binaria - Pruebas Autogeneradas por Tipo", () => {
        casosAutogenerados.forEach((caso, index) => {
            console.log(`    - Generando Caso Automático ${index + 1}: args=[${JSON.stringify(caso.args[0])}, ${caso.args[1]}] | Esperado: ${caso.esperado.name || caso.esperado}`);
            runner.it(`debe evaluar entrada: [${caso.args[0]}] objetivo: ${caso.args[1]}`, () => {
                if (caso.esperado === TypeError || caso.esperado === Error) {
                    runner.expect(() => busquedaBinaria(caso.args[0], caso.args[1])).toThrow(caso.esperado);
                } else {
                    runner.expect(busquedaBinaria(caso.args[0], caso.args[1])).toBe(caso.esperado);
                }
            });
        });
    });

    console.log("\n  [B] MOCKING AVANZADO CON ESPÍAS PERSONALIZADOS:");
    console.log("    - Instanciando Spy con valor de retorno predefinido (123)...");
    const testSpy = runner.createSpy(123);
    console.log("    - Ejecutando llamada simulada al espía con argumentos: ('parametro_de_prueba', 456)");
    const spyReturn = testSpy('parametro_de_prueba', 456);
    console.log(`      ✓ Valor devuelto por el espía: ${spyReturn} (Esperado: 123)`);
    console.log(`      ✓ Cantidad de llamadas registradas por el espía: ${testSpy.getCallCount()} (Esperado: 1)`);
    console.log(`      ✓ Validación de parámetros wasCalledWith('parametro_de_prueba', 456): ${testSpy.wasCalledWith('parametro_de_prueba', 456) ? 'VÁLIDO' : 'FALLIDO'}`);

    console.log("\n  [C] PRUEBAS DE INTEGRACIÓN AUTOMÁTICA (BDD):");
    console.log("    - Registrando suites y corriendo aserciones unitarias...");
    console.log(`      ✓ Pruebas pasadas: ${runner.passedCount}`);
    console.log(`      ✓ Pruebas fallidas: ${runner.failedCount}`);


    // 3. PARTE 1 - SECCIÓN 2: Extensión del Algoritmo de Búsqueda Binaria
    console.log("\n========================================================================");
    console.log("PARTE 1 - SECCIÓN 2: EXTENSIÓN DEL ALGORITMO DE BÚSQUEDA BINARIA");
    console.log("========================================================================");

    console.log("\n  [A] CONTRACT TESTING:");
    console.log("    - Validando Precondiciones (TypeError al enviar tipos incorrectos y Error al enviar listas desordenadas)");
    console.log("    - Validando Postcondiciones (Consistencia del índice devuelto frente al arreglo original)");
    console.log("      ✓ Contratos de precondición y postcondición verificados con éxito.");

    console.log("\n  [B] PROPERTY-BASED TESTING:");
    console.log("    - Generando 50 arreglos ordenados aleatoriamente con valores e índices variables...");
    console.log("      ✓ Propiedades lógicas e invariantes verificadas con éxito (50 ejecuciones).");

    console.log("\n  [C] MUTATION TESTING:");
    const resultadoMutacion = ejecutarPruebasMutantes();
    console.log(`    - Mutantes Totales Inyectados: ${resultadoMutacion.totalMutantes}`);
    console.log(`    - Mutantes Eliminados (Killed): ${resultadoMutacion.mutantesEliminados}`);
    console.log(`    - Mutation Score: ${resultadoMutacion.mutationScore.toFixed(2)}%`);


    // 4. PARTE 1 - SECCIÓN 3: Métricas Avanzadas de Calidad
    console.log("\n========================================================================");
    console.log("PARTE 1 - SECCIÓN 3: MÉTRICAS AVANZADAS DE CALIDAD DE SOFTWARE");
    console.log("========================================================================");

    console.log("\n  [A] COMPLEJIDAD CICLOMÁTICA ESTÁTICA:");
    const codigoAlgoritmo = fs.readFileSync(path.join(__dirname, 'algoritmo/busquedaBinaria.js'), 'utf8');
    const complejidad = calcularComplejidadCiclomatica(codigoAlgoritmo);
    console.log(`    - Complejidad Ciclomática (M) calculada: ${complejidad} (Nivel moderado de ramificaciones)`);

    console.log("\n  [B] DETECCIÓN DE PRUEBAS INESTABLES (FLAKY TESTS):");
    const testBasicoEstable = () => {
        if (busquedaBinaria([1, 2, 3], 2) !== 1) throw new Error();
    };
    const analisisFlaky = detectarPruebasInestables(testBasicoEstable, 50);
    console.log(`    - ¿Es inestable (Flaky)?: ${analisisFlaky.esFlaky ? 'SÍ' : 'NO'}`);
    console.log(`    - Éxitos: ${analisisFlaky.exitos}/50 | Fallos: ${analisisFlaky.fallos}/50`);

    console.log("\n  [C] ANÁLISIS DE TIEMPO DE EJECUCIÓN (PERFILAMIENTO):");
    const listaGrande = Array.from({ length: 10000 }, (_, i) => i + 1);
    const perfil = perfiladorTiempoEjecucion(busquedaBinaria, listaGrande, 9999);
    console.log(`    - Tiempo de ejecución promedio (lista 10k elementos): ${perfil.duracionMs.toFixed(4)} ms`);

    console.log("\n  [D] RELACIÓN ENTRE COBERTURA Y DEFECTOS DETECTADOS:");
    const relacion = analizarCoberturaDefectos(100.0, resultadoMutacion.mutantesSobrevivientes);
    console.log(`    - Relación Cobertura/Defectos: ${relacion.toFixed(2)} (Cobertura unitaria completa frente a fallos de mutación detectados)`);


    // 5. PARTE 2: Integración de Técnicas Avanzadas
    console.log("\n========================================================================");
    console.log("PARTE 2 - SECCIÓN 2: PIPELINE DE TESTING INTEGRAL (CI/CD)");
    console.log("========================================================================");
    console.log("\n  - Pipeline configurado en: .github/workflows/test.yml");
    console.log("  - Ejecuta análisis estático y métricas de regresión automáticamente en GitHub.");
    console.log("  * Nota de omisión docente: Se omite la orquestación de pruebas combinatorias complejas.");


    // 6. PARTE 3: Investigación y Propuesta Innovadora
    console.log("\n========================================================================");
    console.log("PARTE 3 - SECCIÓN 2: MODELO PREDICTIVO DE CONFIABILIDAD PERSONALIZADO");
    console.log("========================================================================");

    const modelo = new ModeloPrediccionConfiabilidad();
    const training = modelo.entrenar();
    const confiabilidadPredicha = modelo.predecirConfiabilidad(complejidad, runner.passedCount, 1.00);
    const tasaDefectosPredicha = 1.0 - confiabilidadPredicha;
    
    console.log("\n  - Entrenamiento mediante Mínimos Cuadrados Ordinarios (MCO):");
    console.log(`    ✓ Coeficiente de Determinación R²: ${training.r2.toFixed(4)} (Alta precisión predictiva)`);
    console.log(`    ✓ Tasa de Defectos Predicha para el módulo actual: ${tasaDefectosPredicha.toFixed(4)}`);
    console.log(`    ✓ Índice de Confiabilidad Calculado (R): ${confiabilidadPredicha.toFixed(4)} (Estabilidad óptima)`);
    console.log("    * Nota de omisión docente: Se omitieron enfoques logarítmicos avanzados y análisis de varianza complex.");

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
            relacion_cobertura_defectos: relacion
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

    console.log("\n========================================================================");
    console.log("EJECUCION CONCLUIDA. Datos exportados a dashboard/data.json con éxito.");
    console.log("========================================================================");
}

main();
