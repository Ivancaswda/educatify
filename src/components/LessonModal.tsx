import React, {useState} from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import useLessonActions from "@/components/hooks/useLessonActions";



interface LessonModalProps {
    isOpen: boolean,
    onClose: () => void,
    title: string,
    isJoinLesson: boolean
}

const LessonModal = ({isOpen, onClose, title, isJoinLesson}: LessonModalProps) => {
    const [lessonUrl, setLessonUrl] = useState("");

    const {createInstantLesson, joinLesson} = useLessonActions()

    const handleStart = () => {
        if (isJoinLesson) {
            const lessonId = lessonUrl.split('/').pop()
            if (lessonId) joinLesson(lessonId)
        } else {
            createInstantLesson()
        }
        setLessonUrl("")
        onClose()
    }


    return (
        <Dialog open={isOpen} onOpenChange={onClose} >
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                {isJoinLesson && (
                    <Input
                        placeholder='Вставь ссылку урока здесь...'
                        value={lessonUrl} onChange={(e) => setLessonUrl(e.target.value)}
                    />
                )}
                <div className='flex justify-end gap-3'>
                    <Button variant='outline' onClick={onClose}>
                        Отмена
                    </Button>
                    <Button onClick={handleStart} disabled={isJoinLesson && !lessonUrl.trim()}>
                        {isJoinLesson ? 'Присоедениться' : 'начать урок'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
export default LessonModal
