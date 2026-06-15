# INFORME DEL ENTREGABLE PRÁCTICO - ACTIVIDAD AUTÓNOMA 2

Este documento consolida los reportes, el código fuente y las pruebas ejecutadas en el entorno local para las partes prácticas solicitadas.

---

# PARTE 1: DISEÑO DE EXPERIMENTOS Y PRUEBAS COMBINATORIAS

## 1.1 Matriz de Factores y Niveles
Se configuró un sistema de reservas de hotel con 5 factores (3 de ellos con 5 niveles y 2 con 4 niveles):

| Factor | Niveles |
| :--- | :--- |
| **Tipo de habitación** | Individual, Doble, Suite, Familiar, Presidencial (5 niveles) |
| **Método de pago** | Tarjeta de crédito, Tarjeta de débito, PayPal, Transferencia bancaria, Pago en recepción (5 niveles) |
| **Duración de la estancia** | 1 noche, 2 noches, 3 noches, 5 noches, 7 noches (5 niveles) |
| **Temporada** | Baja, Media, Alta, Festiva (4 niveles) |
| **Tipo de cliente** | Nuevo, Frecuente, Corporativo, VIP (4 niveles) |

*   **Combinaciones cartesianas totales (Exhaustivo):** 5 × 5 × 5 × 4 × 4 = **2,000 combinaciones**.
*   **Combinaciones optimizadas con Pairwise (2-way):** **30 combinaciones**.

## 1.2 Casos de Prueba Generados
Los siguientes 30 casos de prueba fueron generados automáticamente por el algoritmo Pairwise (ejecutado mediante `generar_pairwise.py` con `allpairspy` en la máquina local):

| Caso | Tipo de Habitación | Método de Pago | Duración | Temporada | Tipo de Cliente |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Individual | Tarjeta de credito | 1 noche | Baja | Nuevo |
| 2 | Doble | Tarjeta de debito | 2 noches | Media | Frecuente |
| 3 | Suite | PayPal | 3 noches | Alta | Corporativo |
| 4 | Familiar | Transferencia bancaria | 5 noches | Festiva | VIP |
| 5 | Presidencial | Pago en recepcion | 7 noches | Baja | Frecuente |
| 6 | Individual | Tarjeta de debito | 3 noches | Festiva | VIP |
| 7 | Doble | PayPal | 5 noches | Baja | Nuevo |
| 8 | Suite | Transferencia bancaria | 7 noches | Media | Frecuente |
| 9 | Familiar | Pago en recepcion | 1 noche | Alta | Corporativo |
| 10 | Presidencial | Tarjeta de credito | 2 noches | Festiva | VIP |
| 11 | Individual | PayPal | 7 noches | Alta | VIP |
| 12 | Doble | Transferencia bancaria | 1 noche | Festiva | Corporativo |
| 13 | Suite | Pago en recepcion | 2 noches | Baja | Nuevo |
| 14 | Familiar | Tarjeta de credito | 3 noches | Media | Frecuente |
| 15 | Presidencial | Tarjeta de debito | 5 noches | Alta | Corporativo |
| 16 | Individual | Transferencia bancaria | 2 noches | Alta | Frecuente |
| 17 | Doble | Pago en recepcion | 3 noches | Festiva | Nuevo |
| 18 | Suite | Tarjeta de credito | 5 noches | Festiva | VIP |
| 19 | Familiar | Tarjeta de debito | 7 noches | Baja | VIP |
| 20 | Presidencial | PayPal | 1 noche | Media | Corporativo |
| 21 | Individual | Pago en recepcion | 5 noches | Media | Frecuente |
| 22 | Doble | Tarjeta de credito | 7 noches | Alta | Corporativo |
| 23 | Suite | Tarjeta de debito | 1 noche | Festiva | Nuevo |
| 24 | Familiar | PayPal | 2 noches | Baja | Frecuente |
| 25 | Presidencial | Transferencia bancaria | 3 noches | Media | VIP |
| 26 | Individual | Tarjeta de credito | 7 noches | Festiva | Corporativo |
| 27 | Individual | Tarjeta de debito | 5 noches | Media | Nuevo |
| 28 | Individual | PayPal | 2 noches | Festiva | Frecuente |
| 29 | Individual | Transferencia bancaria | 3 noches | Baja | Corporativo |
| 30 | Individual | Pago en recepcion | 1 noche | Festiva | VIP |

---

# PARTE 2: ANÁLISIS DE COBERTURA DE CÓDIGO

## 2.1 Cobertura de Decisiones (Sección 1)

### Código Fuente Original (`busqueda_binaria.py`)
```python
def busqueda_binaria(lista, objetivo):
    izquierda = 0
    derecha = len(lista) - 1

    while izquierda <= derecha:
        medio = (izquierda + derecha) // 2
        valor_medio = lista[medio]

        if valor_medio == objetivo:
            return medio
        elif valor_medio < objetivo:
            izquierda = medio + 1
        else:
            derecha = medio - 1

    return -1
```

### Ejecución con Suite de Pruebas Inicial (`test_inicial.py`)
Se probaron tres escenarios básicos (búsqueda exitosa al inicio, al medio y al final).
*   **Comando de ejecución:** `coverage run --branch -m unittest test_inicial.py`
*   **Reporte de Cobertura inicial:**
    ```text
    Name                  Stmts   Miss Branch BrPart  Cover   Missing
    -----------------------------------------------------------------
    busqueda_binaria.py      12      1      6      1    89%   26
    ```
    *Nota:* El flujo de salida fallida (cuando no encuentra el elemento en la línea 26) no fue cubierto (Missing Line 26).

### Ejecución con Suite de Pruebas Final (`test_busqueda_binaria.py`)
Se incorporaron los casos para lista vacía, elementos inexistentes (menor, mayor, intermedio) y duplicados.
*   **Comando de ejecución:** `coverage run --branch -m unittest test_busqueda_binaria.py`
*   **Reporte de Cobertura final:**
    ```text
    Name                       Stmts   Miss Branch BrPart  Cover   Missing
    ----------------------------------------------------------------------
    busqueda_binaria.py           12      0      6      0   100%
    ```
*   **Resultado:** Se alcanzó el **100% de Cobertura de Ramas/Decisiones (Branch/Decision Coverage)**.

---

## 2.2 Análisis Estático de Código (Sección 2)

### Código Fuente con Anomalías (`busqueda_binaria_anomalo.py`)
Se introdujeron intencionalmente dos anomalías de flujo de datos clásicas en el código de búsqueda binaria:
1.  **Anomalía 1 (Variable definida pero no usada / unused-variable):** Se declaró la variable `auxiliar = 42` en la línea 12, pero nunca se usó en el flujo.
2.  **Anomalía 2 (Uso de variable no definida / undefined-variable):** En la línea 21 se intenta imprimir la variable `indice_encontrado` sin haber sido previamente inicializada en el flujo del programa.

```python
def busqueda_binaria_anomalo(lista, objetivo):
    izquierda = 0
    derecha = len(lista) - 1
    
    # ANOMALÍA 1: Variable 'auxiliar' es definida aquí pero nunca se lee o se usa.
    auxiliar = 42

    while izquierda <= derecha:
        medio = (izquierda + derecha) // 2
        valor_medio = lista[medio]

        if valor_medio == objetivo:
            # ANOMALÍA 2: Se hace referencia a 'indice_encontrado' en esta rama pero 
            # no ha sido definida previamente en el flujo del programa.
            print(f"Encontrado en indice: {indice_encontrado}") 
            return medio
        elif valor_medio < objetivo:
            izquierda = medio + 1
        else:
            derecha = medio - 1

    return -1
```

### Ejecución de la Herramienta de Análisis Estático (`pylint`)
*   **Comando:** `pylint busqueda_binaria_anomalo.py`
*   **Reporte de Diagnóstico obtenido:**
    ```text
    ************* Module busqueda_binaria_anomalo
    busqueda_binaria_anomalo.py:21:43: E0602: Undefined variable 'indice_encontrado' (undefined-variable)
    busqueda_binaria_anomalo.py:12:4: W0612: Unused variable 'auxiliar' (unused-variable)
    ```

Ambas anomalías fueron detectadas exitosamente por el analizador estático con los códigos `E0602` (Error de variable no definida) y `W0612` (Advertencia de variable no utilizada).
