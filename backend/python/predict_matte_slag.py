import sys
import json
import joblib
import pandas as pd

model = joblib.load("ore_model.pkl")

# Чтение запроса от Node.js
raw = sys.stdin.read()
payload = json.loads(raw)

df = pd.DataFrame([{
    "cu_pct": payload.get("cu_pct"),
    "fe_pct": payload.get("fe_pct"),
    "s_pct": payload.get("s_pct"),
    "sio2_pct": payload.get("sio2_pct"),
    "cao_pct": payload.get("cao_pct"),
    "al2o3_pct": payload.get("al2o3_pct"),
    "as_pct": payload.get("as_pct"),
}])

pred = model.predict(df)[0]

result = {
    "matte_mass": float(pred[0]),
    "slag_mass": float(pred[1])
}

print(json.dumps(result))
