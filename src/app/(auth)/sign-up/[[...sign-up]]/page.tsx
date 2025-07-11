'use client';

import { useState } from "react";
import {useAction, useMutation} from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import {motion} from "framer-motion";
import Image from "next/image";
import eduLOGO from "@/app/educatify.png";
import {useInView} from "react-intersection-observer";
import CountUp from "react-countup";
import {useTheme} from "next-themes";
import GoogleIcon from '../../../google-icon.png'
import GithubIcon from '../../../github-icon.png'
import LoaderUI from "@/components/LoaderUI";
import {useAuth} from "@/providers/authContext";
import {Button} from "@/components/ui/button";
export default function SignUpForm() {
    const register = useAction(api.auth.registerUser);
    const router = useRouter();
    const {signInWithGoogle,  login: setLogin, signInWithGitHub} = useAuth()
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "student",
    });

    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const [loading, setLoading] = useState<boolean>(false)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            setLoading(true)
            const user = await register(form);

            const token = await fetch("/api/jwt", {
                method: "POST",
                body: JSON.stringify(user),
                headers: { "Content-Type": "application/json" },
            }).then((res) => res.json()).then(res => res.token);


            setLogin(token); // <-- вот это добавь

            router.push("/");
        } catch (err: any) {
            setError(err.message || "Ошибка регистрации");
        } finally {
            setLoading(false)
        }
    };
    const {theme } = useTheme()


    const syncUser = useMutation(api.users.syncUser)

    const handleGoogleSignIn = async () => {
        try {
            const res = await signInWithGoogle();
            const { token, user } = res;

            setLogin(token); // сохраняем токен в контекст

            await syncUser({
                name: user.displayName || user.email!,
                email: user.email!,
                userId: user.uid, //  user.userId
                image: user.photoURL || undefined,
            });

            router.push("/");

        } catch (err) {
            console.error("Ошибка входа:", err);
        }
    };

    const handleGithubSignIn = async () => {
        try {
            setLoading(true)
            const { token, user } = await signInWithGitHub();
            setLogin(token); // сохраняем токен в контекст

            await syncUser({
                name: user.displayName || user.email || 'github user',
                email: user.email || undefined,
                userId: user.uid,
                image: user.photoURL || undefined,
            });
            router.push("/");
        } catch (err) {
            console.error("GitHub Login Error:", err);
        } finally {
            setLoading(false)
        }
    }
    const items = [
        { value: 40, suffix: '+', label: 'стран' },
        { value: 95, suffix: ' / 100', label: 'баллов репутации' },
        { value: 500, suffix: '', label: 'регистраций в месяц' },
    ];

// Вынесем useInView для каждого элемента
    const inViewRefs = items.map(() => useInView({ triggerOnce: true, threshold: 0.9 }));

    if (loading) {
        return <LoaderUI />;
    }
    return (
        <div className='min-h-screen relative'>

            <div className="  md:flex items-center mt-10 justify-between px-10 gap-2 md:gap-20">
                {/* Левая часть с изображением */}
                <motion.div
                    initial={{opacity: 0, x: -50}}
                    animate={{opacity: 1, x: 0}}
                    transition={{duration: 0.8, ease: "easeOut"}}
                    className="bg-cover bg-center hidden md:block"
                >
                    <Image src={eduLOGO} width={500} height={500} alt="Educatify Logo"/>
                </motion.div>

                {/* Правая часть с формой */}
                <div className=" w-full md:w-1/2 flex items-center justify-center   text-white md:px-3 lg:px-8">
                    <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-md">
                        <h2 className="text-3xl font-bold text-red-600">Добро пожаловать</h2>
                        <p className="text-sm text-gray-400">Введите ваше имя, email и пароль для регистрации</p>

                        <div className="relative w-full">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={form.name}
                                onChange={handleChange}
                                required
                                placeholder=" "
                                className="peer w-full px-4 pt-5 pb-2 text-white bg-gray-900 border border-gray-700 rounded-md placeholder-transparent focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            />
                            <label
                                htmlFor="name"
                                className="absolute left-2 top-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-[-10px] px-2 rounded-lg peer-focus:bg-gray-800 peer-focus:text-sm peer-focus:text-red-500"
                            >
                                Имя
                            </label>
                        </div>

                        <div className="relative w-full">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                placeholder=" "
                                className="peer w-full px-4 pt-5 pb-2 text-white bg-gray-900 border border-gray-700 rounded-md placeholder-transparent focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            />
                            <label
                                htmlFor="email"
                                className="absolute left-2 top-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-[-10px] px-2 rounded-lg peer-focus:bg-gray-800 peer-focus:text-sm peer-focus:text-red-500"
                            >
                                Email
                            </label>
                        </div>

                        <div className="relative w-full">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                placeholder=" "
                                className="peer w-full px-4 pt-5 pb-2 text-white bg-gray-900 border border-gray-700 rounded-md placeholder-transparent focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            />
                            <label
                                htmlFor="password"
                                className="absolute left-2 top-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-[-10px] px-2 rounded-lg peer-focus:bg-gray-800 peer-focus:text-sm peer-focus:text-red-500"
                            >
                                Пароль
                            </label>
                        </div>

                        {error && <p className="text-red-400 text-sm">{error}</p>}

                        <button
                            type="submit"
                            className="w-full hover:scale-105 transition bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md transition duration-200"
                        >
                            Зарегистрироваться
                        </button>
                        <div className='flex items-center gap-2 justify-center'>
                            <Button onClick={handleGoogleSignIn}
                                type="button"
                                className="w-full text-sm hover:scale-105 transition  flex items-center justify-center gap-4   text-center font-semibold py-3 bg-white text-black rounded-md transition duration-200"
                            >
                                <Image src={GoogleIcon} alt='google' width={30} height={30}/>

                                <p className='lg:flex hidden'>С помощью Google</p>
                            </Button>
                            <Button onClick={handleGithubSignIn}
                                type="button"
                                className="w-full text-sm hover:scale-105 transition  flex items-center justify-center gap-4   text-center font-semibold py-3 bg-white text-black rounded-md transition duration-200"
                            >
                                <Image src={GithubIcon} alt='github' width={30} height={30}/>
                                <p className='lg:flex hidden'>С помощью GitHub</p>
                            </Button>
                        </div>


                        <p className="text-sm text-gray-500 text-center">
                            Уже есть аккаунт? <a href="/sign-in" className="text-red-500 hover:underline">Войти</a>
                        </p>
                    </form>

                </div>

            </div>
            <section className="col-span-full flex flex-wrap justify-center gap-10 my-10 px-6">
                {items.map((item, index) => {
                    const {ref, inView} = inViewRefs[index];
                    return (
                        <div id='animate-grow-tinier'
                             key={index}
                             ref={ref}
                             className={`${
                                 theme === 'dark' ? 'bg-white' : 'bg-black'
                             } shadow-lg cursor-pointer  rounded-2xl px-8 py-10 
            w-[250px] text-center transition-transform duration-300 hover:scale-105`}
                        >
                            <div className="text-4xl font-bold text-primary mb-2">
                                {inView && (
                                    <CountUp end={item.value} duration={5.5} suffix={item.suffix}/>
                                )}
                            </div>
                            <p className="text-muted-foreground font-medium">{item.label}</p>
                        </div>
                    );
                })}
            </section>
        </div>
    );
}
