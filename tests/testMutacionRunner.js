const { ejecutarPruebasMutantes } = require('../framework/mutation.js');

console.log("========================================================================");
console.log("EJECUCIÓN AISLADA: MUTATION TESTING (ANÁLISIS DE RESISTENCIA Y MUTANTES)");
console.log("========================================================================");

console.log("\n1. Iniciando motor de mutación local...");
console.log("   - Leyendo algoritmo/busquedaBinaria.js");
console.log("   - Creando archivo de respaldo temporal (.bak)...");

console.log("\n2. Inyectando mutantes lógicos secuencialmente:");
const resultado = ejecutarPruebasMutantes();

resultado.detalles.forEach(mut => {
    console.log(`   * Mutante #${mut.id} [${mut.descripcion}]: ${mut.resultado}`);
});

console.log(`\n3. Consolidado de Calidad de la Suite de Pruebas:`);
console.log(`   - Mutantes totales inyectados: ${resultado.totalMutantes}`);
console.log(`   - Mutantes detectados y eliminados (Killed): ${resultado.mutantesEliminados}`);
console.log(`   - Mutantes que sobrevivieron (Survived): ${resultado.mutantesSobrevivientes}`);
console.log(`   - Mutation Score: ${resultado.mutationScore.toFixed(2)}%`);

console.log("\n========================================================================");
console.log("MUTATION TESTING COMPLETADO");
console.log("========================================================================");
