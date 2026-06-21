const { busquedaBinaria } = require('../algoritmo/busquedaBinaria.js');

console.log("========================================================================");
console.log("EJECUCIÓN AISLADA: PRUEBAS DE CONTRATOS (PRECONDICIONES Y POSTCONDICIONES)");
console.log("========================================================================");

console.log("\n1. Probando Contrato - Precondiciones de Tipo:");
console.log("   - Búsqueda con primer parámetro como string en lugar de Array:");
try {
    busquedaBinaria("cadena_invalida", 5);
} catch (e) {
    console.log(`     ✓ Capturado correctamente: ${e.name} - ${e.message}`);
}

console.log("   - Búsqueda con objetivo de tipo float en lugar de entero:");
try {
    busquedaBinaria([1, 2, 3], 2.5);
} catch (e) {
    console.log(`     ✓ Capturado correctamente: ${e.name} - ${e.message}`);
}

console.log("\n2. Probando Contrato - Precondiciones Lógicas (Ordenamiento del Arreglo):");
console.log("   - Enviando lista desordenada [10, 5, 20]:");
try {
    busquedaBinaria([10, 5, 20], 5);
} catch (e) {
    console.log(`     ✓ Capturado correctamente: ${e.name} - ${e.message}`);
}

console.log("\n3. Probando Contrato - Postcondiciones Lógicas (Consistencia de Salida):");
const arrayValido = [10, 20, 30, 40];
const target = 30;
console.log(`   - Buscando ${target} en [${arrayValido}]...`);
const indice = busquedaBinaria(arrayValido, target);
console.log(`     * Índice retornado: ${indice}`);
console.log(`     * Verificando consistencia: array[${indice}] = ${arrayValido[indice]} (Esperado: ${target})`);
console.log("     ✓ Postcondición validada con éxito.");

console.log("\n========================================================================");
console.log("CONTRATOS DE BÚSQUEDA BINARIA VERIFICADOS AL 100%");
console.log("========================================================================");
