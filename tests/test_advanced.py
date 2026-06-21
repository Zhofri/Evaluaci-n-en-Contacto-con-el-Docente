import random
from algoritmo.busqueda_binaria import busqueda_binaria
from framework.hybrid_framework import TestRunner

def registrar_pruebas_avanzadas(runner: TestRunner):
    
    # 1. Contratos
    def test_contratos():
        def it_validar_tipos():
            runner.expect(lambda: busqueda_binaria("no_es_lista", 10)).to_raise(TypeError)
            runner.expect(lambda: busqueda_binaria([1, 2, 3], "no_es_entero")).to_raise(TypeError)
        runner.it("debe validar precondicion de tipos de parametros (TypeError)", it_validar_tipos)
        
        def it_validar_orden():
            runner.expect(lambda: busqueda_binaria([5, 3, 8, 1], 3)).to_raise(ValueError)
        runner.it("debe validar precondicion de ordenamiento de lista (ValueError)", it_validar_orden)
        
        def it_validar_postcondiciones():
            runner.expect(busqueda_binaria([10, 20, 30], 20)).to_be(1)
            runner.expect(busqueda_binaria([10, 20, 30], 25)).to_be(-1)
        runner.it("debe validar postcondiciones de exito en busquedas", it_validar_postcondiciones)
        
    runner.describe("Búsqueda Binaria - Pruebas de Contratos", test_contratos)

    # 2. Propiedades
    def test_propiedades():
        def it_verificar_invariantes():
            for _ in range(50):
                tamano = random.randint(1, 100)
                datos = sorted(random.sample(range(-1000, 1000), tamano))
                
                # Caso A: Buscar elemento que existe
                objetivo_existente = random.choice(datos)
                indice = busqueda_binaria(datos, objetivo_existente)
                runner.expect(datos[indice]).to_be(objetivo_existente)
                
                # Caso B: Buscar elemento que posiblemente no existe
                objetivo_inexistente = random.randint(-2000, 2000)
                indice_b = busqueda_binaria(datos, objetivo_inexistente)
                if indice_b != -1:
                    runner.expect(datos[indice_b]).to_be(objetivo_inexistente)
                else:
                    runner.expect(objetivo_inexistente not in datos).to_be(True)
        runner.it("debe verificar invariantes con datos autogenerados", it_verificar_invariantes)
        
    runner.describe("Búsqueda Binaria - Property-based Testing", test_propiedades)

    # 3. Mocks y Espías
    def test_mocks():
        def it_registrar_espias():
            spy = runner.create_spy(return_value=123)
            resultado = spy("parametro_de_prueba", 456)
            runner.expect(resultado).to_be(123)
            runner.expect(spy.get_call_count()).to_be(1)
            runner.expect(spy.was_called_with("parametro_de_prueba", 456)).to_be(True)
        runner.it("debe registrar correctamente llamadas e interactuar con spies", it_registrar_espias)
        
    runner.describe("Búsqueda Binaria - Mocks y Espías", test_mocks)
