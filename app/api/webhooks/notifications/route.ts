import { NextRequest, NextResponse } from "next/server";

/**
 * Webhook de Notificaciones para el Feedback Loop.
 * Simula el envío de notificaciones (Slack, Email, In-app)
 * cuando se crea o actualiza una sugerencia.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { type, content, author, org_id } = body;

        console.log(`[Notification Webhook] Org: ${org_id} | Type: ${type}`);
        console.log(`[Notification Webhook] Author: ${author} | Content: ${content.title}`);

        // En una implementación real, aquí se enviarían los webhooks
        // por ejemplo a un canal de Slack para que los supervisores lo vean.

        // Simulación de éxito
        return NextResponse.json({
            success: true,
            delivered_to: ["in-app", "slack-proxy"],
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Error enviando notificación" }, { status: 500 });
    }
}
