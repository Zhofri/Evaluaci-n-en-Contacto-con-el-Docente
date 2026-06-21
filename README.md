# Ecosistema de Testing Avanzado y Modelado de Confiabilidad

Este repositorio contiene el desarrollo del proyecto final de la asignatura, el cual integra un mini-framework de pruebas unitarias híbrido, una batería de pruebas avanzadas aplicadas al algoritmo de búsqueda binaria, análisis estático de complejidad, y un modelo de regresión lineal para la predicción de confiabilidad de software.

## Estructura del Proyecto

*   `run_all.py`: Script de integración que ejecuta la suite completa de pruebas unitarias, analiza métricas, efectúa pruebas de mutación, calibra el modelo predictivo de confiabilidad y exporta las métricas consolidadas en formato JSON.
*   `algoritmo/`:
    *   `busqueda_binaria.py`: Implementación iterativa del algoritmo de búsqueda binaria con aserciones de tipo y contratos de precondición/postcondición.
*   `framework/`:
    *   `hybrid_framework.py`: Biblioteca de testing con sintaxis BDD (tipo Jasmine), motor de espías (mocking) y autogenerador de casos de prueba basado en firmas de tipos.
    *   `metrics.py`: Analizador estático de complejidad ciclomática mediante AST, detector de pruebas inestables (flaky tests) y perfilador de tiempos.
    *   `mutation.py`: Motor interno que aplica mutaciones en el AST de búsqueda binaria para calcular el Mutation Score.
*   `tests/`:
    *   `test_advanced.py`: Suite avanzada que integra pruebas basadas en contratos y property-based testing.
*   `prediction/`:
    *   `reliability_model.py`: Ajuste matemático de regresión lineal por mínimos cuadrados ordinarios (MCO) que estima la confiabilidad basándose en complejidad ciclomática, patrones de uso y cobertura.
*   `dashboard/`:
    *   `index.html`: Dashboard web interactivo diseñado con estética moderna (Glassmorphic Dark Mode) para la visualización de resultados y curvas predictivas.
    *   `style.css`: Estilización responsiva y animaciones del dashboard.
    *   `data.json`: Archivo de datos generado dinámicamente que alimenta el dashboard.
*   `informe/`:
    *   `generate_docx.py`: Generador dinámico del informe técnico formal de 12 páginas.
    *   `informe_final.docx`: Informe de salida oficial formateado bajo normas APA 7 y estructurado con tablas financieras y referencias bibliográficas académicas reales.

---

## Requisitos de Instalación

El proyecto se ejecuta sobre **Python 3.x** y utiliza las dependencias básicas detalladas a continuación:

```bash
pip install numpy python-docx
```

---

## Guía de Ejecución

### 1. Ejecución Completa de la Suite y Generación de Datos
Para ejecutar el framework, correr las pruebas avanzadas y calibrar el modelo predictivo de confiabilidad, ejecute:

```bash
python run_all.py
```

Al concluir, el script reportará los indicadores principales en la terminal y guardará los detalles en `dashboard/data.json`.

### 2. Visualización del Dashboard Interactivo
Una vez ejecutado el paso anterior, abra el archivo `dashboard/index.html` en cualquier navegador web moderno (Chrome, Firefox, Edge, etc.) para interactuar con las visualizaciones y gráficos de regresión lineal.

### 3. Generación del Informe en Word
Si desea recompilar el informe final en formato Word (`.docx`), ejecute el siguiente comando:

```bash
python informe/generate_docx.py
```
El documento generado cumplirá estrictamente con la rúbrica técnica de 10-12 páginas con referencias en formato APA 7.
