'use client';

import { useMutation, useQuery } from "convex/react";
import EditorJS from "@editorjs/editorjs";
import { useEffect, useRef, useState } from "react";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Delimiter from "@editorjs/delimiter";
import ImageTool from "@editorjs/image";
import List from "@editorjs/list";
import Code from '@editorjs/code';
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useAuth } from "@/providers/authContext";
import {SaveIcon} from "lucide-react";

const RichDocumentEditor = ({ lessonId }: { lessonId: string }) => {
    const editorRef = useRef<EditorJS | null>(null);
    const saveContent = useMutation(api.editorContent.saveEditorContent);
    const content = useQuery(api.editorContent.getEditorContent, { lessonId });
    const { user } = useAuth();
    const [isSaving, setIsSaving] = useState(false);

    // Установка редактора
    useEffect(() => {
        if (!user || editorRef.current) return;

        const editor = new EditorJS({
            holder: "editorjs",
            data: content ?? {}, // Если пусто — передаём пустой объект
            tools: {
                header: Header,
                quote: Quote,
                delimiter: Delimiter,
                list: List,
                code: Code,
                image: {
                    class: ImageTool,
                    config: {
                        uploader: {
                            async uploadByFile(file: File) {
                                const formData = new FormData();
                                formData.append("file", file);
                                formData.append("upload_preset", "my_editor_uploads");

                                const res = await fetch("https://api.cloudinary.com/v1_1/dzl0zflxs/image/upload", {
                                    method: "POST",
                                    body: formData,
                                });

                                const data = await res.json();

                                if (data.secure_url) {
                                    return {
                                        success: 1,
                                        file: { url: data.secure_url },
                                    };
                                } else {
                                    console.error("Cloudinary upload error:", data);
                                    return { success: 0 };
                                }
                            },
                        },
                    },
                },
            },
        });

        editorRef.current = editor;

        return () => {
            editor.destroy?.();
            editorRef.current = null;
        };
    }, [user, content]);

    // Сохранение вручную
    const handleSave = async () => {
        if (!editorRef.current) return;
        setIsSaving(true);
        try {
            const saved = await editorRef.current.save();
            await saveContent({ lessonId, content: saved });
            toast.success("Содержимое сохранено");
        } catch (err) {
            console.error("Ошибка при сохранении:", err);
            toast.error("Не удалось сохранить");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="relative h-full flex flex-col">

            <div
                id="editorjs"
                className="border border-muted p-4 rounded-md flex-1 overflow-auto min-h-[400px] max-h-[calc(100vh-12rem)]"
            />


            <div className="absolute  bottom-40 right-14 mt-4 flex justify-end z-30">
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-green-500 text-white"
                >
                    <SaveIcon/>
                    {isSaving ? "Сохраняем..." : "Сохранить"}
                </Button>
            </div>
        </div>
    );
};

export default RichDocumentEditor;
