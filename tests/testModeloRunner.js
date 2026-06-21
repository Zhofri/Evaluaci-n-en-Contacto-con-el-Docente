const { ModeloPrediccionConfiabilidad } = require('../prediction/reliabilityModel.js');

console.log("========================================================================");
console.log("EJECUCIÓN AISLADA: MODELO PREDICTIVO DE CONFIABILIDAD PERSONALIZADO");
console.log("========================================================================");

console.log("\n1. Instanciando modelo de regresión lineal (MCO)...");
const modelo = new ModeloPrediccionConfiabilidad();

console.log("\n2. Entrenando el modelo con datos históricos de telemetría (10 muestras):");
const train = modelo.entrenar();

console.log("\n3. Resultados del Ajuste Matricial (Ecuación Normal):");
console.log(`   - Coeficiente de Determinación R²: ${train.r2.toFixed(4)}`);
console.log(`   - Coeficientes de Regresión Calculados (w):`);
console.log(`     * w0 (Intercept): ${train.coeficientes[0].toFixed(6)}`);
console.log(`     * w1 (Complejidad Ciclomática): ${train.coeficientes[1].toFixed(6)}`);
console.log(`     * w2 (Total Ejecuciones): ${train.coeficientes[2].toFixed(6)}`);
console.log(`     * w3 (Cobertura Lógica): ${train.coeficientes[3].toFixed(6)}`);

console.log("\n4. Evaluando busquedaBinaria.js en el modelo de confiabilidad:");
const cc = 11; // Complejidad Ciclomática
const ejecuciones = 9; // Pruebas unitarias
const cobertura = 1.00; // 100%

const defectRate = modelo.predecirTasaDefectos(cc, ejecuciones, cobertura);
const reliability = modelo.predecirConfiabilidad(cc, ejecuciones, cobertura);

console.log(`   - Parámetros ingresados: Complejidad=${cc} | Pruebas=${ejecuciones} | Cobertura=${cobertura * 100}%`);
console.log(`   - Tasa de Defectos Predicha: ${defectRate.toFixed(4)}`);
console.log(`   - Índice de Confiabilidad Resultante (R): ${reliability.toFixed(4)}`);

console.log("\n========================================================================");
console.log("CÁLCULO DEL MODELO DE CONFIABILIDAD FINALIZADO");
console.log("========================================================================");
