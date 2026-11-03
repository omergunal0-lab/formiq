// FORMIQ AI proxy (Cloudflare Worker).
// The app sends {task, prompt}; the worker adds a fixed system prompt and calls the Claude API.
// The API key stays here on the server and is never shipped inside the app.
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM = {
  coach:
    "Sen FORMIQ uygulamasının Türkçe konuşan fitness ve beslenme koçusun. Yalnızca antrenman, beslenme, uyku, toparlanma ve alışkanlık konularında yardım et; bunların dışındaki istekleri kibarca reddet. Kısa, somut ve uygulanabilir yaz. Tıbbi teşhis veya tedavi önerme; ağrı, sakatlık veya sağlık sorunu varsa bir uzmana yönlendir.",
  food:
    "Sen bir beslenme asistanısın. Verilen yemek listesinin kalori ve protein değerlerini tahmin edersin. Yalnızca istenen JSON dizisini döndür, başka metin yazma.",
};

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "content-type, x-formiq-key",
};
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", ...CORS } });

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
    if (request.method !== "POST") return json({ error: "method" }, 405);
    if (env.APP_KEY && request.headers.get("x-formiq-key") !== env.APP_KEY) return json({ error: "auth" }, 401);

    let body;
    try { body = await request.json(); } catch { return json({ error: "bad json" }, 400); }
    const task = body.task === "food" ? "food" : "coach";
    const prompt = String(body.prompt || "").slice(0, 12000);
    if (!prompt.trim()) return json({ error: "empty" }, 400);

    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
    try {
      const msg = await client.beta.messages.create({
        model: env.MODEL || "claude-opus-5-5",
        max_tokens: 4000,
        output_config: { effort: "low" },
        system: SYSTEM[task],
        messages: [{ role: "user", content: prompt }],
        // If the main model declines a request, the API re-runs it on its recommended fallback model.
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
      });
      if (msg.stop_reason === "refusal") return json({ text: "Bu soruya yanıt veremiyorum. Sorunu farklı şekilde sormayı dene." });
      const text = msg.content.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
      return json({ text });
    } catch (e) {
      if (e instanceof Anthropic.RateLimitError) return json({ error: "rate" }, 429);
      if (e instanceof Anthropic.APIError) return json({ error: "upstream", status: e.status }, 502);
      return json({ error: "server" }, 500);
    }
  },
};
