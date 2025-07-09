'use client'
import React, {useEffect, useState} from 'react'
import {Doc, Id} from '../../convex/_generated/dataModel'
import {useMutation, useQuery} from "convex/react";
import {api} from "../../convex/_generated/api";
import toast from "react-hot-toast";
import {BadgeX, MessageSquareIcon, StarIcon} from "lucide-react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {ScrollArea} from "@/components/ui/scroll-area";
import {getMentorInfo, getStudentDisplayInfo, getStudentInfo} from "@/lib/utils";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {format} from "date-fns";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {ru} from "date-fns/locale";
import {useAuth} from "@/providers/authContext";

type Lesson = Doc<"lessons">;

const CommentDialog = ({lessonId, lesson}: {lessonId: Id<"lessons">; lesson: Lesson}) => {



    const [isOpen, setIsOpen] = useState(false)
    const [comment, setComment] = useState("")
    const [mark, setMark] = useState("3")
  //  const lesson = useQuery(api.lessons.getLessonByStreamCallId, {streamCallId})






    const {user} = useAuth()
    const addComment = useMutation(api.comments.addComment)
    const users = useQuery(api.users.getUsers) ?? []
    const existingComments = useQuery(api.comments.getComments, { lessonId })

    /*    const students = users?.filter(user => {

        lesson.studentIds.some(id => {
            console.log(id, user.clerkId)
           return  id.toString() === user.clerkId.toString()
        })
    }); */
    const me = users?.find((u) => u._id === user.id)  ?? users?.find((u) => u.userId === user?.user_id)


    const student = lesson.studentIds.filter((studentId) => {
        return getStudentInfo(users, studentId)
    })


    const [studentId, setStudentId] = useState<string | undefined>(undefined);
    const handleSubmit = async () => {
        if (!comment.trim() || comment.length <= 5 ) return toast.error('Пожалуйста напиши комментарий от 5 слов')
        if (!studentId) {
            toast.error("Пожалуйста, выберите ученика");
            return;
        }
        if (!me) {
            toast.error("Пожалуйста, войдите в аккаунт");
            return;
        }
        const numericRating = parseInt(mark);
        if (isNaN(numericRating) || numericRating < 2 || numericRating > 5) {
            return toast.error("Оценка должна быть от 2 до 5");
        }
        try {
            setIsOpen(true)

            await addComment({
                lessonId,
                content: comment.trim(),
                rating: numericRating,
                studentId,
                mentorId: me._id
            })
            toast.success('Оценка успешно поставлена')
            setMark("3")
            setComment("")
            setIsOpen(false)
        } catch (error) {
            toast.error('Не удалось поставить оценку')
            console.log(error)
        }
    }

    const renderStars = (rating: number) => (
        <div className='flex gap-0.5'>
            {[0,2, 3, 4,5 ].map((val) => (
                <StarIcon key={val} className={`w-4 h-4 ${val <= rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`}/>
            ))}
        </div>
    )

    if (existingComments === undefined || users === undefined) return null




    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {/* TRIGGER BUTTON */}
            <DialogTrigger asChild>
                <Button variant="secondary" className="w-full">
                    <MessageSquareIcon className="h-4 w-4 mr-2" />
                   Добавить оценку
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Оценка за урок</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {existingComments.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium">Прошлые оценки</h4>
                                <Badge variant="outline">
                                    {existingComments.length} оценк{existingComments.length !== 1 ? "и" : "а"}

                                </Badge>
                            </div>

                            {/* DISPLAY EXISTING COMMENTS */}
                            <ScrollArea className="h-[240px]">
                                <div className="space-y-4">
                                    {existingComments.map((comment, index) => {
                                        const mentor = getMentorInfo(users, comment.mentorId);
                                        const student = getStudentInfo(users, comment.studentId)
                                        const {initials, name, image} = getStudentDisplayInfo(student)

                                        return (
                                            <div key={index} className="rounded-lg border p-4 space-y-3">
                                                <div className="flex items-center  justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={mentor.image}/>
                                                            <AvatarFallback>{mentor.initials}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="text-sm font-medium">{mentor.name}</p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {format(comment._creationTime, "MMM d, yyyy • h:mm ", {locale: ru})}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className='flex items-center gap-2'>
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={image}/>
                                                            <AvatarFallback>{initials}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="text-sm font-medium">{name.length > 10 ? `${name.slice(0, 10)}...` : name }</p>
                                                        </div>

                                                        {renderStars(comment.rating)}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{comment.content}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Кому ставится оценка?</Label>
                        <Select onValueChange={setStudentId} value={studentId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Выберите ученика"/>
                            </SelectTrigger>
                            <SelectContent>
                                {lesson.studentIds?.map((studentId) => {
                                    const student = getStudentInfo(users, studentId)
                                    const {image, initials, name} = getStudentDisplayInfo(student)

                                    return (
                                            <SelectItem className='' key={studentId} value={studentId}>

                                                {name}
                                            </SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>
                    </div>


                    <div className="space-y-4">
                        {/* RATING */}
                        <div className="space-y-2">
                            <Label>Оценка</Label>
                            <Select value={mark} onValueChange={setMark}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select rating"/>
                                </SelectTrigger>
                                <SelectContent>
                                {[1, 2, 3, 4, 5].map((value) => (
                                        <SelectItem key={value} value={value.toString()}>
                                            <div className="flex items-center gap-2">{renderStars(value)}</div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* COMMENT */}
                        {}
                        <div className="space-y-2">
                            <Label>Ваш комментарий</Label>
                            <Textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Поделитесь объяснением к выставлению такой оценки "
                                className="h-32"
                            />
                        </div>
                    </div>
                </div>

                {/* BUTTONS */}
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Отменить
                    </Button>
                    <Button onClick={handleSubmit}>Поставить оценку</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
export default CommentDialog
