# Pruebas de Software: Diseño de Experimentos y Cobertura de Código

Este repositorio contiene la resolución práctica para la **Actividad Autónoma 2** del módulo de Control de Calidad y Mantenimiento de Software.

Aquí se implementan técnicas de **Diseño de Experimentos (DOE)** mediante combinaciones por pares (Pairwise Testing), **Análisis de Cobertura de Código (Branch Coverage)**, y **Análisis Estático de Código** (detección de anomalías de flujo de datos).

---

## 📋 Contenido del Repositorio

1.  **`busqueda_binaria.py`**: Algoritmo de búsqueda binaria desarrollado en la Tarea 1.
2.  **`test_busqueda_binaria.py`**: Suite de pruebas final que alcanza el **100% de cobertura de decisiones/ramas**.
3.  **`test_inicial.py`**: Suite de pruebas reducida inicial (cobertura del 89%).
4.  **`generar_pairwise.py`**: Script en Python utilizando la librería `allpairspy` para generar combinaciones DOE de 5 factores mediante Pairwise.
5.  **`casos_prueba_pairwise.csv`**: Tabla exportada con las 30 combinaciones óptimas de pruebas para el sistema de reserva de hotel.
6.  **`busqueda_binaria_anomalo.py`**: Algoritmo modificado con dos anomalías de flujo de datos introducidas intencionadamente (variable no utilizada y variable indefinida/no inicializada).
7.  **`reporte_analisis_estatico.txt`**: Resultados y diagnóstico generado por la herramienta de análisis estático `pylint`.
8.  **`ENTREGABLE_AUTONOMO2.md`**: Informe técnico completo detallando la teoría, diseño de experimentos, análisis y conclusiones del trabajo.

---

## 🛠️ Requisitos e Instalación

Para ejecutar los scripts y generar los reportes de cobertura en tu máquina local, necesitas tener instalado **Python 3.8+** y las siguientes dependencias:

```bash
pip install allpairspy coverage pylint
```

---

## 🚀 Cómo Ejecutar el Proyecto

### 1. Generación de Casos de Prueba (Pairwise / DOE)
Para generar las combinaciones óptimas por pares para el sistema de reserva de habitaciones de hotel:
```bash
python generar_pairwise.py
```
*Esto generará automáticamente los archivos `casos_prueba_pairwise.csv` y `casos_prueba_pairwise.md`.*

---

### 2. Análisis de Cobertura de Código

#### Cobertura del primer conjunto de pruebas (Prueba Inicial):
```bash
coverage run --branch -m unittest test_inicial.py
coverage report -m
```
*Se observará una cobertura de decisiones del **89%**.*

#### Cobertura del segundo conjunto de pruebas (Prueba Completa):
```bash
coverage run --branch -m unittest test_busqueda_binaria.py
coverage report -m
```
*Se alcanzará una cobertura de decisiones del **100%**.*

#### Generar Reporte Visual en HTML:
```bash
coverage html
```
*Abre el archivo `htmlcov/index.html` en tu navegador para visualizar la cobertura de cada línea del código de forma gráfica.*

---

### 3. Análisis Estático de Código
Para comprobar cómo la herramienta de análisis estático detecta las anomalías de flujo de datos en el archivo modificado:
```bash
pylint busqueda_binaria_anomalo.py
```
*El resultado de este diagnóstico se encuentra guardado en `reporte_analisis_estatico.txt`.*

---

## 🧑‍💻 Autores
*   Desarrollado para la Actividad Autónoma 2.
