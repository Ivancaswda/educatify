
import { useRouter } from "next/navigation";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import toast from "react-hot-toast";
import {useMutation, useQuery} from "convex/react";
import {api} from "../../../convex/_generated/api";
import {useAuth} from "@/providers/authContext";

const useLessonActions = () => {
    const router = useRouter();
    const client = useStreamVideoClient();


    const {user} = useAuth()
    const users = useQuery(api.users.getUsers) ?? []

    const me = users.find((u) => u._id === user?.id)  ?? users?.find((u) => u.userId === user?.user_id)



    const createLesson = useMutation(api.lessons.createLesson)
    const createInstantLesson = async () => {
        if (!client) return;

        try {
            const id = crypto.randomUUID();
            const call = client.call("default", id);

            await call.getOrCreate({
                data: {
                    starts_at: new Date().toISOString(),
                    custom: {
                        description: "Instant Meeting",
                    },
                },
            });


            await createLesson({
                userId: me?._id,
                title: `Мгновенный урок - ${id}`,
                desc: "Быстрый звонок без расписания",
                startTime: Date.now(),
                status: "live",
                streamCallId: call.id,
                studentIds: [], // можно позже добавить
                mentorIds: client.streamClient.userID ? [client.streamClient.userID] : [],
            });

            router.push(`/lesson/${call.id}`);
            toast.success("Видеоурок создан!");
        } catch (error) {
            console.error(error);
            toast.error("Не удалось создать видеоурок. Попробуйте еще раз!");
        }
    };

    const joinLesson = (callId: string) => {
        if (!client) return toast.error("Не удалось присоедениться к уроку! Попробуй снова!");
        router.push(`/lesson/${callId}`);
    };

    return { createInstantLesson, joinLesson };
};

export default useLessonActions;
