'use client'
import React from 'react';

export default function PrivacyPage() {
    return (
        <div className="max-w-4xl mx-auto py-20 px-4 relative">
            <h1 className="text-4xl font-bold mb-6">Политика конфиденциальности</h1>
            <p className="mb-4 text-muted-foreground">
                Ваша конфиденциальность важна для нас. Мы собираем только необходимую информацию, чтобы предоставить и улучшить наши услуги.
            </p>
            <h2 className="text-2xl font-semibold mt-6 mb-2">Какие данные мы собираем:</h2>
            <ul className="list-disc list-inside text-muted-foreground">
                <li>Имя и адрес электронной почты</li>
                <li>Информация об активности на платформе</li>
                <li>Cookies для улучшения работы сайта</li>
            </ul>
            <h2 className="text-2xl font-semibold mt-6 mb-2">Как мы используем данные:</h2>
            <ul className="list-disc list-inside text-muted-foreground">
                <li>Для предоставления доступа к образовательным материалам</li>
                <li>Для персонализации пользовательского опыта</li>
                <li>Для связи с вами (например, уведомления)</li>
            </ul>
            <p className="mt-6 text-muted-foreground">
                Мы не передаём ваши данные третьим лицам без вашего согласия.
            </p>

            <div className='w-full mt-10 gap-2 text-xl items-center text-center flex justify-center'>С любовью <span className='text-primary font-semibold'>Educatify Team</span></div>
        </div>
    );
}
