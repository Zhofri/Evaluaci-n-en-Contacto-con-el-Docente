const fs = require('fs');
const path = require('path');

const MUTACIONES = [
    { original: "while (izquierda <= derecha)", modificada: "while (izquierda < derecha)", desc: "Bucle: <= por <" },
    { original: "else if (valorMedio < objetivo)", modificada: "else if (valorMedio <= objetivo)", desc: "Comparación: < por <=" },
    { original: "izquierda = medio + 1", modificada: "izquierda = medio - 1", desc: "Desplazamiento izquierda: +1 por -1" },
    { original: "derecha = medio - 1", modificada: "derecha = medio + 1", desc: "Desplazamiento derecha: -1 por +1" },
    { original: "Math.floor((izquierda + derecha) / 2)", modificada: "Math.floor((izquierda + derecha) / 3)", desc: "Punto medio: / 2 por / 3" },
    { original: "return -1", modificada: "return 0", desc: "Retorno defecto: -1 por 0" }
];

function ejecutarPruebasMutantes() {
    const rutaOriginal = path.join(__dirname, '../algoritmo/busquedaBinaria.js');
    const rutaBackup = path.join(__dirname, '../algoritmo/busquedaBinaria.js.bak');
    
    // 1. Realizar backup
    fs.copyFileSync(rutaOriginal, rutaBackup);
    
    const codigoOriginal = fs.readFileSync(rutaOriginal, 'utf8');
    let mutantesEliminados = 0;
    const detalles = [];
    
    try {
        MUTACIONES.forEach((mut, index) => {
            const idx = index + 1;
            if (!codigoOriginal.includes(mut.original)) {
                detalles.push({ id: idx, descripcion: mut.desc, resultado: "OMITIDO (No coincidente)" });
                return;
            }
            
            // Aplicar mutación
            const codigoMutado = codigoOriginal.replace(mut.original, mut.modificada);
            fs.writeFileSync(rutaOriginal, codigoMutado, 'utf8');
            
            // Forzar recarga en Node.js borrando el cache del require
            delete require.cache[require.resolve('../algoritmo/busquedaBinaria.js')];
            const { busquedaBinaria } = require('../algoritmo/busquedaBinaria.js');
            
            let esEliminado = false;
            try {
                // Ejecutar aserciones de prueba rápidas
                if (busquedaBinaria([2, 4, 6, 8, 10], 6) !== 2) throw new Error();
                if (busquedaBinaria([2, 4, 6, 8, 10], 5) !== -1) throw new Error();
                if (busquedaBinaria([1], 1) !== 0) throw new Error();
                if (busquedaBinaria([], 10) !== -1) throw new Error();
            } catch (e) {
                // La prueba falló, lo que significa que el mutante fue DETECTADO (ELIMINADO)
                esEliminado = true;
            }
            
            if (esEliminado) {
                mutantesEliminados++;
                detalles.push({ id: idx, descripcion: mut.desc, resultado: "ELIMINADO (Pruebas fallaron como se esperaba)" });
            } else {
                detalles.push({ id: idx, descripcion: mut.desc, resultado: "SOBREVIVIO (Las pruebas no detectaron el cambio)" });
            }
        });
    } finally {
        // Restaurar backup
        if (fs.existsSync(rutaBackup)) {
            fs.copyFileSync(rutaBackup, rutaOriginal);
            fs.unlinkSync(rutaBackup);
            delete require.cache[require.resolve('../algoritmo/busquedaBinaria.js')];
        }
    }
    
    const mutationScore = (mutantesEliminados / MUTACIONES.length) * 100;
    return {
        totalMutantes: MUTACIONES.length,
        mutantesEliminados,
        mutantesSobrevivientes: MUTACIONES.length - mutantesEliminados,
        mutationScore,
        detalles
    };
}

module.exports = { ejecutarPruebasMutantes };
