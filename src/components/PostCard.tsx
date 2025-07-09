import React, {useRef, useState} from 'react'
import { Button } from "@/components/ui/button";
import {Loader2Icon, Trash2Icon, PencilIcon, XCircleIcon} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import toast from "react-hot-toast";
import {useMutation} from "convex/react";
import {api} from "../../convex/_generated/api";
const PostCard = ({post, onDelete}) => {

    const [localTitle, setLocalTitle] = useState(post.title);
    const [localExcerpt, setLocalExcerpt] = useState(post.excerpt);
    const [localImage, setLocalImage] = useState(post.image);
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

// Обработчик клика по изображению
    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

// Определяем, что показывать — новое изображение или старое
    const displayImage = file
        ? URL.createObjectURL(file) // если выбрали новый файл
        : post.image || '/default-image.jpg'; // если есть постер, иначе дефолт

    const [loading, setLoading] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const updatePost = useMutation(api.blogPosts.updatePost);

    const handleUpdate = async () => {
        setLoading(true);
        try {

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

            await updatePost({ id: post._id, title: localTitle, excerpt: localExcerpt, image: data.secure_url });
            toast.success("Пост обновлен!");
        } catch (e) {
            toast.error("Ошибка обновления поста");
        } finally {
            setLoading(false);
            setEditOpen(false);
        }
    };

    return (
        <div key={post._id} className="border rounded-xl p-4 shadow-sm relative">
            <Image
                src={post.image}
                width={600}
                height={300}
                alt={post.title}
                className="w-full h-56 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-sm text-muted-foreground mb-2">{post.excerpt}</p>

            <div className="flex gap-4 mt-4">

                {/* Edit Dialog */}
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                            <PencilIcon className="mr-1 w-4 h-4"/> Редактировать
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader className='py-4'>
                            <DialogTitle>Редактировать пост</DialogTitle>
                        </DialogHeader>

                        <Input
                            placeholder="Название"
                            value={localTitle}
                            onChange={(e) => setLocalTitle(e.target.value)}
                            className="mb-4"
                        />
                        <Input
                            placeholder="Описание"
                            value={localExcerpt}
                            onChange={(e) => setLocalExcerpt(e.target.value)}
                            className="mb-4"
                        />

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
                                width={150}
                                height={150}
                                className="rounded border"
                            />
                            <p className="text-sm mt-2 text-center text-muted-foreground mt-1">
                                Нажмите на изображение, чтобы изменить
                            </p>
                        </div>

                        <Button onClick={handleUpdate} disabled={loading}>
                            {loading ? <Loader2Icon className="animate-spin w-4 h-4"/> : "Сохранить"}
                        </Button>
                    </DialogContent>
                </Dialog>

                {/* Delete Dialog */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            size="sm"
                            variant="destructive"

                        >


                                <Trash2Icon className="mr-1 w-4 h-4"/>
                            Удалить
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader className='py-4 text-center w-full'>
                            <DialogTitle className='text-center w-full'>Вы уверены, что хотите удалить этот пост?</DialogTitle>
                            <DialogDescription className=' text-center w-full'>Вы не сможете потом восстановить его.</DialogDescription>

                        </DialogHeader>
                        <div className='w-full flex items-center justify-end'>
                            <Button className='w-[110px]'
                                size="sm"
                                variant="destructive"
                                onClick={() =>  onDelete(post._id)}

                            >

                                <Trash2Icon className="mr-1 w-4 h-4"/>

                                Удалить
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
export default PostCard
