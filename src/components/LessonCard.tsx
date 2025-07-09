import React from 'react'
import {Doc} from "../../convex/_generated/dataModel";
import useLessonActions from "@/components/hooks/useLessonActions";
import {getLessonStatus} from "@/lib/utils";
import {format} from "date-fns";
import {CalendarIcon, Car} from "lucide-react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {ru} from "date-fns/locale";
import CreateHomework from "@/components/CreateHomework";
import {useUser} from "@clerk/nextjs";
import {useUserRole} from "@/components/hooks/useUserRole";
import {useStreamVideoClient} from "@stream-io/video-react-sdk";
import {useAuth} from "@/providers/authContext";
import {useQuery} from "convex/react";
import {api} from "../../convex/_generated/api";


type Lesson = Doc<"lessons">

const LessonCard = ({lesson}: {lesson: Lesson}) => {

    const {joinLesson} = useLessonActions()

    const status = getLessonStatus(lesson)
    const formattedDate = format(new Date(lesson.startTime), 'EEEE, MMMM d - h:mm ', {locale: ru})
    const {user} = useAuth()

    const users = useQuery(api.users.getUsers) ?? []

    const me = users.find((u) => u._id === user?.id) ?? users.find((u) => u.userId === user?.user_id)


    return (
        <Card>
            <CardHeader className="space-y-2">
                <div className="flex items-center justify-between ">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarIcon className="h-4 w-4" />
                        {formattedDate}
                    </div>

                    <Badge
                        variant={
                            status === "live" ? "default" : status === "upcoming" ? "secondary" : "outline"
                        }
                    >
                        {status === "live" ? "Прямо сейчас" : status === "upcoming" ? "Ожидаем начала" : "Закончен"}
                    </Badge>
                </div>

                <CardTitle>{lesson.title}</CardTitle>

                {lesson.desc && (
                    <CardDescription className="line-clamp-2">{lesson.desc}</CardDescription>
                )}
            </CardHeader>

            <CardContent>
                {status === "live" && (
                    <Button className="w-full" onClick={() => joinLesson(lesson.streamCallId)}>
                        Присоединиться к уроку
                    </Button>
                )}

                {status === "upcoming" && (
                    <Button variant="outline" className="w-full" disabled>
                        Ждём начала
                    </Button>
                )}
            </CardContent>
            <CardFooter>
                {status === 'completed' && me?.role === 'mentor' && (
                    <CreateHomework lessonId={lesson._id} />
                )}
            </CardFooter>
        </Card>
    )
}
export default LessonCard
