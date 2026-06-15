import csv
from allpairspy import AllPairs

# Definición de factores y sus niveles según la especificación del hotel
parameters = [
    # Factor 1: Tipo de habitación (5 niveles) - > 4 niveles
    ["Individual", "Doble", "Suite", "Familiar", "Presidencial"],
    # Factor 2: Método de pago (5 niveles) - > 4 niveles
    ["Tarjeta de credito", "Tarjeta de debito", "PayPal", "Transferencia bancaria", "Pago en recepcion"],
    # Factor 3: Duración de la estancia (5 niveles) - > 4 niveles
    ["1 noche", "2 noches", "3 noches", "5 noches", "7 noches"],
    # Factor 4: Temporada (4 niveles)
    ["Baja", "Media", "Alta", "Festiva"],
    # Factor 5: Tipo de cliente (4 niveles)
    ["Nuevo", "Frecuente", "Corporativo", "VIP"]
]

print("Generando casos de prueba Pairwise (combinatoria por pares)...")
pairwise_cases = list(AllPairs(parameters))

print(f"Total de casos generados de forma exhaustiva (cartesiana): {5 * 5 * 5 * 4 * 4} combinaciones.")
print(f"Total de casos generados por Pairwise (cobertura 2-way): {len(pairwise_cases)} casos.")

# Guardar en CSV
csv_filepath = "casos_prueba_pairwise.csv"
with open(csv_filepath, mode="w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["ID", "Tipo de Habitacion", "Metodo de Pago", "Duracion Estancia", "Temporada", "Tipo de Cliente"])
    for idx, case in enumerate(pairwise_cases, 1):
        writer.writerow([idx] + case)

# Guardar en Markdown para el reporte
md_filepath = "casos_prueba_pairwise.md"
with open(md_filepath, mode="w", encoding="utf-8") as f:
    f.write("# Casos de Prueba Generados mediante Pairwise (ACTS / AllPairs)\n\n")
    f.write(f"- **Total de factores**: 5\n")
    f.write(f"- **Combinaciones cartesianas (exhaustivas)**: 2,000 combinaciones\n")
    f.write(f"- **Casos generados por Pairwise**: {len(pairwise_cases)} casos\n\n")
    f.write("| Caso | Tipo de Habitación | Método de Pago | Duración | Temporada | Tipo de Cliente |\n")
    f.write("| --- | --- | --- | --- | --- | --- |\n")
    for idx, case in enumerate(pairwise_cases, 1):
        f.write(f"| {idx} | {case[0]} | {case[1]} | {case[2]} | {case[3]} | {case[4]} |\n")

print(f"Archivos generados con éxito: {csv_filepath} y {md_filepath}")
