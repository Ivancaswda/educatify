import React, {useState} from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";
import {useQuery} from "convex/react";
import {api} from "../../convex/_generated/api";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {BookIcon} from "lucide-react";
const DisplayMarkInfo = ({children, rating, comment, lesson, studentMark}) => {

    const [isOpen, setIsOpen] = useState(false)
    const users = useQuery(api.users.getUsers) ?? []


    const mentor = users.find((user) => user.userId === studentMark.mentorId || user._id === studentMark.mentorId)
    console.log(mentor)

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {/* Клик по children открывает модалку */}
            <div onClick={() => setIsOpen(true)}>
                {children}
            </div>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ваша оценка и комментарий</DialogTitle>
                </DialogHeader>


                <div className="flex flex-col gap-4 mt-4">
                    <div className="flex items-center gap-6">
                        <div className='flex items-center gap-2'>


                            <svg width={20} height={20} xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 640 512">
                                <path fill='white'
                                      d="M160 64c0-35.3 28.7-64 64-64L576 0c35.3 0 64 28.7 64 64l0 288c0 35.3-28.7 64-64 64l-239.2 0c-11.8-25.5-29.9-47.5-52.4-64l99.6 0 0-32c0-17.7 14.3-32 32-32l64 0c17.7 0 32 14.3 32 32l0 32 64 0 0-288L224 64l0 49.1C205.2 102.2 183.3 96 160 96l0-32zm0 64a96 96 0 1 1 0 192 96 96 0 1 1 0-192zM133.3 352l53.3 0C260.3 352 320 411.7 320 485.3c0 14.7-11.9 26.7-26.7 26.7L26.7 512C11.9 512 0 500.1 0 485.3C0 411.7 59.7 352 133.3 352z"/>
                            </svg>
                            Учитель:
                        </div>
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={mentor?.image}/>
                                <AvatarFallback>{mentor?.name.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <p className="text-sm font-semibold text-primary/90">{mentor?.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-5">
                        <div className='flex items-center gap-2'>
                            <BookIcon/>
                            Урок:
                        </div>

                        <div>{lesson.title}</div>
                    </div>
                    <label className="flex items-center gap-5">
                        Ваша оценка:
                        <input disabled={true}
                               type="number"
                               min={1}
                               max={5}
                               value={rating}
                               className="border rounded px-2 py-1"
                        />
                    </label>

                    <label className="flex flex-col gap-1">
                        Комментарий:
                        <textarea
                            rows={4}
                            value={comment}
                            disabled={true}
                            className="border rounded p-2"
                        />
                    </label>


                    <div className="flex justify-end gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => setIsOpen(false)}

                        >
                            Отмена
                        </Button>

                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
export default DisplayMarkInfo
