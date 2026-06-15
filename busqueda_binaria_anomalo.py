def busqueda_binaria_anomalo(lista, objetivo):
    """
    Realiza una búsqueda binaria en una lista ordenada.
    Contiene anomalías de flujo de datos introducidas de forma intencional:
    1. Anomalía UR (Use-after-release / Variable definida pero no usada, o redefinida antes de usar).
    2. Anomalía DU (Defined-undefined / Variable usada sin inicializarse en una rama).
    """
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
