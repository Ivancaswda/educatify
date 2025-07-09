import React, {useState} from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {useEffect} from "react";
import {Button} from "@/components/ui/button";
import {MessageSquareIcon} from "lucide-react";
import {useMutation} from "convex/react";
import {api} from "../../convex/_generated/api";
import toast from "react-hot-toast";

export default function RemarkModal({initialComment, initialRating, studentMarkId, me}) {
    const [isOpen, setIsOpen] = useState(false)
    const [rating, setRating] = useState(initialRating)
    const [comment, setComment] = useState(initialComment)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const updateCommentAndMark = useMutation(api.comments.updateComment)



    useEffect(() => {
        if (isOpen) {
            // При открытии обновляем локальный стейт начальными значениями
            setRating(initialRating)
            setComment(initialComment)
            setError(null)
        }
    }, [isOpen])

    const handleSubmit = async () => {
        setLoading(true)
        setError(null)
        try {
            if (Number(rating) > 5 || Number(rating) <= 1 ) {
                return toast.error('Оценка должна быть поставлена по пятибальной системе')
            }
            await updateCommentAndMark({
                commentId: studentMarkId,
                rating: Number(rating),
                content: comment,
                mentorId: me._id
            })

            setIsOpen(true)
        } catch (e) {
            setError(e.message || "Ошибка обновления")
        } finally {
            setLoading(false)
            setIsOpen(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" className="flex items-center gap-2">
                    <MessageSquareIcon className="h-4 w-4" />
                    Исправить оценку
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Изменить оценку и комментарий</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4 mt-4">
                    <label className="flex flex-col gap-1">
                        Оценка (1-5):
                        <input
                            type="number"
                            min={1}
                            max={5}
                            value={rating}
                            onChange={e => setRating(e.target.value)}
                            className="border rounded p-2"
                        />
                    </label>

                    <label className="flex flex-col gap-1">
                        Комментарий:
                        <textarea
                            rows={4}
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            className="border rounded p-2"
                        />
                    </label>

                    {error && <p className="text-red-600">{error}</p>}

                    <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => setIsOpen(false)} disabled={loading}>
                            Отмена
                        </Button>
                        <Button onClick={handleSubmit} disabled={loading || !rating}>
                            {loading ? "Сохраняем..." : "Сохранить"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}