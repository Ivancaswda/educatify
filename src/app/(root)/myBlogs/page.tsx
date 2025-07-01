'use client';

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import {Loader2Icon, Trash2Icon, PencilIcon, XCircleIcon} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import PostCard from "@/components/PostCard";
import {useAuth} from "@/providers/authContext";

export default function MyBlogsPage() {
    const { user } = useAuth();
    const myPosts = useQuery(api.blogPosts.getAllPosts) ?? [];
    const deletePost = useMutation(api.blogPosts.deletePost);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const users = useQuery(api.users.getUsers) ?? [];

    const me = users?.find((u) => u._id === user?.id ||  u.userId === user?.user_id)

    const filteredPosts = myPosts.filter(post => post.authorId === me._id || post.authorId === me.userId);

    async function handleDelete(id: string) {
        setDeletingId(id);
        try {
            await deletePost({id});
            toast.success("Пост удалён");
        } catch (e) {
            toast.error("Ошибка при удалении поста");
        } finally {
            setDeletingId(null);
        }

    }

    const updatePost = useMutation(api.blogPosts.updatePost);

    const [title, setTitle] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(false);



    return (
        <div className="max-w-4xl mx-auto py-16 px-4 relative">
            <h1 className="text-3xl font-bold mb-8">Мои посты</h1>

            {filteredPosts.length === 0 ? (
                <p className="text-muted-foreground">У вас пока нет постов.</p>
            ) : (
                <div className=" flex flex-col md:flex-row  items-center gap-4">
                    {filteredPosts.map((post) => {


                        return (
                            <PostCard key={post._id} post={post} onDelete={handleDelete} />
                        );
                    })}
                </div>
            )}
        </div>
    );
}
