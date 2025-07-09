'use client'
import React from 'react'
import {useMutation, useQuery} from "convex/react";
import {api} from "../../../../convex/_generated/api";
import {Id} from '../../../../convex/_generated/dataModel'
import toast from "react-hot-toast";
import LoaderUI from "@/components/LoaderUI";
import {getMentorInfo, getStudentDisplayInfo, getStudentInfo, groupLessons} from "@/lib/utils";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {MENTOR_CATEGORY} from "@/components/hooks";
import {Badge} from "@/components/ui/badge";
import {Doc} from "../../../../convex/_generated/dataModel";
import {CalendarIcon, Car, CheckCircle2Icon, ClockIcon, XCircleIcon} from "lucide-react";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {format} from "date-fns";
import {ru} from "date-fns/locale";
import CommentDialog from "@/components/CommentDialog";
import Navbar from "@/components/Navbar";

type Lesson = Doc<"lessons">
const Page = () => {

    const users = useQuery(api.users.getUsers)
    const lessons = useQuery(api.lessons.getAllLessons)
    const updateStatus = useMutation(api.lessons.updateLessonStatus)

    const handleStatusUpdate = async (lessonId: Id<"lessons">, status: string) => {
        try {
                await updateStatus({id: lessonId, status})

            toast.success(`Статус урока был изменен на ${status}!`)
        } catch (error) {
        toast.error('Не удалось обновить статус')
        }
    }
    if (!lessons || !users) return  <LoaderUI/>

    const groupedLessons = groupLessons(lessons)

    return (
        <>
        <Navbar/>
            <div className="container relative mx-auto py-10 absolute z-20">
                <div className="flex items-center mb-8">
                    <Link href="/schedule">
                        <Button>Запланируй новый урок</Button>
                    </Link>
                </div>

                <div className="space-y-8">
                    {MENTOR_CATEGORY.map(
                        (category) =>
                            groupedLessons[category.id]?.length > 0 && (
                                <section key={category.id}>
                                    {/* CATEGORY TITLE */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <h2 className="text-xl font-semibold">{category.title}</h2>
                                        <Badge variant={category.variant}>{groupedLessons[category.id].length}</Badge>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {groupedLessons[category.id].map((lesson: Lesson) => {
                                            const candidateInfo = getStudentInfo(users, lesson.studentIds[0]);
                                            const startTime = new Date(lesson.startTime);

                                            return (
                                                <Card className="hover:shadow-md transition-all">
                                                    {/* CANDIDATE INFO */}

                                                    <CardHeader className="p-4">
                                                        <div className="flex items-center gap-3 flex-wrap">
                                                            {lesson.studentIds.map((studentId) => {
                                                                const student = getStudentInfo(users, studentId);
                                                                const {image, initials, name} = getStudentDisplayInfo(student)
                                                                console.log(student)
                                                                return (
                                                                    <div key={studentId} className="flex items-center gap-2">
                                                                        <Avatar className="h-8 w-8">
                                                                            <AvatarImage src={image} />
                                                                            <AvatarFallback>{initials}</AvatarFallback>
                                                                        </Avatar>
                                                                        <p className="text-sm">{name}</p>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </CardHeader>


                                                    {/* DATE &  TIME */}
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                            <div className="flex items-center gap-1">
                                                                <CalendarIcon className="h-4 w-4"/>
                                                                {format(startTime, "MMM dd", {locale: ru})}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <ClockIcon className="h-4 w-4"/>
                                                                {format(startTime, "hh:mm a", {locale: ru})}
                                                            </div>
                                                        </div>
                                                    </CardContent>

                                                    {/* PASS & FAIL BUTTONS */}
                                                    <CardFooter className="p-4 pt-0 flex flex-col gap-3">
                                                        {/*  {lesson.status === "completed" && (
                                                            <div className="flex gap-2 w-full">
                                                                <Button
                                                                    className="flex-1"
                                                                    onClick={() => handleStatusUpdate(lesson._id, "succeeded")}
                                                                >
                                                                    <CheckCircle2Icon className="h-4 w-4 mr-2"/>
                                                                    Pass
                                                                </Button>
                                                                <Button
                                                                    variant="destructive"
                                                                    className="flex-1"
                                                                    onClick={() => handleStatusUpdate(lesson._id, "failed")}
                                                                >
                                                                    <XCircleIcon className="h-4 w-4 mr-2"/>
                                                                    Fail
                                                                </Button>
                                                            </div>
                                                        )} */}
                                                        {lesson.status === 'completed'   &&  <CommentDialog streamCallId={lesson.streamCallId}  lesson={lesson} lessonId={lesson._id}/> }
                                                        {lesson.status === 'succeeded' &&  <CommentDialog streamCallId={lesson.streamCallId} lesson={lesson} lessonId={lesson._id}/>}
                                                    </CardFooter>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                </section>
                            )
                    )}
                </div>
            </div>
        </>
    )
}
export default Page
