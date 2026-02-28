import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

/**
 * Proxy API para modelos de IA.
 * Permite centralizar las llamadas a proveedores como OpenAI, Anthropic, etc.
 */
export async function POST(req: NextRequest) {
    try {
        const supabase = createRouteHandlerClient({ cookies });
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const { prompt, context, type } = await req.json();

        // En una implementación real, aquí se llamaría a OpenAI/Anthropic
        // Por ahora, simularemos respuestas de IA basadas en los datos proporcionados

        let aiResponse = "";

        if (type === "sentiment_analysis") {
            aiResponse = JSON.stringify({
                score: 0.85,
                mood: "Optimista",
                keywords: ["solución", "agradecimiento", "garantía"],
                suggestions: ["Seguir usando este script", "Mencionar el bono de fidelidad"]
            });
        } else if (type === "agent_coach") {
            aiResponse = "El agente mantuvo el control de la llamada en un 90%. Sugerencia: reducir el tiempo de espera inicial en 5 segundos.";
        } else if (type === "prediction") {
            aiResponse = JSON.stringify({
                projected_conversion: "25.4%",
                trend: "up",
                confidence: "88%"
            });
        }

        return NextResponse.json({ result: aiResponse });
    } catch (error) {
        console.error("AI Proxy Error:", error);
        return NextResponse.json({ error: "Error en el procesamiento de IA" }, { status: 500 });
    }
}
