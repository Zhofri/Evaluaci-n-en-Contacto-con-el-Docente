import numpy as np

class ModeloPrediccionConfiabilidad:
    def __init__(self):
        # Coeficientes de la regresion: [w_intercept, w_complejidad, w_ejecuciones, w_cobertura]
        self.coeficientes = None
        self.r2 = 0.0
        
        # Datos historicos simulados para el entrenamiento
        # Columnas: [Intercept (1.0), Complejidad Ciclomatica, Frecuencia de Uso (ejecuciones), Cobertura (%)]
        self.X_historico = np.array([
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
        ])
        # Variable dependiente: Tasa de defectos (historico de defectos detectados)
        self.y_historico = np.array([0.02, 0.08, 0.22, 0.04, 0.15, 0.00, 0.07, 0.30, 0.03, 0.19])

    def entrenar(self):
        """
        Entrena el modelo de regresion lineal utilizando la ecuacion normal (MCO):
        w = (X^T * X)^-1 * X^T * y
        """
        X = self.X_historico
        y = self.y_historico
        
        # Resolver utilizando la ecuacion normal
        XT_X = np.dot(X.T, X)
        XT_y = np.dot(X.T, y)
        self.coeficientes = np.linalg.solve(XT_X, XT_y)
        
        # Calcular el coeficiente de determinacion R^2
        y_pred = np.dot(X, self.coeficientes)
        ss_res = np.sum((y - y_pred) ** 2)
        ss_tot = np.sum((y - np.mean(y)) ** 2)
        self.r2 = 1.0 - (ss_res / ss_tot)
        
        return self.coeficientes, self.r2

    def predecir_tasa_defectos(self, complejidad: float, ejecuciones: float, cobertura: float) -> float:
        """
        Predice la tasa de defectos esperada basada en las metricas de entrada.
        """
        if self.coeficientes is None:
            self.entrenar()
            
        x_input = np.array([1.0, complejidad, ejecuciones, cobertura])
        tasa_predicha = np.dot(x_input, self.coeficientes)
        
        # La tasa de defectos no puede ser menor a 0.0 ni mayor a 1.0
        return float(np.clip(tasa_predicha, 0.0, 1.0))

    def predecir_confiabilidad(self, complejidad: float, ejecuciones: float, cobertura: float) -> float:
        """
        Retorna el Indice de Confiabilidad del software (R), donde R = 1.0 - Tasa de defectos.
        """
        tasa_defectos = self.predecir_tasa_defectos(complejidad, ejecuciones, cobertura)
        return float(1.0 - tasa_defectos)

    def obtener_resumen_modelo(self) -> dict:
        if self.coeficientes is None:
            self.entrenar()
            
        return {
            'w_intercept': float(self.coeficientes[0]),
            'w_complejidad': float(self.coeficientes[1]),
            'w_ejecuciones': float(self.coeficientes[2]),
            'w_cobertura': float(self.coeficientes[3]),
            'r2': float(self.r2)
        }
