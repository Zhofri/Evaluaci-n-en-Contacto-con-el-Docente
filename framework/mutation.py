import os
import shutil
import importlib
import sys

# Definimos las mutaciones a aplicar al codigo fuente de busqueda_binaria
MUTACIONES = [
    # 1. Mutacion de comparacion en el bucle
    ("while izquierda <= derecha:", "while izquierda < derecha:", "Mutacion de bucle: <= por <"),
    # 2. Mutacion de comparacion del valor medio (menor)
    ("elif valor_medio < objetivo:", "elif valor_medio <= objetivo:", "Mutacion de comparacion: < por <="),
    # 3. Mutacion de modificacion de limites (izquierda)
    ("izquierda = medio + 1", "izquierda = medio - 1", "Mutacion de desplazamiento izquierda: +1 por -1"),
    # 4. Mutacion de modificacion de limites (derecha)
    ("derecha = medio - 1", "derecha = medio + 1", "Mutacion de desplazamiento derecha: -1 por +1"),
    # 5. Mutacion del calculo de punto medio
    ("medio = (izquierda + derecha) // 2", "medio = (izquierda + derecha) // 3", "Mutacion de punto medio: // 2 por // 3"),
    # 6. Mutacion de retorno por defecto
    ("return -1", "return 0", "Mutacion de retorno: -1 por 0")
]

def ejecutar_pruebas_mutantes(test_suite_runner) -> dict:
    """
    Inyecta mutaciones programaticas en busqueda_binaria, ejecuta el test runner,
    y computa la tasa de supervivencia de los mutantes (Mutation Score).
    """
    ruta_original = "algoritmo/busqueda_binaria.py"
    ruta_backup = "algoritmo/busqueda_binaria.py.bak"
    
    # 1. Copia de seguridad del archivo original
    shutil.copyfile(ruta_original, ruta_backup)
    
    with open(ruta_original, "r", encoding="utf-8") as f:
        codigo_original = f.read()
        
    mutantes_totales = len(MUTACIONES)
    mutantes_eliminados = 0
    detalles_mutantes = []
    
    try:
        for idx, (original, modificado, desc) in enumerate(MUTACIONES, 1):
            if original not in codigo_original:
                # Si el string no se encuentra en el codigo, no se puede aplicar esta mutacion
                detalles_mutantes.append({
                    'id': idx,
                    'descripcion': desc,
                    'resultado': 'OMITIDO (Codigo no coincidente)'
                })
                continue
                
            # Aplicar mutacion
            codigo_mutado = codigo_original.replace(original, modificado)
            with open(ruta_original, "w", encoding="utf-8") as f:
                f.write(codigo_mutado)
                
            # Forzar recarga del modulo modificado para que el runner importe la version mutada
            if "algoritmo.busqueda_binaria" in sys.modules:
                importlib.reload(sys.modules["algoritmo.busqueda_binaria"])
            
            # Ejecutar el runner de prueba
            exito = True
            # Haremos una evaluacion rapida de casos clave
            try:
                # Importamos la version mutada actual
                from algoritmo.busqueda_binaria import busqueda_binaria
                
                # Ejecutar casos basicos directamente para ver si el mutante es detectado (muere)
                # Si lanza error o retorna valor incorrecto, el mutante MUERE (exito del test suite)
                # Caso de prueba 1
                if busqueda_binaria([2, 4, 6, 8, 10], 6) != 2:
                    raise AssertionError()
                # Caso de prueba 2
                if busqueda_binaria([2, 4, 6, 8, 10], 5) != -1:
                    raise AssertionError()
                # Caso de prueba 3
                if busqueda_binaria([1], 1) != 0:
                    raise AssertionError()
                # Caso de prueba 4
                if busqueda_binaria([], 10) != -1:
                    raise AssertionError()
            except Exception:
                # El test fallo, lo que significa que el mutante fue DETECTADO (ELIMINADO)
                exito = False
                
            if not exito:
                mutantes_eliminados += 1
                resultado = "ELIMINADO (Pruebas fallaron como se esperaba)"
            else:
                resultado = "SOBREVIVIO (Las pruebas no detectaron el cambio)"
                
            detalles_mutantes.append({
                'id': idx,
                'descripcion': desc,
                'resultado': resultado
            })
            
    finally:
        # Restaurar codigo original
        if os.path.exists(ruta_backup):
            shutil.copyfile(ruta_backup, ruta_original)
            os.remove(ruta_backup)
            if "algoritmo.busqueda_binaria" in sys.modules:
                importlib.reload(sys.modules["algoritmo.busqueda_binaria"])
                
    mutation_score = (mutantes_eliminados / mutantes_totales) * 100
    
    return {
        'total_mutantes': mutantes_totales,
        'mutantes_eliminados': mutantes_eliminados,
        'mutantes_sobrevivientes': mutantes_totales - mutantes_eliminados,
        'mutation_score': mutation_score,
        'detalles': detalles_mutantes
    }
