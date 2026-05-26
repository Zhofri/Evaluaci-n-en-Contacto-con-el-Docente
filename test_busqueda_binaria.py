import unittest
from busqueda_binaria import busqueda_binaria

class TestBusquedaBinaria(unittest.TestCase):
    def setUp(self):
        # Listas de prueba ordenadas
        self.lista_vacia = []
        self.lista_un_elemento = [42]
        self.lista_comun = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
        self.lista_duplicados = [1, 3, 5, 5, 5, 7, 9]

    def test_lista_vacia(self):
        """Prueba buscar en una lista vacia."""
        self.assertEqual(busqueda_binaria(self.lista_vacia, 5), -1)

    def test_lista_un_elemento_encontrado(self):
        """Prueba buscar un elemento existente en una lista de tamano 1."""
        self.assertEqual(busqueda_binaria(self.lista_un_elemento, 42), 0)

    def test_lista_un_elemento_no_encontrado(self):
        """Prueba buscar un elemento inexistente en una lista de tamano 1."""
        self.assertEqual(busqueda_binaria(self.lista_un_elemento, 10), -1)

    def test_elemento_en_el_medio(self):
        """Prueba encontrar un elemento situado en el medio de la lista."""
        # El elemento 16 esta en el indice 4
        self.assertEqual(busqueda_binaria(self.lista_comun, 16), 4)

    def test_elemento_al_inicio(self):
        """Prueba encontrar el primer elemento de la lista."""
        self.assertEqual(busqueda_binaria(self.lista_comun, 2), 0)

    def test_elemento_al_final(self):
        """Prueba encontrar el ultimo elemento de la lista."""
        self.assertEqual(busqueda_binaria(self.lista_comun, 91), 9)

    def test_elemento_inexistente_menor(self):
        """Prueba buscar un numero menor que todos los de la lista."""
        self.assertEqual(busqueda_binaria(self.lista_comun, 1), -1)

    def test_elemento_inexistente_mayor(self):
        """Prueba buscar un numero mayor que todos los de la lista."""
        self.assertEqual(busqueda_binaria(self.lista_comun, 100), -1)

    def test_elemento_inexistente_intermedio(self):
        """Prueba buscar un numero intermedio que no esta en la lista."""
        self.assertEqual(busqueda_binaria(self.lista_comun, 15), -1)

    def test_elementos_duplicados(self):
        """Prueba con elementos duplicados en la lista (deberia retornar uno de sus indices)."""
        indice = busqueda_binaria(self.lista_duplicados, 5)
        self.assertIn(indice, [2, 3, 4])

if __name__ == '__main__':
    unittest.main()
