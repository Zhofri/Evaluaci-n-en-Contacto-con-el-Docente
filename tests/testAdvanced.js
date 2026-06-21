const { busquedaBinaria } = require('../algoritmo/busquedaBinaria.js');

function registrarPruebasAvanzadas(runner) {
    // 1. Bloque de Contratos
    runner.describe("Búsqueda Binaria - Pruebas de Contratos", () => {
        runner.it("debe validar precondicion de tipos de parametros (TypeError)", () => {
            runner.expect(() => busquedaBinaria("no_es_arreglo", 10)).toThrow(TypeError);
            runner.expect(() => busquedaBinaria([1, 2, 3], "no_es_entero")).toThrow(TypeError);
        });

        runner.it("debe validar precondicion de ordenamiento de lista (Error)", () => {
            runner.expect(() => busquedaBinaria([5, 3, 8, 1], 3)).toThrow(Error);
        });

        runner.it("debe validar postcondiciones de exito en busquedas", () => {
            runner.expect(busquedaBinaria([10, 20, 30], 20)).toBe(1);
            runner.expect(busquedaBinaria([10, 20, 30], 25)).toBe(-1);
        });
    });

    // 2. Bloque de Propiedades (Property-based)
    runner.describe("Búsqueda Binaria - Property-based Testing", () => {
        runner.it("debe verificar invariantes con datos autogenerados", () => {
            for (let i = 0; i < 50; i++) {
                const tamano = Math.floor(Math.random() * 100) + 1;
                // Generar números ordenados aleatorios únicos
                const conjunto = new Set();
                while (conjunto.size < tamano) {
                    conjunto.add(Math.floor(Math.random() * 2000) - 1000);
                }
                const datos = Array.from(conjunto).sort((a, b) => a - b);

                // Caso A: Buscar elemento que sí existe
                const objetivoExistente = datos[Math.floor(Math.random() * datos.length)];
                const indice = busquedaBinaria(datos, objetivoExistente);
                runner.expect(datos[indice]).toBe(objetivoExistente);

                // Caso B: Buscar elemento aleatorio (puede no existir)
                const objetivoInexistente = Math.floor(Math.random() * 4000) - 2000;
                const indiceB = busquedaBinaria(datos, objetivoInexistente);
                if (indiceB !== -1) {
                    runner.expect(datos[indiceB]).toBe(objetivoInexistente);
                } else {
                    runner.expect(datos.includes(objetivoInexistente)).toBe(false);
                }
            }
        });
    });

    // 3. Mocks y Espías
    runner.describe("Búsqueda Binaria - Mocks y Espías", () => {
        runner.it("debe registrar correctamente llamadas e interactuar con spies", () => {
            const spy = runner.createSpy(123);
            const resultado = spy("parametro_de_prueba", 456);

            runner.expect(resultado).toBe(123);
            runner.expect(spy.getCallCount()).toBe(1);
            runner.expect(spy.wasCalledWith("parametro_de_prueba", 456)).toBe(true);
        });
    });
}

module.exports = { registrarPruebasAvanzadas };
