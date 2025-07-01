'use client'
import React, { useState } from "react";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {getStudentDisplayInfo, getStudentInfo} from "@/lib/utils";

export default function SupportPage() {
    const [category, setCategory] = useState("Ошибка");
    const [message, setMessage] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [status, setStatus] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("Отправка...");

        try {
            const res = await fetch("/api/sendComplaint", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category, message, userEmail }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("Спасибо! Жалоба отправлена.");
                setCategory("Ошибка");
                setMessage("");
                setUserEmail("");
            } else {
                setStatus(`Ошибка: ${data.error || "Не удалось отправить"}`);
            }
        } catch (error) {
            setStatus("Ошибка сети. Попробуйте позже.");
        }
    };

    const selectTypeOfComplaint = [

            'Ошибка',
            'Вопрос',
            'Предложение',
            'Другое'


    ]

    return (
        <div className="max-w-md sm:min-w-[400px] min-w-[100%] mx-auto bg-card/90 backdrop-blur-sm border border-border rounded-lg p-6 mt-10 shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-center text-primary">Форма жалобы</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                <Label>Почему хотите с нами связаться?</Label>
                <Select onValueChange={setCategory} value={category}>
                    <SelectTrigger>
                        <SelectValue placeholder="Выберите тип жалобы"/>
                    </SelectTrigger>
                    <SelectContent>
                        {selectTypeOfComplaint.map((s, index) => (
                            <SelectItem value={s} key={index}>{s}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <label className="flex flex-col text-sm text-muted-foreground">
                    Ваш Email (необязательно):
                    <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="example@mail.com"
                        className="mt-1 p-2 rounded border border-border bg-background text-foreground"
                    />
                </label>

                <label className="flex flex-col text-sm text-muted-foreground">
                    Сообщение:
                    <textarea
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={5}
                        placeholder="Опишите вашу жалобу..."
                        className="mt-1 p-2 rounded border border-border bg-background text-foreground resize-none"
                    />
                </label>

                <button
                    type="submit"
                    className="bg-primary text-primary-foreground py-3 rounded hover:bg-primary/90 transition-colors font-semibold"
                >
                    Отправить
                </button>
            </form>

            {status && (
                <p className="mt-4 text-center text-sm text-muted-foreground">{status}</p>
            )}
        </div>
    );
}
