import { GoogleGenAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // Permite que tu página web consulte sin bloqueos
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ respuesta: 'Método no permitido.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ respuesta: 'Error: Falta la clave GEMINI_API_KEY en los parámetros de Vercel.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const { pregunta } = req.body;
    if (!pregunta) {
      return res.status(400).json({ respuesta: 'Por favor, escribe una pregunta.' });
    }

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: pregunta }] }],
    });

    const textoRespuesta = result.response.text();
    return res.status(200).json({ respuesta: textoRespuesta });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      respuesta: 'Hubo un error interno al conectar con Gemini.',
      error: error.message 
    });
  }
}
