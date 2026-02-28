import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        // Hardcoded credentials as requested
        if (username === "OSDOP" && password === "OSDOP2026@") {
            const response = NextResponse.json({ success: true });

            // Set a long-lived cookie for the session
            cookies().set({
                name: "admin_session",
                value: "osdop-authenticated",
                httpOnly: true,
                path: "/",
                maxAge: 60 * 60 * 24 * 30, // 30 days
                secure: process.env.NODE_ENV === "production",
            });

            return response;
        }

        return NextResponse.json(
            { error: "Credenciales inválidas" },
            { status: 401 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
