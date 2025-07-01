'use client';

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {useMutation, useAction, useQuery} from "convex/react";
import {api} from "../../convex/_generated/api";
import { useAuth } from "@/providers/authContext";
import {useEffect, useState} from "react";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import {PencilIcon} from "lucide-react";

export default function EditProfileModal() {
    const { user } = useAuth();
    const updateProfile = useMutation(api.users.updateUserProfile);
    const storeImage = useMutation(api.users.storeUserImage);
    const getUploadUrl = useAction(api.files.generateUploadUrl);

    const users = useQuery(api.users.getUsers) ?? [];
    const me = users?.find((u) => u._id === user?.id)  ?? users?.find((u) => u.userId === user?.user_id)

    const [name, setName] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    // сбрасываем preview, когда модалка закрывается
    useEffect(() => {
        if (!open) {
            setFile(null);
            setPreviewUrl(null);
            setName("");
        }
    }, [open]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async () => {
        if (!user || !me) return;
        try {
            setLoading(true);

            if (name) {
                await updateProfile({ userId: me.userId, name });
            }

            if (file) {
                const uploadUrl = await getUploadUrl();
                const res = await fetch(uploadUrl, {
                    method: "POST",
                    body: file,
                });

                const { storageId } = await res.json();
                await storeImage({ userId: me.userId, storageId });
            }

            toast.success("Профиль обновлён!");
        } catch (err) {
            console.error(err);
            toast.error("Ошибка при обновлении профиля.");
        } finally {
            setOpen(false);
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="mt-1">
                    <PencilIcon className="mr-2" size={16} />
                    Редактировать профиль
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <PencilIcon size={20} />
                        Редактировать профиль
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name">Имя</Label>
                        <Input
                            id="name"
                            placeholder="Введите новое имя"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <Label htmlFor="image">Загрузить изображение</Label>
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        {previewUrl && (
                            <img
                                src={previewUrl}
                                alt="Предпросмотр"
                                className="mt-2 rounded-md w-24 h-24 object-cover border"
                            />
                        )}
                    </div>

                    <Button
                        onClick={handleSubmit}
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? "Сохраняю..." : "Сохранить изменения"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
