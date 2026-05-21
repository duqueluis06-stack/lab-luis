export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {

    const apiKey = process.env.GEMINI_API_KEY;

    // 🔥 IMPORTANTE: asegurar body válido
    const body = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;

    if (!body || !body.contents) {
      return res.status(400).json({
        error: "Body inválido o sin contents"
      });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      }
    );

    const data = await response.json();

    return res.status(200).json(data);

  } catch (error) {

    return res.status(500).json({
      error: error.message
    });
  }
}
