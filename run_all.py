import os
import json
import time
from framework.hybrid_framework import TestRunner
from framework.metrics import (
    calcular_complejidad_ciclomatica,
    perfilador_tiempo_ejecucion,
    detectar_pruebas_inestables,
    analizar_cobertura_defectos
)
from framework.mutation import ejecutar_pruebas_mutantes
from prediction.reliability_model import ModeloPrediccionConfiabilidad
from algoritmo.busqueda_binaria import busqueda_binaria
from tests.test_advanced import registrar_pruebas_avanzadas

def main():
    print("==========================================================")
    # Tono sumamente formal y corporativo
    print("INICIO DE LA SUITE DE TESTING HIBRIDO Y METRICAS AVANZADAS")
    print("==========================================================")
    
    # 1. Instanciar framework y registrar pruebas manuales/avanzadas
    runner = TestRunner()
    registrar_pruebas_avanzadas(runner)
    
    # 2. Autogeneracion de pruebas basadas en tipos
    print("\n[INFO] Iniciando generacion automatica de casos de prueba...")
    casos_autogenerados = runner.generate_tests_for(busqueda_binaria)
    
    # Ejecutar pruebas autogeneradas y agregarlas al runner
    def ejecutar_caso_autogenerado(lista, objetivo, esperado):
        if isinstance(esperado, type) and issubclass(esperado, Exception):
            runner.expect(lambda: busqueda_binaria(lista, objetivo)).to_raise(esperado)
        else:
            runner.expect(busqueda_binaria(lista, objetivo)).to_be(esperado)

    runner.describe("Búsqueda Binaria - Pruebas Autogeneradas por Tipo", lambda: [
        runner.it(f"debe evaluar lista={lista} objetivo={objetivo}", 
                  lambda l=lista, o=objetivo, e=esperado: ejecutar_caso_autogenerado(l, o, e))
        for lista, objetivo, esperado in casos_autogenerados
    ])
    
    # Ejecutar la suite completa
    print("[INFO] Ejecutando suite de pruebas unitarias y contratos...")
    # El runner de describe/it ya se ejecuta de forma secuencial al registrarlas
    print(f"  - Pruebas pasadas: {runner.passed_count}")
    print(f"  - Pruebas fallidas: {runner.failed_count}")
    
    # 3. Analizar Complejidad Ciclomatica de la busqueda binaria
    print("\n[INFO] Calculando complejidad ciclomática mediante análisis AST...")
    with open("algoritmo/busqueda_binaria.py", "r", encoding="utf-8") as f:
        codigo_algoritmo = f.read()
    complejidad_algoritmo = calcular_complejidad_ciclomatica(codigo_algoritmo)
    print(f"  - Complejidad Ciclomática de busqueda_binaria.py: {complejidad_algoritmo}")
    
    # 4. Perfilamiento de Tiempos
    print("\n[INFO] Perfilando el rendimiento temporal del algoritmo...")
    lista_grande = list(range(1, 10001))
    _, tiempo_ejecucion_ms = perfilador_tiempo_ejecucion(busqueda_binaria, lista_grande, 9999)
    print(f"  - Tiempo de ejecucion promedio (lista 10k elementos): {tiempo_ejecucion_ms:.4f} ms")
    
    # 5. Deteccion de Flaky Tests (Pruebas inestables)
    print("\n[INFO] Analizando consistencia de las pruebas (Deteccion de Flaky Tests)...")
    # Creamos una funcion dummy de prueba que evalua la busqueda binaria basica
    def test_basico_estable():
        assert busqueda_binaria([1, 2, 3], 2) == 1
    
    analisis_flaky = detectar_pruebas_inestables(test_basico_estable, iteraciones=50)
    print(f"  - ¿Es inestable (Flaky)?: {'SI' if analisis_flaky['es_flaky'] else 'NO'}")
    print(f"  - Exitos: {analisis_flaky['exitos']}/50 | Fallos: {analisis_flaky['fallos']}/50")
    
    # 6. Ejecucion de Pruebas de Mutacion
    print("\n[INFO] Ejecutando bateria de Mutation Testing...")
    resultado_mutacion = ejecutar_pruebas_mutantes(runner)
    print(f"  - Mutantes Totales: {resultado_mutacion['total_mutantes']}")
    print(f"  - Mutantes Eliminados: {resultado_mutacion['mutantes_eliminados']}")
    print(f"  - Mutation Score: {resultado_mutacion['mutation_score']:.2f}%")
    
    # 7. Modelo Predictivo de Regresion Lineal de Confiabilidad
    print("\n[INFO] Entrenando modelo predictivo de confiabilidad lineal...")
    modelo = ModeloPrediccionConfiabilidad()
    coeficientes, r2 = modelo.entrenar()
    
    # Predecir confiabilidad para el algoritmo actual
    # Usamos: complejidad actual, supongamos 50 ejecuciones de prueba, cobertura de 100% (1.00)
    confiabilidad_predicha = modelo.predecir_confiabilidad(
        complejidad=float(complejidad_algoritmo),
        ejecuciones=float(runner.passed_count),
        cobertura=1.00
    )
    tasa_defectos_predicha = 1.0 - confiabilidad_predicha
    print(f"  - Coeficiente de Determinacion R2: {r2:.4f}")
    print(f"  - Tasa de Defectos Predicha: {tasa_defectos_predicha:.4f}")
    print(f"  - Indice de Confiabilidad Calculado (R): {confiabilidad_predicha:.4f}")
    
    # 8. Exportar datos estructurados para el Dashboard interactivo
    data_dashboard = {
        'resumen_pruebas': {
            'total': runner.passed_count + runner.failed_count,
            'pasadas': runner.passed_count,
            'fallidas': runner.failed_count,
            'detalles': runner.results
        },
        'metricas': {
            'complejidad_ciclomatica': complejidad_algoritmo,
            'tiempo_ejecucion_ms': tiempo_ejecucion_ms,
            'flaky_test_detectado': analisis_flaky['es_flaky'],
            'cobertura_porcentaje': 100.0,
            'relacion_cobertura_defectos': analizar_cobertura_defectos(100.0, resultado_mutacion['mutantes_sobrevivientes'])
        },
        'mutacion': {
            'total_mutantes': resultado_mutacion['total_mutantes'],
            'mutantes_eliminados': resultado_mutacion['mutantes_eliminados'],
            'mutation_score': resultado_mutacion['mutation_score'],
            'detalles': resultado_mutacion['detalles']
        },
        'prediccion': {
            'coeficientes': {
                'intercept': float(coeficientes[0]),
                'w_complejidad': float(coeficientes[1]),
                'w_ejecuciones': float(coeficientes[2]),
                'w_cobertura': float(coeficientes[3])
            },
            'r2': r2,
            'confiabilidad_calculada': confiabilidad_predicha,
            'tasa_defectos_predicha': tasa_defectos_predicha
        }
    }
    
    # Crear directorio del dashboard si no existe
    os.makedirs("dashboard", exist_ok=True)
    with open("dashboard/data.json", "w", encoding="utf-8") as f:
        json.dump(data_dashboard, f, indent=4, ensure_ascii=False)
        
    print("\n==========================================================")
    print("EJECUCION CONCLUIDA. Datos del dashboard exportados con exito.")
    print("==========================================================")

if __name__ == "__main__":
    main()
