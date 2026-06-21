/**
 * Realiza una búsqueda binaria en un arreglo ordenado.
 * 
 * Precondiciones (Contratos):
 * - El primer parámetro debe ser un Arreglo (Array).
 * - El objetivo debe ser un número entero.
 * - El arreglo debe estar ordenado de menor a mayor.
 * 
 * Postcondiciones (Contratos):
 * - Retorna el índice correcto si el elemento existe (lista[indice] === objetivo).
 * - Retorna -1 si el elemento no existe en la lista.
 */
function busquedaBinaria(lista, objetivo) {
    // 1. Verificación de Tipos (Precondiciones)
    if (!Array.isArray(lista)) {
        throw new TypeError("El primer parámetro debe ser un arreglo.");
    }
    if (!Number.isInteger(objetivo)) {
        throw new TypeError("El objetivo debe ser un número entero.");
    }

    // 2. Verificación de ordenamiento (Precondición de Contrato)
    const esOrdenada = lista.every((val, i) => i === 0 || lista[i - 1] <= val);
    if (!esOrdenada) {
        throw new Error("El arreglo de entrada debe estar ordenado.");
    }

    let izquierda = 0;
    let derecha = lista.length - 1;
    
    // Salvaguarda contra bucles infinitos (vital para mutation testing)
    const limiteIteraciones = lista.length + 5;
    let iteraciones = 0;

    while (izquierda <= derecha) {
        iteraciones++;
        if (iteraciones > limiteIteraciones) {
            throw new Error("Límite de iteraciones excedido: bucle infinito detectado.");
        }

        const medio = Math.floor((izquierda + derecha) / 2);
        const valorMedio = lista[medio];

        if (valorMedio === objetivo) {
            // Postcondición: verificar correspondencia de valor
            if (lista[medio] !== objetivo) {
                throw new Error("Fallo de postcondición: el valor medio no coincide.");
            }
            return medio;
        } else if (valorMedio < objetivo) {
            izquierda = medio + 1;
        } else {
            derecha = medio - 1;
        }
    }

    // Postcondición: verificar que el elemento no está en el arreglo
    if (lista.includes(objetivo)) {
        throw new Error("Fallo de postcondición: el elemento sí existía en la lista.");
    }
    return -1;
}

module.exports = { busquedaBinaria };
