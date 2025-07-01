// /src/app/api/sendComplaint/route.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { category, message, userEmail } = body;

    if (!category || !message) {
        return NextResponse.json({ error: "Category and message required" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_APP_PASSWORD,  // пароль приложения
        },
        tls: {
            rejectUnauthorized: false,
        },
    });


    try {
        await transporter.sendMail({
            from: `"Edu Support" <${process.env.YANDEX_EMAIL}>`,
            to: process.env.SUPPORT_EMAIL,
            subject: `Жалоба: ${category}`,
            text: `
Категория: ${category}
Почта пользователя: ${userEmail || "Не указана"}
Сообщение: ${message}
      `,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Ошибка при отправке:", error);
        return NextResponse.json({ error: "Ошибка при отправке письма" }, { status: 500 });
    }
}
