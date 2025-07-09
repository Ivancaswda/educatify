// app/api/jwt/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_change_me";

export async function POST(req: NextRequest) {
    try {
        const user = await req.json();


        if (!user || !user.id || !user.email) {
            return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
        }

        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image || null,
            },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        return NextResponse.json({ token });
    } catch (err) {
        console.error("JWT Error:", err);
        return NextResponse.json({ error: "Token generation failed" }, { status: 500 });
    }
}
