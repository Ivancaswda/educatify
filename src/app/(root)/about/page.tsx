'use client'
import educatifyImage from '../../white-educatify.png'
import Image from 'next/image'
import Link from "next/link";
import CountUp from "react-countup";
import {useInView} from "react-intersection-observer";
import {PlayCircleIcon} from "lucide-react";
import firstPhoto from '../../first_educatify_photo_about.jpg'
import secondPhoto from '../../second_educatify_photo_about.jpg'
import {useTheme} from "next-themes";
export default function AboutPage() {

    const {theme} = useTheme()

    return (
        <div
            className="min-h-screen bg-gradient-to-br relative from-primary/20 via-background to-background  flex flex-col">


            <section title='Воспроизвести видео'
                     className="relative cursor-pointer h-screen w-full overflow-hidden mb-20">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute top-0 left-0 w-full h-full object-cover z-0"
                >
                    <source src="https://cdn.pixabay.com/video/2024/06/06/215475_large.mp4" type="video/mp4"/>
                    Не удалось воспроизвести видео 😣
                </video>

                {/* затемнение и текст */}
                <div
                    className="absolute inset-0 bg-black/60 z-10 flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-white text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                        Добро пожаловать в Educatify
                    </h1>
                    <p className="text-white text-lg md:text-xl max-w-2xl drop-shadow">
                        Образовательная платформа нового поколения — онлайн-уроки, чаты, расписания и многое другое.
                    </p>
                    <PlayCircleIcon id='animate-grow' className='absolute bottom-20 text-primary  size-20'/>
                </div>

            </section>
            <main className="flex-grow max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
                {/* Что такое educatify */}
                <section className="flex flex-col justify-center">
                    <h2 className="text-3xl font-semibold text-primary mb-6">Что такое educatify?</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                        <strong>educatify</strong> — это современная образовательная платформа, которая помогает
                        студентам и преподавателям
                        легко проводить онлайн-уроки, обмениваться знаниями и общаться в чатах. Мы создаём пространство,
                        где обучение становится доступным, удобным и интерактивным.
                    </p>
                    <Image
                        src={firstPhoto}
                        alt="Online education illustration"
                        width={600}
                        height={400}
                        className="rounded-lg shadow-lg"
                    />
                </section>

                {/* Наши возможности */}
                <section className="flex flex-col justify-center">
                    <h2 className="text-3xl font-semibold text-primary mb-6">Наши возможности</h2>
                    <ul className="list-disc list-inside space-y-3 text-muted-foreground text-lg mb-6">
                        <li>Проведение онлайн-уроков с поддержкой видео и аудио</li>
                        <li>Интерактивные чаты для общения между учениками и преподавателями</li>
                        <li>Гибкое расписание и планирование уроков</li>
                        <li>Система рейтингов и отзывов для повышения качества обучения</li>
                        <li>Персональные профили пользователей с историей занятий и достижениями</li>
                    </ul>
                    <Image
                        src={secondPhoto}
                        alt="Education tools"
                        width={600}
                        height={400}
                        className="rounded-lg shadow-lg"
                    />
                </section>

                {/* Почему выбирают нас */}
                <section className="col-span-full md:col-span-1 flex flex-col justify-center">
                    <h2 className="text-3xl font-semibold text-primary mb-6">Почему выбирают нас?</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                        В educatify мы уделяем особое внимание качеству и удобству:
                    </p>
                    <ul className="list-disc list-inside space-y-3 text-muted-foreground text-lg">
                        <li>Удобный и интуитивно понятный интерфейс</li>
                        <li>Надёжные технологии для стабильной работы онлайн-занятий</li>
                        <li>Поддержка и помощь пользователей 24/7</li>
                        <li>Постоянное развитие платформы и добавление новых функций</li>
                        <li>Безопасность данных и конфиденциальность</li>
                    </ul>
                </section>


            </main>

            <section className="col-span-full flex flex-wrap justify-center gap-10 my-20 px-6">
                {[
                    {value: 6000, suffix: ' мин', label: 'на рынке'},
                    {value: 40, suffix: '+', label: 'стран'},
                    {value: 95, suffix: ' / 100', label: 'баллов репутации'},
                ].map((item, index) => {
                    const {ref, inView} = useInView({triggerOnce: true, threshold: 0.9});
                    return (
                        <div key={index} ref={ref}
                            className={` ${theme === 'dark' ? 'bg-white' : 'bg-black'} shadow-lg cursor-pointer rounded-2xl px-8 py-10 
                                w-[250px] text-center transition-transform duration-300 hover:scale-105`}
                        >
                            <div className="text-4xl font-bold text-primary mb-2">
                                {inView && (
                                    <CountUp end={item.value} duration={2.5} suffix={item.suffix}/>
                                )}
                            </div>
                            <p className="text-muted-foreground font-medium">{item.label}</p>
                        </div>
                    );
                })}
            </section>


            <footer className='mt-20'>
                {/* Контент ниже изображения */}
                <div className="w-full h-full relative bg-cover bg-center imagedd">
                    {/* Это будет фоновое изображение */}
                    <div id="inject" className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-20">
                        {/* Ваши элементы, которые находятся на фоне */}
                    </div>

                    {/* Другие элементы, которые будут поверх фона */}
                    <div
                        className="absolute top-0 left-0 z-30 w-full h-full flex flex-col items-center justify-center mt-10 gap-16">
                        <div id="image-container" className="flex items-center relative">
                            <Image
                                src={educatifyImage}
                                alt="Logo"
                                width={46}
                                height={46}
                                className="z-30 rounded-full cursor-pointer hover:scale-105 transition-all
                                 w-[110px] object-cover"
                                id="big-image"
                            />
                        </div>
                        <h1 className="text-white text-center font-semibold  text-[20px] sm:text-[45px]">
                            Cовременная и образовательная платформа <span className='text-primary'>Educatify</span>
                        </h1>

                        <button className="px-8 py-3 font-medium text-primary rounded-3xl text-sm bg-white text-black">
                            <Link className="underline-none" href="/about">
                                Подробнее
                            </Link>
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    )
}
