import unittest
from busqueda_binaria import busqueda_binaria

class TestInicialBusquedaBinaria(unittest.TestCase):
    """
    Conjunto inicial de pruebas unitarias para Búsqueda Binaria.
    Este conjunto de pruebas simula un testing básico/inicial que no cubre
    todas las ramas (decision coverage) del algoritmo.
    """

    def test_elemento_en_el_medio(self):
        """Prueba encontrar un elemento situado exactamente en el medio de la lista."""
        lista = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
        # El 16 está en el medio
        self.assertEqual(busqueda_binaria(lista, 16), 4)

    def test_elemento_al_inicio(self):
        """Prueba encontrar el primer elemento de la lista."""
        lista = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
        self.assertEqual(busqueda_binaria(lista, 2), 0)

    def test_elemento_al_final(self):
        """Prueba encontrar el último elemento de la lista."""
        lista = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
        self.assertEqual(busqueda_binaria(lista, 91), 9)

if __name__ == '__main__':
    unittest.main()
