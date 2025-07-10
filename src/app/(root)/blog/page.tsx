'use client'
import React, {useEffect, useRef, useState} from "react";
import Link from "next/link";
import {useMutation, useQuery} from "convex/react";
import {api} from "../../../../convex/_generated/api";
import {Loader2, Loader2Icon, PictureInPictureIcon, XCircleIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import {useUser} from "@clerk/nextjs";
import LoaderUI from "@/components/LoaderUI";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import Image from "next/image";
import {useAuth} from "@/providers/authContext";



export default function BlogPage() {

    const blogPosts = useQuery(api.blogPosts.getAllPosts) ?? []
    const users = useQuery(api.users.getUsers) ?? []
    const createPost = useMutation(api.blogPosts.createPost);
    const [title, setTitle] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState("");
    const {user} = useAuth()
    const [file,   setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);


    const me = users?.find((u) => u._id === user?.user_id ||  u.userId === user?.user_id)

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

// Определяем, что показывать — новое изображение или старое
    const displayImage = file
        ? URL.createObjectURL(file) // если выбрали новый файл
        :  'https://static.vecteezy.com/system/resources/thumbnails/014/441/137/small/cloud-upload-thin-line-icon-social-icon-set-png.png'; // если есть постер, иначе дефолт

    const [loading, setLoading] = useState<boolean>(false)


    if (!user?.user_id) {
        return <LoaderUI />
    }



    const [isOpen, setIsOpen] = useState(false)
    async function handleSubmit() {
        if (!user || !file) return;
        setIsOpen(true)
        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();

        if (!data.secure_url) {
            setLoading(false);
            return toast.error("Ошибка загрузки изображения");
        }
        setLoading(false);
        await createPost({
            title,
            excerpt,
            content,
            image: data.secure_url,
            authorId: me?.userId,
        });


        toast.success("Пост создан!");
        // очистить
        setIsOpen(false)
        setTitle("");
        setExcerpt("");
        setContent("");
        setFile(null);
    }

    return (
        <div className="min-h-screen  relative">
            {/* Hero */}
            <section className="relative h-96 bg-cover bg-center" style={{ backgroundImage: "url('https://cdn.pixabay.com/photo/2014/12/27/15/40/office-581131_1280.jpg')" }}>
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <h1 className=" text-5xl md:text-6xl font-bold">Блог Educatify</h1>
                </div>
            </section>

            {/* Articles */}

            {blogPosts.length === 0 ?
                <div className='flex gap-2 w-full mt-20 justify-center text-center flex-col items-center'>
                    <PictureInPictureIcon className='w-[150px] h-[150px]  text-primary'/>
                    <h1 className='text-2xl font-semibold'>Пока нету ни одного поста</h1>
                    <p className='text-muted-foreground text-sm'>Стань первым кто напишет свой замечательный и
                        интересный пост на <span className='text-primary font-semibold'>educatify</span></p>


                </div> : <section className="py-16 px-4 md:px-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.slice(0, 14).map((post, index) => {
                            const author = users.find((u) => u.userId === post.authorId || u._id === post.authorId)
                           return (
                            <Link href={`/blog/${post._id}`} key={index}
                                  className=" rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
                                <img src={post.image} alt={post.title} className="w-full h-56 object-cover"/>
                                <div className="p-5">
                                    <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                                    <p className="text-sm text-gray-500 mb-2">
                                        <div className='flex items-center gap-3 '>
                                            <Avatar>
                                                <AvatarImage src={author?.image}/>
                                            </Avatar>
                                            <p className='font-semibold '>{author?.name}</p>
                                            <p className='font-semibold text-2xl'>&middot;</p>
                                            <p className='text-muted-foreground font-semibold text-xs'> {author?.role === 'mentor' ? 'преподаватель' : 'ученик'}</p>
                                        </div>
                                    </p>
                                    <p className="text-gray-600">{post.excerpt}</p>
                                    <button className="mt-4 text-indigo-600 hover:underline">Читать далее →</button>
                                    <div
                                        className='w-full flex items-center justify-end text-muted-foreground text-sm mt-6'>
                                        {new Date(post._creationTime).toLocaleDateString('ru-RU', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </div>
                                </div>
                            </Link>
                           )
                        })}
                    </div>
                </section>}

            <Dialog open={isOpen} onOpenChange={setIsOpen} >
                <div className="flex items-center justify-center mt-12 w-[100vw]">
                    <DialogTrigger>

                        <Button className="mt-4 px-8 py-6 text-lg">Создать новый пост</Button>

            </DialogTrigger></div>
            <DialogContent>
                <DialogHeader className="py-4">
                        <DialogTitle>Добавьте изображение и напишите ваш пост</DialogTitle>
                    </DialogHeader>

                    <Input placeholder="Заголовок" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-4" />
                    <Input placeholder="Краткое описание" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="mt-2" />

                {/* Скрытый input file */}
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                />


                <div className="mb-4 cursor-pointer" onClick={handleImageClick}>
                    <Image
                        src={displayImage}
                        alt="Выбрать изображение"
                        width={120}
                        height={120}
                        className="rounded border "
                    />

                </div>


                    <Textarea placeholder="Основной контент" value={content} onChange={(e) => setContent(e.target.value)} className="mt-2" rows={6} />

                    <Button className="mt-6" onClick={handleSubmit}>{loading ? <Loader2Icon className='animate-spin'/> : 'Опубликовать'}</Button>
                </DialogContent>
            </Dialog>
        </div>
    );
}
