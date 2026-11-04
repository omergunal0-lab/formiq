// FORMIQ AI coach - Supabase Edge Function ("coach")
// Only signed-in users can call it. Each user gets DAILY_LIMIT AI requests per day.
// The API key is stored only on the server (Edge Function Secrets → ANTHROPIC_API_KEY).
import Anthropic from "npm:@anthropic-ai/sdk";
import { createClient } from "npm:@supabase/supabase-js@2";

// Cheapest model. Can be changed with the AI_MODEL secret.
const MODEL = Deno.env.get("AI_MODEL") || "claude-haiku-5-5";
const DAILY_LIMIT = Number(Deno.env.get("DAILY_LIMIT") || "15");

const SYSTEM_COACH =
  "Sen FORMIQ uygulamasının Türkçe fitness ve beslenme koçusun. Yalnızca antrenman, beslenme, uyku, toparlanma ve alışkanlık konularında yardım et; diğer istekleri kibarca reddet. En fazla 8 kısa satır yaz; somut ve uygulanabilir ol. Tıbbi teşhis veya tedavi önerme; ağrı ya da sağlık sorunu varsa uzmana yönlendir.";
const SYSTEM_FOOD =
  "Verilen yemek listesini kalemlere ayır ve her kalem için yaklaşık kalori (kcal) ve protein (g) tahmin et. Porsiyon yazılmamışsa Türkiye'deki tipik porsiyonu varsay. n alanına porsiyonla birlikte kısa kalem adı yaz.";
const FOOD_SCHEMA = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: { n: { type: "string" }, k: { type: "integer" }, p: { type: "integer" } },
        required: ["n", "k", "p"],
        additionalProperties: false,
      },
    },
  },
  required: ["items"],
  additionalProperties: false,
};

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

const anthropic = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY") });
const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method" }, 405);
  if (!Deno.env.get("ANTHROPIC_API_KEY")) return json({ error: "ai-off" }, 503);

  // 1) Who is calling?
  const token = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  const { data: auth } = await admin.auth.getUser(token);
  const user = auth?.user;
  if (!user) return json({ error: "auth" }, 401);

  let body: { task?: string; prompt?: string; input?: string };
  try { body = await req.json(); } catch { return json({ error: "bad json" }, 400); }
  const task = body.task === "food" ? "food" : "coach";

  // 2) Food: look in the shared cache first (free, does not use the limit)
  let q = "";
  if (task === "food") {
    q = String(body.input || "").toLocaleLowerCase("tr-TR").replace(/\s+/g, " ").trim().slice(0, 300);
    if (!q) return json({ error: "empty" }, 400);
    const { data: hit } = await admin.from("food_cache").select("items").eq("q", q).maybeSingle();
    if (hit) return json({ text: JSON.stringify(hit.items), cached: true });
  }
  const prompt = String(body.prompt || "").slice(0, 6000);
  if (task === "coach" && !prompt.trim()) return json({ error: "empty" }, 400);

  // 3) Daily limit
  const { data: used, error: qerr } = await admin.rpc("ai_take", { p_user: user.id });
  if (qerr) return json({ error: "server" }, 500);
  if (used > DAILY_LIMIT) return json({ error: "quota", limit: DAILY_LIMIT, left: 0 }, 429);
  const left = Math.max(0, DAILY_LIMIT - used);

  // 4) Call Claude
  try {
    const msg = await anthropic.messages.create(
      task === "food"
        ? {
            model: MODEL,
            max_tokens: 1024,
            output_config: { effort: "low", format: { type: "json_schema", schema: FOOD_SCHEMA } },
            system: SYSTEM_FOOD,
            messages: [{ role: "user", content: q }],
          }
        : {
            model: MODEL,
            max_tokens: 1024,
            output_config: { effort: "low" },
            system: SYSTEM_COACH,
            messages: [{ role: "user", content: prompt }],
          },
    );
    if (msg.stop_reason === "refusal") {
      return json({ text: "Bu isteğe yanıt veremiyorum. Sorunu farklı şekilde sormayı dene.", left });
    }
    const text = msg.content.filter((b) => b.type === "text").map((b) => (b as { text: string }).text).join("\n").trim();

    if (task === "food") {
      let items: unknown[] = [];
      try { items = JSON.parse(text).items || []; } catch { /* ignored */ }
      if (items.length) await admin.from("food_cache").upsert({ q, items });
      return json({ text: JSON.stringify(items), left });
    }
    return json({ text, left });
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) return json({ error: "rate" }, 429);
    if (e instanceof Anthropic.APIError) return json({ error: "upstream", status: e.status }, 502);
    return json({ error: "server" }, 500);
  }
});
