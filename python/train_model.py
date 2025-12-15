import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
import joblib

# 1. Загружаем данные
df = pd.read_csv("synthetic_ore_matte_slag.csv")

feature_cols = [
    "cu_pct",
    "fe_pct",
    "s_pct",
    "sio2_pct",
    "cao_pct",
    "al2o3_pct",
    "as_pct",
]

X = df[feature_cols]
y = df[["matte_weight", "slag_weight"]]

# 2. Делим на train/test
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 3. Модель — RandomForest (хорошо работает на табличных данных)
model = RandomForestRegressor(
    n_estimators=300,
    max_depth=12,
    random_state=42
)

# 4. Обучаем
model.fit(X_train, y_train)

# 5. Оцениваем качество
y_pred = model.predict(X_test)

mae = mean_absolute_error(y_test, y_pred)
r2  = r2_score(y_test, y_pred)

print("MAE:", mae)
print("R2 :", r2)

# 6. Сохраняем модель
joblib.dump(model, "ore_model.pkl")

print("\nМодель успешно обучена и сохранена → ore_model.pkl")
