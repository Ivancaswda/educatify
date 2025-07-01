'use client'
import React from 'react';

export default function TermsPage() {
    return (
        <div className="max-w-4xl mx-auto py-20 px-4 relative">
            <h1 className="text-4xl font-bold mb-6">Условия использования</h1>
            <p className="mb-4 text-muted-foreground">
                Добро пожаловать на платформу Educatify. Используя наш сайт, вы соглашаетесь с данными условиями.
            </p>
            <h2 className="text-2xl font-semibold mt-6 mb-2">Основные положения:</h2>
            <ul className="list-disc list-inside text-muted-foreground">
                <li>Вы обязуетесь использовать платформу в соответствии с законодательством РФ.</li>
                <li>Нельзя размещать запрещённый или оскорбительный контент.</li>
                <li>Мы можем изменять условия в любое время.</li>
            </ul>
            <h2 className="text-2xl font-semibold mt-6 mb-2">Ограничение ответственности:</h2>
            <p className="text-muted-foreground">
                Мы не несем ответственности за возможные потери данных или сбои в работе платформы.
            </p>
            <div className='w-full mt-10 text-xl gap-2 items-center text-center flex justify-center'>С любовью <span
                className='text-primary font-semibold'> Educatify Team</span></div>

        </div>
    );
}
