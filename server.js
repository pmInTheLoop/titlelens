// TitleLens server for Google AI Studio / Cloud Run / any Node 18+ host.
// Serves public/index.html and proxies questions to Gemini, so the API key never reaches the browser.
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY;
// Pick any model your key can use in AI Studio. "gemini-flash-latest" points at the newest Flash model.
const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";
const INDEX = fs.readFileSync(path.join(__dirname, "public", "index.html"));

async function askGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": API_KEY },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 800 },
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error?.message || `Gemini returned HTTP ${res.status}`;
    const code = res.status === 429 ? "rate_limited" : res.status === 404 ? "model_not_found" : "upstream_error";
    throw { status: res.status, code, message: msg };
  }
  const text = (data?.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("").trim();
  if (!text) throw { status: 502, code: "empty_completion", message: "Gemini returned no text" };
  return text;
}

http.createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/api/ask") {
    let body = "";
    req.on("data", (c) => { body += c; if (body.length > 300000) req.destroy(); });
    req.on("end", async () => {
      res.setHeader("Content-Type", "application/json");
      try {
        if (!API_KEY) throw { status: 500, code: "no_key", message: "Set GEMINI_API_KEY on the server." };
        const { prompt } = JSON.parse(body || "{}");
        if (!prompt || typeof prompt !== "string") throw { status: 400, code: "bad_request", message: "Missing prompt" };
        const text = await askGemini(prompt);
        res.end(JSON.stringify({ text, model: MODEL }));
      } catch (e) {
        res.statusCode = e.status || 500;
        res.end(JSON.stringify({ code: e.code || "upstream_error", error: e.message || String(e) }));
      }
    });
    return;
  }
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(INDEX);
}).listen(PORT, () => console.log(`TitleLens on http://localhost:${PORT} using ${MODEL}`));
