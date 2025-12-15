import numpy as np
import pandas as pd

N = 1000           # сколько строк сгенерировать
BATCH_WEIGHT = 500 # кг

rng = np.random.default_rng(42)

rows = []
for _ in range(N):
    cu   = rng.uniform(0.1, 3.0)
    fe   = rng.uniform(10, 30)
    s    = rng.uniform(10, 35)
    sio2 = rng.uniform(20, 50)
    cao  = rng.uniform(0, 15)
    al2o3= rng.uniform(0, 10)
    a_s  = rng.uniform(0, 1)

    total = cu + fe + s + sio2 + cao + al2o3 + a_s
    # нормализация к 100%
    k = 100 / total
    cu   *= k
    fe   *= k
    s    *= k
    sio2 *= k
    cao  *= k
    al2o3*= k
    a_s  *= k

    # индексы
    matte_index = 0.8 * cu + 0.6 * fe + 0.7 * s
    slag_index  = 0.7 * sio2 + 0.9 * cao + 0.6 * al2o3

    base_matte = 0.35
    base_slag  = 0.55
    base_gas   = 0.10

    matte_share = base_matte + 0.001 * (matte_index - 50) - 0.0005 * (slag_index - 50)
    slag_share  = base_slag  + 0.001 * (slag_index  - 50) - 0.0005 * (matte_index - 50)

    # clamp
    matte_share = float(np.clip(matte_share, 0.15, 0.7))
    slag_share  = float(np.clip(slag_share, 0.20, 0.8))

    total_share = matte_share + slag_share + base_gas
    matte_share /= total_share
    slag_share  /= total_share
    gas_share   = base_gas / total_share

    matte_weight = BATCH_WEIGHT * matte_share + rng.normal(0, 5)
    slag_weight  = BATCH_WEIGHT * slag_share  + rng.normal(0, 5)

    rows.append({
        "cu_pct": cu,
        "fe_pct": fe,
        "s_pct": s,
        "sio2_pct": sio2,
        "cao_pct": cao,
        "al2o3_pct": al2o3,
        "as_pct": a_s,
        "matte_weight": matte_weight,
        "slag_weight": slag_weight,
    })

df = pd.DataFrame(rows)
df.to_csv("synthetic_ore_matte_slag.csv", index=False)
print(df.head())
