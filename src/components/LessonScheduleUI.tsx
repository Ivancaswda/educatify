'use client'
import React, {useState} from 'react'
import {useStreamVideoClient} from "@stream-io/video-react-sdk";
import {useUser} from "@clerk/nextjs";
import {useMutation, useQuery} from "convex/react";
import {api} from "../../convex/_generated/api";
import toast from "react-hot-toast";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import UserInfo from "@/components/UserInfo";
import {useRouter} from "next/navigation";
import { Loader2Icon, XIcon} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import {TIME_SLOTS} from "@/components/hooks";
import LessonCard from "@/components/LessonCard";
import {useUserRole} from "@/components/hooks/useUserRole";
import {useAuth} from "@/providers/authContext";

const LessonScheduleUi = () => {
    const client = useStreamVideoClient()
    const {user} = useAuth()
    const [open, setOpen] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const users = useQuery(api.users.getUsers) ?? []
    const me = users.find((u) => u._id === user.id || u.userId === user?.user_id)
    const lessons = useQuery(api.lessons.getAllLessons) ?? [];

    const {isMentor} = useUserRole()

    const createLesson = useMutation(api.lessons.createLesson,)

    const students = users?.filter((u) => u.role === 'student')

    const mentors = users?.filter((u) => u.role === 'mentor')

    const [formData, setFormData] = useState<{
        title: string;
        desc: string;
        date: Date;
        time: string;
        studentIds: string[];
        mentorIds: string[];
    }>({
        title: "",
        desc: "",
        date: new Date(),
        time: '14:00',
        studentIds: [],
        mentorIds: user?.id ? [user.id] : []
    })

    const scheduleLesson = async () => {
        if (!client || !user) return

        if (formData?.studentIds.length === 0 || formData?.mentorIds.length === 0) {
            toast.error('Пожалуйста выберите ученика и хотя-бы одного учителя!')
            return
        }

        setIsCreating(true)



        try {
            const {title, desc, date, time, studentIds, mentorIds} = formData

            const [hours, minutes] = time.split(':')
            const lessonDate = new Date(date)
            lessonDate.setHours(parseInt(hours), parseInt(minutes), 0)

            const id = crypto.randomUUID()
            const call = client.call('default', id)

            await call.getOrCreate({
                data: {
                    starts_at: lessonDate.toISOString(),
                    custom: {
                        desc: title,
                        additionalDetails: desc
                    }
                }
            })

            await createLesson({
                title,
                desc,
                userId: me.userId,
                startTime: lessonDate.getTime(),
                status: 'upcoming',
                streamCallId: id,
                studentIds: formData.studentIds,
                mentorIds: formData.mentorIds
            });

            setOpen(false)
            toast.success('Урок спланирован успешно!')

            // resetting all data
            setFormData({
                title: "",
                desc: "",
                date: new Date(),
                time: '14:00',
                studentIds:  [],
                mentorIds: user?.id ? [user.id] : []
            })
        } catch (error) {
            toast.error('Не удалось спланировать урок')
            console.log(error)

        } finally {
            setIsCreating(false)
        }
    }

    const addMentor = (mentorId: string) => {
        if (!formData.mentorIds.includes(mentorId)) {
            setFormData((prev) => ({
                ...prev,
                mentorIds: [...prev.mentorIds, mentorId],
            }));
        }
    }
    const addStudent = (studentId: string) => {
        if (studentId === user?.id) return;
        setFormData((prevState) => ({
            ...prevState,
            studentIds: [...prevState.studentIds, studentId]
        }))
    }


    const removeMentor = (mentorId: string) => {
        if (mentorId === user?.id) return;

        setFormData((prevState) => ({
            ...prevState,
            mentorIds: prevState.mentorIds.filter((id) => id !== mentorId)
        }))
    }

    const removeStudent = (studentId: string) => {
        if (studentId === user?.id) return

        setFormData((prevState) => ({
            ...prevState,
            studentIds: prevState.studentIds.filter((id) => id !== studentId)
        }))

    }

    const selectedMentors = mentors.filter((i) => formData.mentorIds.includes(i.userId)) // selected mentors from db
    const availableMentors = mentors.filter((i) => !formData.mentorIds.includes(i.userId)) // not selected mentors from db

    const selectedStudents = students.filter((i) => formData.studentIds.includes(i.userId))
    const availableStudents = students.filter((i) => !formData.studentIds.includes(i.userId))




    return (
        <div className="container  relative  p-6 space-y-8 w-[100%]  absolute z-20">
            <div className="flex items-center justify-between">
                {/* HEADER INFO */}
                <div>
                    <h1 className="text-3xl font-bold">Уроки</h1>
                    {me.role === 'mentor' ?
                        <p className="text-muted-foreground mt-1">Управляйте и планируйте ваши будущие уроки</p> :
                    <p className="text-muted-foreground mt-1">Посещайте уроки преподователей и получайте знания</p>}

                </div>


                {me.role === 'mentor' && <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                        <Button size="lg">Запланировать урок</Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[500px] h-[calc(100vh-200px)] overflow-auto">
                        <DialogHeader>
                            <DialogTitle>Планирование урока</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            {/* INTERVIEW TITLE */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Название</label>
                                <Input
                                    placeholder="Название урока"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                />
                            </div>

                            {/* INTERVIEW DESC */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Описание</label>
                                <Textarea
                                    placeholder="Описание урока..."
                                    value={formData.desc}
                                    onChange={(e) => setFormData({...formData, desc: e.target.value})}
                                    rows={3}
                                />
                            </div>


                            {/* CANDIDATE */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Ученики</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {selectedStudents.map((student) => (
                                        <div
                                            key={student.userId}
                                            className="inline-flex items-center gap-2 bg-secondary px-2 py-1 rounded-md text-sm"
                                        >
                                            <UserInfo user={student}/>
                                            {student.userId !== user?.id && (
                                                <button
                                                    onClick={() => removeStudent(student.userId)}
                                                    className="hover:text-destructive transition-colors"
                                                >
                                                    <XIcon className="h-4 w-4"/>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {availableStudents.length > 0 ? (
                                    <Select onValueChange={addStudent}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Добавить ученика"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableStudents.map((student) => (
                                                <SelectItem key={student.userId} value={student.userId}>
                                                    <UserInfo user={student}/>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : 'Ученики не найдены'}
                            </div>

                            {/* INTERVIEWERS */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Учителя</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {selectedMentors.map((mentor) => (
                                        <div
                                            key={mentor.userId}
                                            className="inline-flex items-center gap-2 bg-secondary px-2 py-1 rounded-md text-sm"
                                        >
                                            <UserInfo user={mentor}/>
                                            {mentor.userId !== user?.id && (
                                                <button
                                                    onClick={() => removeMentor(mentor.userId)}
                                                    className="hover:text-destructive transition-colors"
                                                >
                                                    <XIcon className="h-4 w-4"/>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {availableMentors.length > 0 && (
                                    <Select onValueChange={addMentor}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Добавить учителя"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableMentors.map((mentor) => (
                                                <SelectItem key={mentor.userId} value={mentor.userId}>
                                                    <UserInfo user={mentor}/>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>

                            {/* DATE & TIME */}
                            <div className="flex gap-4">
                                {/* CALENDAR */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Дата планирования</label>
                                    <Calendar
                                        mode="single"
                                        selected={formData.date}
                                        onSelect={(date) => date && setFormData({...formData, date})}
                                        disabled={(date) => date < new Date()}
                                        className="rounded-md border"
                                    />
                                </div>

                                {/* TIME */}

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Время</label>
                                    <Select
                                        value={formData.time}
                                        onValueChange={(time) => setFormData({...formData, time})}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select time"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TIME_SLOTS.map((time) => (
                                                <SelectItem key={time} value={time}>
                                                    {time}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={() => setOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={scheduleLesson} disabled={isCreating}>
                                    {isCreating ? (
                                        <>
                                            <Loader2Icon className="mr-2 size-4 animate-spin"/>
                                            Планируем...
                                        </>
                                    ) : (
                                        "Запланировать урок"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog> }

            </div>


            {!lessons ? (
                <div className="flex justify-center py-12">
                    <Loader2Icon className="size-8 animate-spin text-muted-foreground"/>
                </div>
            ) : lessons.length > 0 ? (
                <div className="spacey-4">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {lessons.map((lesson) => (
                            <LessonCard key={lesson._id} lesson={lesson}/>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 text-muted-foreground w-[97vw]">Пока нету запланированных уроков!</div>
            )}
        </div>
    )
}
export default LessonScheduleUi
