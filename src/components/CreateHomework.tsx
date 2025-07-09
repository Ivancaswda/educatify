import React, {useState} from 'react'
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {useMutation} from "convex/react";
import {api} from "../../convex/_generated/api";
import toast from "react-hot-toast";


const CreateHomework = ({lessonId}: {lessonId: string}) => {

    const [homework, setHomework] = useState("")
    const [open, setOpen] = useState(false)
    const createHomeworkMutation = useMutation(api.lessons.createHomework)

    const handleSubmit = async () => {
        try {
            if (!homework) {
                toast.error("Напишите задание")
                return
            }
            await createHomeworkMutation({
                content: homework,
                lessonId
            })
            toast.success("Домашнее задание отправлено!");
            setOpen(false);
            setHomework("");
        } catch (error) {
            console.error(error);
            toast.error("Ошибка при отправке");
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Добавить домашку</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Домашнее задание</DialogTitle>
                </DialogHeader>
                <Textarea
                    value={homework}
                    onChange={(e) => setHomework(e.target.value)}
                    placeholder="Напиши здесь текст задания..."
                />
                <div className="flex justify-end gap-2 mt-2">
                    <Button onClick={handleSubmit}>Сохранить</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
export default CreateHomework
