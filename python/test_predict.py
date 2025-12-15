import joblib
import pandas as pd

model = joblib.load("ore_model.pkl")

# Входные данные с именами колонок — как во время обучения
sample = pd.DataFrame([{
    "cu_pct": 1.2,
    "fe_pct": 20.5,
    "s_pct": 28.0,
    "sio2_pct": 35.0,
    "cao_pct": 7.0,
    "al2o3_pct": 4.0,
    "as_pct": 0.2
}])

pred = model.predict(sample)[0]

print("Прогноз массы штейна:", pred[0])
print("Прогноз массы шлака :", pred[1])
