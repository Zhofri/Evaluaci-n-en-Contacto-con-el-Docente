def busqueda_binaria(lista: list, objetivo: int) -> int:
    """
    Realiza una busqueda binaria en una lista ordenada.
    
    Precondiciones (Contratos):
    - La lista debe ser de tipo list.
    - El objetivo debe ser de tipo int.
    - La lista debe estar ordenada de menor a mayor.
    
    Postcondiciones (Contratos):
    - Retorna el indice correcto si el elemento existe en la lista (lista[indice] == objetivo).
    - Retorna -1 si el elemento no existe en la lista.
    """
    # 1. Verificacion de tipos (Precondiciones)
    if not isinstance(lista, list):
        raise TypeError("El primer parametro debe ser una lista.")
    if not isinstance(objetivo, int):
        raise TypeError("El objetivo debe ser un entero.")
    
    # 2. Verificacion de ordenamiento (Precondicion de Contrato)
    es_ordenada = all(lista[i] <= lista[i + 1] for i in range(len(lista) - 1))
    if not es_ordenada:
        raise ValueError("La lista de entrada debe estar ordenada.")
        
    izquierda = 0
    derecha = len(lista) - 1
    
    # Salvaguarda contra bucles infinitos (vital para mutation testing)
    limite_iteraciones = len(lista) + 5
    iteraciones = 0

    while izquierda <= derecha:
        iteraciones += 1
        if iteraciones > limite_iteraciones:
            raise RuntimeError("Limite de iteraciones excedido: bucle infinito detectado.")
            
        medio = (izquierda + derecha) // 2
        valor_medio = lista[medio]

        if valor_medio == objetivo:
            # Postcondicion: verificar que el elemento en el indice retornado es el buscado
            assert lista[medio] == objetivo, "Fallo de postcondicion: el valor medio no coincide"
            return medio
        elif valor_medio < objetivo:
            izquierda = medio + 1
        else:
            derecha = medio - 1

    # Postcondicion: verificar que el elemento realmente no esta en la lista
    assert objetivo not in lista, "Fallo de postcondicion: el elemento si existia en la lista"
    return -1
