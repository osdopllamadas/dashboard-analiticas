import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
    try {
        const { stats, apiKey } = await req.json();

        if (!apiKey) {
            return NextResponse.json({ error: "API Key required" }, { status: 400 });
        }

        const openai = new OpenAI({
            apiKey: apiKey,
        });

        const prompt = `
Actúa como un Analista Experto de Call Center y Calidad de Servicio. Analiza los siguientes datos de rendimiento de llamadas de los últimos 30 días y genera un informe ejecutivo en formato Markdown.

DATOS:
- Total Llamadas: ${stats.totalCalls}
- Tasa de Éxito: ${stats.successRate}%
- Tasa de Error: ${stats.errorRate}
- Duración Promedio: ${stats.avgDuration} segundos
- Costo Total: $${stats.totalCost.toFixed(2)}
- Top Razones de Corte: ${JSON.stringify(stats.topHangupReasons)}
- Período: ${stats.period}

ESTRUCTURA DEL REPORTE (en Español):
1. **Resumen Ejecutivo**: Breve visión general del desempeño.
2. **Análisis de Calidad**: Evalúa la tasa de éxito y errores. Si la tasa de error es >10%, marca como Crítico.
3. **Eficiencia y Costos**: Analiza la duración y el gasto. ¿Son las llamadas demasiado cortas (fallidas) o demasiado largas (ineficientes)?
4. **Patrones de Desconexión**: Interpreta las razones de corte. ¿El usuario corta (desinterés) o el agente (fallo técnico/lógico)?
5. **Recomendaciones Estratégicas**: 3 acciones concretas para mejorar el agente IA.

Sé directo, profesional y usa negritas para resaltar puntos clave.
`;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-3.5-turbo",
        });

        const analysis = completion.choices[0].message.content;

        return NextResponse.json({ analysis });

    } catch (error: any) {
        console.error("AI Analysis Error:", error);
        return NextResponse.json(
            { error: error.message || "Error generating analysis" },
            { status: 500 }
        );
    }
}
