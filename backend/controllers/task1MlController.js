import { execFile } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// Чтобы корректно находить путь к python-файлу при использовании ES-модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function predictForward(req, res) {
  const inputPayload = req.body;

  const pythonScript = path.join(__dirname, "../python/predict_matte_slag.py");

  const py = execFile(
    "python",
    [pythonScript],
    { maxBuffer: 1024 * 1024 },
    (err, stdout, stderr) => {
      if (err) {
        console.error("ML Error:", err);
        console.error("stderr:", stderr);
        return res.status(500).json({ error: "Ошибка выполнения модели" });
      }

      try {
        const result = JSON.parse(stdout);
        return res.json(result);
      } catch (e) {
        console.error("JSON parse error:", e);
        return res.status(500).json({ error: "Ошибка обработки результата модели" });
      }
    }
  );

  // Отправляем JSON в Python stdin
  py.stdin.write(JSON.stringify(inputPayload));
  py.stdin.end();
}
