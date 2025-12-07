// backend/controllers/task1MlController.js
export function parseNum(value) {
  if (value === null || value === undefined || value === "") return 0;
  const n = Number(String(value).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

// Простая заглушка ML-модели.
// Потом сюда можно будет подставить настоящий вызов Python-сервиса.
export async function predictForward(req, res) {
  try {
    const {
      ore_mass_t,   // общий вес руды, т
      cu_pct,
      fe_pct,
      s_pct,
      sio2_pct,
      cao_pct,
      al2o3_pct,
      as_pct,
      au_gpt,
      ag_gpt,
    } = req.body || {};

    const oreMass = parseNum(ore_mass_t);

    const cu = parseNum(cu_pct);
    const fe = parseNum(fe_pct);
    const s = parseNum(s_pct);
    const sio2 = parseNum(sio2_pct);
    const cao = parseNum(cao_pct);
    const al2o3 = parseNum(al2o3_pct);
    const arsenic = parseNum(as_pct);
    const au = parseNum(au_gpt);
    const ag = parseNum(ag_gpt);

    // ---------- Псевдо-модель (ЗАГЛУШКА) ----------
    // Сделаем очень простые формулы, чтобы все работало.
    // Потом ты сможешь заменить это на реальные коэффициенты/ML.

    // Примеры "штейн":
    const matteCuPct = Math.min(80, cu * 2 + 10);
    const matteFePct = Math.max(0, fe * 0.6);
    const matteSPct = Math.max(0, Math.min(40, s * 1.2));
    const matteAuGpt = au * 1.3;
    const matteAgGpt = ag * 1.2;

    // Примеры "шлака"
    const slagSiO2Pct = Math.max(0, sio2 + 10);
    const slagCaOPct = Math.max(0, cao + 5);
    const slagAl2O3Pct = Math.max(0, al2o3 + 3);
    const slagFeOPct = Math.max(0, fe * 0.4);
    const slagMass = oreMass * 0.25; // 25% массы в шлаке, условно

    // Дополнительно посчитаем "нагрузку по сере" и "основность"
    const sulfurLoad = s; // пусть пока просто S, %
    const slagBasicity =
      slagCaOPct + slagAl2O3Pct > 0
        ? (slagCaOPct + slagFeOPct) / Math.max(1e-6, slagSiO2Pct + slagAl2O3Pct)
        : null;

    return res.json({
      input: {
        ore_mass_t: oreMass,
        cu_pct: cu,
        fe_pct: fe,
        s_pct: s,
        sio2_pct: sio2,
        cao_pct: cao,
        al2o3_pct: al2o3,
        as_pct: arsenic,
        au_gpt: au,
        ag_gpt: ag,
      },
      matte: {
        cu_pct: matteCuPct,
        fe_pct: matteFePct,
        s_pct: matteSPct,
        au_gpt: matteAuGpt,
        ag_gpt: matteAgGpt,
      },
      slag: {
        sio2_pct: slagSiO2Pct,
        cao_pct: slagCaOPct,
        al2o3_pct: slagAl2O3Pct,
        feo_pct: slagFeOPct,
        mass_t: slagMass,
      },
      summary: {
        sulfur_load_pct: sulfurLoad,
        slag_basicity: slagBasicity,
      },
    });
  } catch (err) {
    console.error("predictForward error:", err);
    return res.status(500).json({
      message: "Ошибка расчёта ML-модели",
    });
  }
}
