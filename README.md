# Ecosistema de Testing Avanzado y Modelado de Confiabilidad (Jasmine JS)

Este repositorio contiene el desarrollo del proyecto final de la asignatura, el cual integra un mini-framework de pruebas unitarias híbrido inspirado en la sintaxis de Jasmine en JavaScript, una batería de pruebas avanzadas aplicadas al algoritmo de búsqueda binaria, análisis estático de complejidad, y un modelo de regresión lineal para la predicción de confiabilidad de software en Node.js.

## Estructura del Proyecto

*   `runAll.js`: Script de integración que ejecuta la suite completa de pruebas unitarias, analiza métricas, efectúa pruebas de mutación, calibra el modelo predictivo de confiabilidad y exporta las métricas consolidadas en formato JSON.
*   `package.json`: Archivo de configuración de Node.js.
*   `algoritmo/`:
    *   `busquedaBinaria.js`: Implementación del algoritmo de búsqueda binaria con validación de tipos y contratos de precondición/postcondición.
*   `framework/`:
    *   `hybridFramework.js`: Biblioteca de testing con sintaxis Jasmine (`describe`/`it`), aserciones (`toBe`, `toNotBe`, `toThrow`), motor de espías (`createSpy`, `spyOn`) y autogenerador de casos de prueba.
    *   `metrics.js`: Calculador de complejidad ciclomática de código JS, detector de pruebas inestables (flaky tests) y perfilador de tiempos.
    *   `mutation.js`: Motor interno que aplica mutaciones en `busquedaBinaria.js` para calcular el Mutation Score.
*   `tests/`:
    *   `testAdvanced.js`: Suite avanzada que integra pruebas basadas en contratos y property-based testing en JavaScript.
*   `prediction/`:
    *   `reliabilityModel.js`: Ajuste matemático de regresión lineal por mínimos cuadrados ordinarios (MCO) que estima la confiabilidad basándose en complejidad ciclomática, patrones de uso y cobertura.
*   `dashboard/`:
    *   `index.html`: Dashboard web interactivo diseñado con estética moderna (Glassmorphic Dark Mode) para la visualización de resultados y curvas predictivas.
    *   `style.css`: Estilización responsiva y animaciones del dashboard.
    *   `data.json`: Archivo de datos generado dinámicamente que alimenta el dashboard.

---

## Requisitos de Instalación

El proyecto se ejecuta sobre **Node.js** (v18 o superior). No es necesario instalar librerías externas o dependencias para la lógica central, ya que todo está desarrollado en JavaScript nativo.

---

## Guía de Ejecución

### 1. Ejecución Completa de la Suite y Generación de Datos
Para ejecutar el framework, correr las pruebas avanzadas y calibrar el modelo predictivo en JavaScript, ejecute:

```bash
npm start
```
(O directamente `node runAll.js`).

Al concluir, el script reportará los indicadores principales en la terminal y guardará los detalles en `dashboard/data.json`.

### 2. Visualización del Dashboard Interactivo
Una vez ejecutado el paso anterior, abra el archivo `dashboard/index.html` en cualquier navegador web moderno (Chrome, Firefox, Edge, etc.) para interactuar con las visualizaciones y gráficos de regresión lineal.
