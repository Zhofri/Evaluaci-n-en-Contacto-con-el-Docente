const { TestRunner } = require('../framework/hybridFramework.js');
const { registrarPruebasAvanzadas } = require('./testAdvanced.js');

console.log("========================================================================");
console.log("EJECUCIÓN AISLADA: MINI-FRAMEWORK HÍBRIDO (JASMINE CUSTOM & SPIES)");
console.log("========================================================================");

console.log("\n1. Instanciando runner del framework de pruebas...");
const runner = new TestRunner();

console.log("2. Registrando las suites de pruebas avanzada...");
registrarPruebasAvanzadas(runner);

console.log("3. Mostrando estructura de suites BDD registradas:");
console.log("   - Suite: Búsqueda Binaria - Pruebas de Contratos");
console.log("   - Suite: Búsqueda Binaria - Property-based Testing");
console.log("   - Suite: Búsqueda Binaria - Mocks y Espías");

console.log("\n4. Ejecutando aserciones de espías (Mocking avanzado)...");
console.log("   - Creando espía con createSpy() con retorno fijo 999...");
const spy = runner.createSpy(999);
console.log("   - Invocando espía con argumentos: ('uide', 2026)");
const val = spy('uide', 2026);
console.log(`   * Valor devuelto: ${val} (Esperado: 999)`);
console.log(`   * Cantidad llamadas registradas: ${spy.getCallCount()} (Esperado: 1)`);
console.log(`   * ¿Llamado con ('uide', 2026)?: ${spy.wasCalledWith('uide', 2026) ? 'SÍ' : 'NO'}`);

console.log("\n5. Corriendo toda la suite de pruebas...");
runner.describe("Búsqueda Binaria - Suite de Verificación", () => {
    // Ya registradas en registrarPruebasAvanzadas
});

console.log("\n========================================================================");
console.log(`RESULTADO FINAL: Pasadas: ${runner.passedCount} | Falladas: ${runner.failedCount}`);
console.log("========================================================================");
