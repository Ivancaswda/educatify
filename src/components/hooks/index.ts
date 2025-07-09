
import {CalendarIcon, CameraIcon, GroupIcon, PhoneCallIcon} from "lucide-react";
export const mentorNavigation = [
    {
        name: 'Новый звонок',
        title: 'Новый звонок',
        desc: 'Начать новый звонок',
        icon: PhoneCallIcon,

    },
    {
        name: 'Войти в урок',
        title: 'Присоедениться к уроку',
        desc: 'Присоедениться к уже существующему уроку ',
        icon: GroupIcon
    },
    {
        name: 'Планирования',
        title: 'schedule',
        desc: 'Запланируйте новые видео-уроки ',
        icon: CalendarIcon
    },
    {
        name: 'Видеозаписи',
        title: 'recordings',
        desc: 'Доступ к записям ваших видеоуроков',
        icon: CameraIcon
    }
]


export const studentNavigation = [

    {
        name: 'Войти в урок',
        title: 'Присоедениться к уроку',
        desc: 'Присоедениться к уже существующему уроку ',
        icon: GroupIcon
    },
    {
        name: 'Планирования',
        title: 'schedule',
        desc: 'Запланируйте новые видео-уроки ',
        icon: CalendarIcon
    },
    {
        name: 'Видеозаписи',
        title: 'recordings',
        desc: 'Доступ к записям ваших видеоуроков',
        icon: CameraIcon
    }
]
export const MENTOR_CATEGORY = [
    { id: "upcoming", title: "Последующие уроки", variant: "outline" },
    { id: "completed", title: "Закончено", variant: "secondary" },
    { id: "succeeded", title: "Успешно", variant: "default" },
    { id: "failed", title: "Ошибка", variant: "destructive" },
] as const;


export const TIME_SLOTS = [
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00","21:00", "22:00","23:00",


];
export type QuickActionType = (typeof mentorNavigation)[number];