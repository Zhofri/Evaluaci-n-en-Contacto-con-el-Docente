class ExpectationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ExpectationError';
    }
}

class Expectation {
    constructor(actual) {
        this.actual = actual;
    }

    toBe(expected) {
        if (this.actual !== expected) {
            throw new ExpectationError(`Esperado: ${expected}, pero obtenido: ${this.actual}`);
        }
    }

    toNotBe(expected) {
        if (this.actual === expected) {
            throw new ExpectationError(`No esperado: ${expected}, pero se obtuvo coincidencia.`);
        }
    }

    toThrow(errorType) {
        let threw = false;
        let caughtError = null;

        try {
            if (typeof this.actual === 'function') {
                this.actual();
            } else {
                throw new Error("expect() debe recibir una función para verificar excepciones.");
            }
        } catch (e) {
            threw = true;
            caughtError = e;
        }

        if (!threw) {
            throw new ExpectationError(`Se esperaba la excepción ${errorType.name}, pero no se lanzó ninguna.`);
        }

        if (caughtError && !(caughtError instanceof errorType)) {
            throw new ExpectationError(`Se esperaba la excepción ${errorType.name}, pero se lanzó ${caughtError.name || caughtError.constructor.name}`);
        }
    }
}

class Spy {
    constructor(originalFunc = null, returnValue = undefined) {
        this.originalFunc = originalFunc;
        this.returnValue = returnValue;
        this.calls = [];
    }

    call(...args) {
        this.calls.push({ args });
        if (this.originalFunc) {
            return this.originalFunc(...args);
        }
        return this.returnValue;
    }

    getCallCount() {
        return this.calls.length;
    }

    wasCalledWith(...args) {
        return this.calls.some(call => {
            if (call.args.length !== args.length) return false;
            return call.args.every((arg, index) => arg === args[index]);
        });
    }
}

class TestRunner {
    constructor() {
        this.currentDescribe = null;
        this.results = [];
        this.passedCount = 0;
        this.failedCount = 0;
    }

    describe(description, fn) {
        this.currentDescribe = description;
        try {
            fn();
        } catch (e) {
            console.error(`Error en bloque describe "${description}":`, e);
        }
        this.currentDescribe = null;
    }

    it(description, fn) {
        const fullName = this.currentDescribe ? `${this.currentDescribe} -> ${description}` : description;
        try {
            fn();
            this.results.push({ test: fullName, status: 'PASS', error: null });
            this.passedCount++;
        } catch (e) {
            this.results.push({
                test: fullName,
                status: 'FAIL',
                error: e.message || String(e)
            });
            this.failedCount++;
        }
    }

    expect(actual) {
        return new Expectation(actual);
    }

    createSpy(returnValue = undefined) {
        const spyObj = new Spy(null, returnValue);
        const callableSpy = (...args) => spyObj.call(...args);
        callableSpy.getCallCount = () => spyObj.getCallCount();
        callableSpy.wasCalledWith = (...args) => spyObj.wasCalledWith(...args);
        return callableSpy;
    }

    spyOn(obj, methodName, returnValue = undefined) {
        const original = obj[methodName];
        const spyObj = new Spy(original, returnValue);
        const callableSpy = (...args) => spyObj.call(...args);
        callableSpy.getCallCount = () => spyObj.getCallCount();
        callableSpy.wasCalledWith = (...args) => spyObj.wasCalledWith(...args);
        
        obj[methodName] = callableSpy;
        return callableSpy;
    }

    // Autogeneración de pruebas basada en tipos de firma
    generateTestsFor(targetFunction) {
        // En JavaScript no hay tipos estáticos en runtime directos,
        // pero podemos emular la validación de firmas y contratos
        // generando casos de prueba clásicos de tipos incorrectos
        return [
            { args: [[1, 2, 3], 2], esperado: 1 },
            { args: ["no_es_arreglo", 2], esperado: TypeError },
            { args: [[1, 2, 3], "no_es_entero"], esperado: TypeError },
            { args: [[3, 2, 1], 2], esperado: Error }
        ];
    }
}

module.exports = { TestRunner, ExpectationError };
