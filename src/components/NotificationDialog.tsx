'use client'
import {BellIcon, Trash2Icon} from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {useMutation, useQuery} from "convex/react";
import Image from "next/image";
import {api} from "../../convex/_generated/api";
import {getLessonStatus} from "@/lib/utils";
import LessonCard from "@/components/LessonCard";

import messagePngDark from '../app/message-icon.png'
import {useRouter} from "next/navigation";
import {useChatContext} from "stream-chat-react";
import {useAuth} from "@/providers/authContext";
import {useUser} from "@clerk/nextjs";
import toast from "react-hot-toast";
export const NotificationDialog = ({unreadCount, unreadMessages, setUnreadCount, setUnreadMessages, refresh, clearUnreadMessages}) => {
    const {client} = useChatContext()
    const {user} = useAuth()
    const users = useQuery(api.users.getUsers)
    const me = users?.find((u) => u._id === user?.id)  ?? users?.find((u) => u.userId === user?.user_id)
    const hiddenLiveLessons = useQuery(api.lessons.getHiddenLiveLessons, {studentId: client?.userID ?? ''}) ?? []
    const lessons = useQuery(api.lessons.getAllLessons) ?? []
    const liveLessons = lessons?.filter((lesson) => {
        const status = getLessonStatus(lesson)
        return status === 'live' && !hiddenLiveLessons.includes(lesson._id)
    })
    const hideLiveLesson = useMutation(api.lessons.hideLiveLesson)
    let hasNotifications = liveLessons.length + unreadCount + 1;
    console.log(unreadMessages)

    const handleClearNotifications = async () => {
        try {
            if (!client) {
                console.warn('Client is not ready');
                return;
            }

            const channels = await client.queryChannels({
                members: { $in: [client.userID] },
            });

            for (const channel of channels) {
                await channel.markRead();
            }

            // Скрываем live-уроки
            for (const lesson of liveLessons) {

                await hideLiveLesson({lessonId: lesson._id, studentId: me?.userId})
            }

            setUnreadCount(0);
            setUnreadMessages([]);

            setTimeout(() => {
                refresh();
                toast.success('Вы успешно очистили все уведомления!')
            }, 500);
        } catch (err) {
            toast.error('Не удалось очистить уведомления!')
            console.error('Ошибка при очистке уведомлений:', err);
        }
    };


    const router =useRouter()
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" className="relative p-2">
                    <BellIcon className="w-5 h-5" />
                    {hasNotifications === 0 && null}
                    {hasNotifications && (
                        <span className="absolute text-xs text-center justify-center text-white flex items-center -top-[-4px] -right-[-4px] inline-flex h-3 w-3 rounded-full bg-red-500">

                            {liveLessons.length + unreadMessages.length}

            </span>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80">
                <div className='flex items-center justify-between'>
                    <h4 className="font-medium text-lg ">Уведомления</h4>
                    <Trash2Icon onClick={handleClearNotifications} className='cursor-pointer'/>
                </div>

                <ScrollArea className="h-64 space-y-3 pr-2">
                    {/* Уроки в прямом эфире */}
                    {liveLessons.length > 0 &&
                        liveLessons.map((lesson) => (
                            <div key={lesson._id} className="flex items-center justify-between">
                                <LessonCard lesson={lesson} />
                            </div>
                        ))}

                    {/* Уведомления о новых сообщениях */}
                    {unreadMessages.length > 0 &&
                        unreadMessages.map(({ message, channelId }, index) => (
                            <div onClick={() => router.push(`/chats/${message.user.id}`)}
                                key={`${channelId}-${message.id || index}`}
                                className="bg-muted my-4 flex flex-col gap-2 cursor-pointer
                                  p-2 rounded-lg border shadow-sm"
                            >
                                <div className='flex items-center justify-between'>


                                <Image src={messagePngDark} className='object-cover rounded-md' alt='png-image' width={32} height={32} />
                                <p className='text-muted-foreground text-sm'>{new Date(message?.updated_at).toLocaleString('ru-RU',{
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                } )}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-foreground font-medium">
                                        Новое сообщение от: {message.user?.name || message.user?.id || 'Неизвестно'}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {message.text || '[Без текста]'}
                                    </p>
                                </div>

                            </div>
                        ))}

                    {unreadMessages.length === 0 && liveLessons.length === 0 && <p className=" text-sm">Нет новых уведомлений</p>}

                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
};
