// Helper matrix algebra functions in pure JavaScript
function transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

function multiply(A, B) {
    const rowsA = A.length, colsA = A[0].length, colsB = B[0].length;
    const result = Array(rowsA).fill(0).map(() => Array(colsB).fill(0));
    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsB; j++) {
            let sum = 0;
            for (let k = 0; k < colsA; k++) {
                sum += A[i][k] * B[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

// Inversa mediante eliminación gaussiana para matriz 4x4
function invert4x4(matrix) {
    const n = matrix.length;
    const C = matrix.map(row => [...row]); // Clonar
    const I = Array(n).fill(0).map((_, i) => Array(n).fill(0).map((_, j) => i === j ? 1 : 0));
    
    for (let i = 0; i < n; i++) {
        let pivot = C[i][i];
        if (Math.abs(pivot) < 1e-9) {
            // Pivoteo básico
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(C[k][i]) > Math.abs(pivot)) {
                    const tempC = C[i]; C[i] = C[k]; C[k] = tempC;
                    const tempI = I[i]; I[i] = I[k]; I[k] = tempI;
                    pivot = C[i][i];
                    break;
                }
            }
        }
        
        for (let j = 0; j < n; j++) {
            C[i][j] /= pivot;
            I[i][j] /= pivot;
        }
        
        for (let k = 0; k < n; k++) {
            if (k !== i) {
                const factor = C[k][i];
                for (let j = 0; j < n; j++) {
                    C[k][j] -= factor * C[i][j];
                    I[k][j] -= factor * I[i][j];
                }
            }
        }
    }
    return I;
}

class ModeloPrediccionConfiabilidad {
    constructor() {
        this.coeficientes = null;
        this.r2 = 0.0;
        
        // Datos históricos simulados de entrenamiento
        // Filas: [Intercept (1.0), Complejidad Ciclomática, Total Ejecuciones, Cobertura [0..1]]
        this.XHistorico = [
            [1.0, 4.0,  100.0, 0.95],
            [1.0, 12.0, 250.0, 0.80],
            [1.0, 25.0, 50.0,  0.60],
            [1.0, 8.0,  500.0, 0.90],
            [1.0, 18.0, 150.0, 0.70],
            [1.0, 2.0,  1000.0,1.00],
            [1.0, 15.0, 300.0, 0.85],
            [1.0, 30.0, 80.0,  0.50],
            [1.0, 6.0,  400.0, 0.92],
            [1.0, 22.0, 120.0, 0.65]
        ];
        
        // Variable objetivo: Tasa de defectos observada
        this.yHistorico = [0.02, 0.08, 0.22, 0.04, 0.15, 0.00, 0.07, 0.30, 0.03, 0.19];
    }

    entrenar() {
        const X = this.XHistorico;
        const y = this.yHistorico.map(val => [val]); // Convertir a vector columna
        
        const XT = transpose(X);
        const XT_X = multiply(XT, X);
        const XT_y = multiply(XT, y);
        
        const XT_X_inv = invert4x4(XT_X);
        const w = multiply(XT_X_inv, XT_y);
        
        this.coeficientes = w.map(row => row[0]);
        
        // Calcular R^2
        const yMean = this.yHistorico.reduce((a, b) => a + b, 0) / this.yHistorico.length;
        let ssRes = 0;
        let ssTot = 0;
        
        for (let i = 0; i < X.length; i++) {
            const pred = this.coeficientes[0] + 
                         this.coeficientes[1] * X[i][1] + 
                         this.coeficientes[2] * X[i][2] + 
                         this.coeficientes[3] * X[i][3];
            ssRes += Math.pow(this.yHistorico[i] - pred, 2);
            ssTot += Math.pow(this.yHistorico[i] - yMean, 2);
        }
        
        this.r2 = 1.0 - (ssRes / ssTot);
        return { coeficientes: this.coeficientes, r2: this.r2 };
    }

    predecirTasaDefectos(complejidad, ejecuciones, cobertura) {
        if (!this.coeficientes) {
            this.entrenar();
        }
        
        const tasa = this.coeficientes[0] + 
                     this.coeficientes[1] * complejidad + 
                     this.coeficientes[2] * ejecuciones + 
                     this.coeficientes[3] * cobertura;
        return Math.max(0.0, Math.min(1.0, tasa));
    }

    predecirConfiabilidad(complejidad, ejecuciones, cobertura) {
        return 1.0 - this.predecirTasaDefectos(complejidad, ejecuciones, cobertura);
    }
}

module.exports = { ModeloPrediccionConfiabilidad };
