export default async function handler(req, res) {

  try {

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // 🔥 DEBUG CLAVE
    if (!apiKey) {
      return res.status(500).json({
        error: "API KEY no existe en Vercel"
      });
    }

    const body = req.body;

    if (!body?.contents) {
      return res.status(400).json({
        error: "Body sin contents"
      });
    }

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
      apiKey;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({
        error: "Respuesta no JSON de Gemini",
        raw: text
      });
    }

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      error: err.message,
      stack: err.stack
    });
  }
}
