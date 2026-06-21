import inspect
import sys
import traceback

class ExpectationError(AssertionError):
    pass

class Expectation:
    def __init__(self, actual):
        self.actual = actual

    def to_be(self, expected):
        if self.actual != expected:
            raise ExpectationError(f"Esperado: {expected}, pero obtenido: {self.actual}")

    def to_not_be(self, expected):
        if self.actual == expected:
            raise ExpectationError(f"No esperado: {expected}, pero se obtuvo coincidencia.")

    def to_raise(self, exception_type):
        try:
            self.actual()
        except exception_type:
            return  # Prueba exitosa
        except Exception as e:
            raise ExpectationError(f"Se esperaba la excepcion {exception_type.__name__}, pero se lanzo {type(e).__name__}")
        else:
            raise ExpectationError(f"Se esperaba la excepcion {exception_type.__name__}, pero no se lanzo ninguna excepcion.")

class Spy:
    def __init__(self, original_func=None, return_value=None):
        self.original_func = original_func
        self.return_value = return_value
        self.calls = []

    def __call__(self, *args, **kwargs):
        self.calls.append({'args': args, 'kwargs': kwargs})
        if self.original_func:
            return self.original_func(*args, **kwargs)
        return self.return_value

    def get_call_count(self) -> int:
        return len(self.calls)

    def was_called_with(self, *args, **kwargs) -> bool:
        for call in self.calls:
            if call['args'] == args and call['kwargs'] == kwargs:
                return True
        return False

class TestRunner:
    def __init__(self):
        self.current_describe = None
        self.results = []
        self.passed_count = 0
        self.failed_count = 0

    def describe(self, description, func):
        self.current_describe = description
        func()
        self.current_describe = None

    def it(self, description, func):
        full_name = f"{self.current_describe} -> {description}" if self.current_describe else description
        try:
            func()
            self.results.append({'test': full_name, 'status': 'PASS', 'error': None})
            self.passed_count += 1
        except Exception as e:
            self.results.append({
                'test': full_name,
                'status': 'FAIL',
                'error': traceback.format_exc().splitlines()[-1]
            })
            self.failed_count += 1

    def expect(self, actual):
        return Expectation(actual)

    def create_spy(self, return_value=None):
        return Spy(return_value=return_value)

    def spy_on(self, obj, method_name, return_value=None):
        original = getattr(obj, method_name)
        spy = Spy(original_func=original, return_value=return_value)
        setattr(obj, method_name, spy)
        return spy

    # Autogeneracion de pruebas basada en tipos
    def generate_tests_for(self, target_function):
        """
        Inspecciona los tipos de parametros de target_function y autogenera pruebas basicas de contrato.
        """
        sig = inspect.signature(target_function)
        params = list(sig.parameters.values())
        
        generated_cases = []
        # Generar casos correctos y erróneos basados en el tipo anotado
        if len(params) >= 2:
            param1_type = params[0].annotation
            param2_type = params[1].annotation
            
            # Caso 1: Tipos correctos por defecto
            if param1_type == list and param2_type == int:
                generated_cases.append(([1, 2, 3], 2, 1))
                # Caso 2: Error de tipo en lista (TypeError)
                generated_cases.append(("no_es_lista", 2, TypeError))
                # Caso 3: Error de tipo en objetivo (TypeError)
                generated_cases.append(([1, 2, 3], "no_es_entero", TypeError))
                # Caso 4: Error de ordenamiento (ValueError)
                generated_cases.append(([3, 2, 1], 2, ValueError))
        return generated_cases
