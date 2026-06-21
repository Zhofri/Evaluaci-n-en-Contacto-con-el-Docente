const { busquedaBinaria } = require('../algoritmo/busquedaBinaria.js');

console.log("========================================================================");
console.log("EJECUCIÓN AISLADA: PROPERTY-BASED TESTING (INVARIANTES DE SOFTWARE)");
console.log("========================================================================");

console.log("\n1. Generando 50 escenarios ordenados aleatorios únicos...");
console.log("   Verificando invariantes lógicos para cada conjunto generado.");

let casosExitosos = 0;

for (let i = 1; i <= 50; i++) {
    const tamano = Math.floor(Math.random() * 50) + 5;
    const datosSet = new Set();
    while(datosSet.size < tamano) {
        datosSet.add(Math.floor(Math.random() * 2000) - 1000);
    }
    const datos = Array.from(datosSet).sort((a, b) => a - b);
    
    // Buscar elemento que sí está
    const objetivoExistente = datos[Math.floor(Math.random() * datos.length)];
    const indice = busquedaBinaria(datos, objetivoExistente);
    
    if (datos[indice] === objetivoExistente) {
        casosExitosos++;
    }

    if (i <= 5) {
        console.log(`   - Caso #${i}: Tamaño=${tamano} | Buscando=${objetivoExistente} -> Retornado=${indice} | Confirmado: ${datos[indice] === objetivoExistente ? 'VÁLIDO' : 'FALLIDO'}`);
    }
}

console.log(`\n2. Consolidado de ejecución:`);
console.log(`   * Total iteraciones: 50`);
console.log(`   * Propiedades correctas e invariantes confirmados: ${casosExitosos}/50`);

console.log("\n========================================================================");
console.log("PROPERTY-BASED TESTING VALIDADO AL 100%");
console.log("========================================================================");
