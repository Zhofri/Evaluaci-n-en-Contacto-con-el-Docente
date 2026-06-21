import ast
import time
import random

def calcular_complejidad_ciclomatica(codigo_fuente: str) -> int:
    """
    Calcula la complejidad ciclomatica de un codigo fuente en Python analizando su AST.
    M = E - V + 2P  o simplificado: M = Nodos de Decision + 1
    """
    try:
        arbol = ast.parse(codigo_fuente)
    except SyntaxError:
        return 1
        
    complejidad = 1  # Base para cualquier funcion
    
    for nodo in ast.walk(arbol):
        # Nodos de bifurcacion / decision en Python AST
        if isinstance(nodo, (ast.If, ast.While, ast.For, ast.ExceptHandler)):
            complejidad += 1
        elif isinstance(nodo, ast.BoolOp):
            # Operadores booleanos 'and' y 'or' anaden decisiones
            complejidad += len(nodo.values) - 1
            
    return complejidad

def perfilador_tiempo_ejecucion(func, *args, **kwargs):
    """Mide el tiempo de ejecucion en milisegundos de una funcion."""
    inicio = time.perf_counter()
    resultado = func(*args, **kwargs)
    fin = time.perf_counter()
    duracion_ms = (fin - inicio) * 1000
    return resultado, duracion_ms

def detectar_pruebas_inestables(test_func, iteraciones=30) -> dict:
    """
    Ejecuta una funcion de prueba multiples veces bajo perturbaciones simuladas
    para identificar si produce resultados inconsistentes (flaky test).
    """
    exitos = 0
    fallos = 0
    errores_mensajes = set()
    
    for _ in range(iteraciones):
        # Simular una variacion aleatoria en retardos / mocks
        retardo = random.uniform(0.0001, 0.002)
        time.sleep(retardo)
        
        try:
            # Para simular flakiness en entornos reales
            # (ej. fallas intermitentes de red o limites de tiempo)
            if random.random() < 0.02:  # 2% de probabilidad de falla inducida
                raise TimeoutError("Fallo intermitente simulado de red.")
            
            test_func()
            exitos += 1
        except Exception as e:
            fallos += 1
            errores_mensajes.add(str(e))
            
    es_flaky = exitos > 0 and fallos > 0
    return {
        'es_flaky': es_flaky,
        'exitos': exitos,
        'fallos': fallos,
        'mensajes_error': list(errores_mensajes)
    }

def analizar_cobertura_defectos(cobertura_porcentaje: float, defectos_detectados: int) -> float:
    """
    Calcula la relacion Cobertura/Defectos.
    Permite evaluar la efectividad del conjunto de pruebas.
    """
    if defectos_detectados == 0:
        return cobertura_porcentaje
    return cobertura_porcentaje / defectos_detectados
