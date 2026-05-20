import { GoogleGenAI } from '@google/generative-ai';

export default async function handler(req, res) {
    // Evitar que otros servidores metan mano (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Responder rápido a las pruebas de conexión del navegador
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ respuesta: 'Método no permitido. Usa POST.' });
    }

    try {
        const { pregunta } = req.body;

        if (!pregunta) {
            return res.status(400).json({ respuesta: 'No enviaste ninguna pregunta, Luis.' });
        }

        // Llamar a la clave que acabamos de revisar en tu panel de Vercel
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ respuesta: 'Error: La clave GEMINI_API_KEY no está configurada en Vercel.' });
        }

        // Conectar con la IA de Google usando el modelo rápido actual
        const ai = new GoogleGenAI({ apiKey: apiKey });
        const respuestaIA = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: pregunta,
        });

        const textoLimpiado = respuestaIA.text;

        // Devolver la respuesta limpia a tu gemini.html
        return res.status(200).json({ respuesta: textoLimpiado });

    } catch (error) {
        console.error("Error en la función de la API:", error);
        return res.status(500).json({ 
            respuesta: 'Hubo un problema al procesar la respuesta de Gemini en el servidor.',
            detalles: error.message 
        });
    }
}
