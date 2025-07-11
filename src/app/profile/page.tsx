"use client";

import { useUser } from "@clerk/nextjs";
import {useMutation, useQuery} from "convex/react";
import { api } from "../../../convex/_generated/api";
import React, {useEffect, useState} from "react";
    import ProfileHeader from "@/components/ProfileHeader";
import NoFitnessPlan from "@/components/NoFitnessPlan";
import CornerElements from "@/components/CornerElements";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {getMentorInfo, getStudentDisplayInfo, getStudentInfo} from "@/lib/utils";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
    BookMarkedIcon,
    CalendarIcon,
    ClockIcon,
    PersonStandingIcon,
    QuoteIcon,
    TextQuoteIcon, Trash2Icon, XCircleIcon,
    XIcon,
} from "lucide-react";
import {format} from "date-fns";
import {ru} from "date-fns/locale";
import CommentDialog from "@/components/CommentDialog";

import Image from "next/image";
import RemarkModal from "@/components/RemarkModal";
import DisplayMarkInfo from "@/components/DisplayMarkInfo";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {useRouter} from "next/navigation";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";
import {useUserRole} from "@/components/hooks/useUserRole";
import {useAuth} from "@/providers/authContext";
import {useTheme} from "next-themes";
import EditProfileModal from "@/components/EditProfileModal";

const ProfilePage = () => {
  const { user } = useAuth();
    const router = useRouter()
  useEffect(() => {
      if (!user) {
          router.push("/sign-in")
      }

  }, [user])



  const [displayedLessons, setDisplayedLessons] = useState([])
    const [showAllLessons, setShowAllLessons] = useState(false);
  const lessons = useQuery(api.lessons.getAllLessons) ?? []

  const users = useQuery(api.users.getUsers) ?? [];

    const me = users?.find((u) => u._id === user?.id ||  u.userId === user?.user_id)
    useEffect(() => {
        if (!me || lessons.length === 0) return;

        const myLessons = lessons.filter((lesson) =>
            lesson.studentIds.includes(me._id) || lesson.mentorIds.includes(me._id) || lesson.studentIds.includes(me.userId) || lesson.mentorIds.includes(me.userId)
        );

        setDisplayedLessons(myLessons);
    }, [me, lessons]);

    const lessonsToShow = displayedLessons.slice(3);
    const [showAllMarks, setShowAllMarks] = useState(false);
    const allMarks = useQuery(api.comments.getAllComments) ?? [];
    const [displayedMarks, setDisplayedMarks] = useState([])
    useEffect(() => {
        if (!me || allMarks.length === 0) return;

        const myMarks = allMarks.filter(comment =>
            comment.studentId === me.userId || comment.mentorId === me.userId
        );



         setDisplayedMarks(myMarks); // если нужно отобразить их в компоненте
    }, [me, allMarks]);

    const deleteHomeworkMutation = useMutation(api.lessons.deleteHomework)

    const hideHomework = useMutation(api.lessons.hideHomework)
    const hiddenHomeworks = useQuery(api.lessons.getHiddenHomework, {studentId: me?._id || me?.userId}) ?? [];
    const hiddenLessonIds = React.useMemo(() => new Set(hiddenHomeworks), [hiddenHomeworks]);

    const deleteLesson = useMutation(api.lessons.deleteLesson)
    const deleteComment = useMutation(api.comments.deleteComment)
    const {theme} = useTheme()
  return (
      <div>
          <Navbar/>

      <section className="relative z-10 pt-12 pb-32 flex-grow container mx-auto px-4">
        <ProfileHeader user={me} />

        {displayedLessons && displayedLessons.length > 0 ? (
            <div className="space-y-8">
                {/* Plan Selector */}
                <div className="relative backdrop-blur-sm border border-border p-6">
                    <CornerElements/>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold tracking-tight">
                            {" "}
                            {me?.role === 'mentor' ?  <span className="text-primary">Проводимые </span> :
                                <span className="text-primary">Посещаемые </span>}
                            <span className="text-foreground"> уроки</span>
                        </h2>
                        <div className="font-mono text-xs text-muted-foreground">
                            Всего уроков: {displayedLessons.length}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                    </div>
                </div>


                <div className="relative backdrop-blur-sm border border-border rounded-lg p-6">
                    <CornerElements/>
                    {lessonsToShow.map((item, index) => {
                        const startTime = new Date(item.startTime);

                        return (
                            <Card  className="hover:shadow-md transition-all p-2 mb-8 relative ">
                                {me?.role === 'mentor' && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>



                                            <Trash2Icon className="cursor-pointer absolute right-4 top-4 text-muted-foreground"
                                                    />
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Это действие удалит урок навсегда. Вы не сможете отменить его.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Отмена</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => {
                                                        deleteLesson({ lessonId: item._id, mentorId: me?.userId });
                                                        toast.success("Урок успешно удален!");
                                                        setDisplayedLessons((prev) => prev.filter((lesson) => lesson._id !== item._id));
                                                    }}
                                                >
                                                    Удалить
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}


                                <div className='flex  flex-col items-start gap-4 px-4'>
                                    <p className='text-gray-400 text-xs'># {item._id}</p>
                                    <div className='flex flex-col gap-1'>


                                        <h1 className='text-xl font-semibold flex items-center gap-2'>

                                            <svg width={20} height={20} xmlns="http://www.w3.org/2000/svg"
                                                 viewBox="0 0 576 512">
                                                <path fill={theme === 'dark' ? 'white' : 'black'}
                                                      d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-19.3c-2.7 1.1-5.4 2-8.2 2.7l-60.1 15c-3 .7-6 1.2-9 1.4c-.9 .1-1.8 .2-2.7 .2l-64 0c-6.1 0-11.6-3.4-14.3-8.8l-8.8-17.7c-1.7-3.4-5.1-5.5-8.8-5.5s-7.2 2.1-8.8 5.5l-8.8 17.7c-2.9 5.9-9.2 9.4-15.7 8.8s-12.1-5.1-13.9-11.3L144 381l-9.8 32.8c-6.1 20.3-24.8 34.2-46 34.2L80 448c-8.8 0-16-7.2-16-16s7.2-16 16-16l8.2 0c7.1 0 13.3-4.6 15.3-11.4l14.9-49.5c3.4-11.3 13.8-19.1 25.6-19.1s22.2 7.8 25.6 19.1l11.6 38.6c7.4-6.2 16.8-9.7 26.8-9.7c15.9 0 30.4 9 37.5 23.2l4.4 8.8 8.9 0c-3.1-8.8-3.7-18.4-1.4-27.8l15-60.1c2.8-11.3 8.6-21.5 16.8-29.7L384 203.6l0-43.6-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM549.8 139.7c-15.6-15.6-40.9-15.6-56.6 0l-29.4 29.4 71 71 29.4-29.4c15.6-15.6 15.6-40.9 0-56.6l-14.4-14.4zM311.9 321c-4.1 4.1-7 9.2-8.4 14.9l-15 60.1c-1.4 5.5 .2 11.2 4.2 15.2s9.7 5.6 15.2 4.2l60.1-15c5.6-1.4 10.8-4.3 14.9-8.4L512.1 262.7l-71-71L311.9 321z"/>
                                            </svg>
                                            {item.title}</h1>
                                        <p className='text-gray-400 text-sm flex items-center gap-2'>
                                            <TextQuoteIcon width={10} height={10}/>
                                            {item.desc}</p>
                                    </div>
                                </div>

                                <CardHeader className="py-2 px-4 flex items-center gap-4">
                                    <svg width={20} height={20} xmlns="http://www.w3.org/2000/svg"
                                         viewBox="0 0 640 512">
                                        <path fill={theme === 'dark' ? 'white' : 'black'}
                                              d="M160 64c0-35.3 28.7-64 64-64L576 0c35.3 0 64 28.7 64 64l0 288c0 35.3-28.7 64-64 64l-239.2 0c-11.8-25.5-29.9-47.5-52.4-64l99.6 0 0-32c0-17.7 14.3-32 32-32l64 0c17.7 0 32 14.3 32 32l0 32 64 0 0-288L224 64l0 49.1C205.2 102.2 183.3 96 160 96l0-32zm0 64a96 96 0 1 1 0 192 96 96 0 1 1 0-192zM133.3 352l53.3 0C260.3 352 320 411.7 320 485.3c0 14.7-11.9 26.7-26.7 26.7L26.7 512C11.9 512 0 500.1 0 485.3C0 411.7 59.7 352 133.3 352z"/>
                                    </svg>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        {item.mentorIds.map((mentorId) => {
                                            const mentor = getMentorInfo(users, mentorId);


                                            return (
                                                <div key={mentorId} className="flex items-center gap-2">

                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage className='object-cover' src={mentor.image}/>
                                                        <AvatarFallback>{mentor.initials.toUpperCase()}</AvatarFallback>
                                                    </Avatar>

                                                    <p className={`text-sm ${me._id === mentorId || me.userId === mentorId && 'text-primary/90 font-semibold'}`}>{mentor.name}</p>

                                                </div>
                                            );
                                        })}
                                        <p className='text-gray-500 text-xs'>({item.mentorIds.length})</p>
                                    </div>
                                </CardHeader>

                                <CardHeader className="p-4 flex items-center gap-4">

                                    <svg width={20} height={20} xmlns="http://www.w3.org/2000/svg"
                                         viewBox="0 0 640 512">
                                        <path fill={theme === 'dark' ? 'white' : 'black'}
                                              d="M320 32c-8.1 0-16.1 1.4-23.7 4.1L15.8 137.4C6.3 140.9 0 149.9 0 160s6.3 19.1 15.8 22.6l57.9 20.9C57.3 229.3 48 259.8 48 291.9l0 28.1c0 28.4-10.8 57.7-22.3 80.8c-6.5 13-13.9 25.8-22.5 37.6C0 442.7-.9 448.3 .9 453.4s6 8.9 11.2 10.2l64 16c4.2 1.1 8.7 .3 12.4-2s6.3-6.1 7.1-10.4c8.6-42.8 4.3-81.2-2.1-108.7C90.3 344.3 86 329.8 80 316.5l0-24.6c0-30.2 10.2-58.7 27.9-81.5c12.9-15.5 29.6-28 49.2-35.7l157-61.7c8.2-3.2 17.5 .8 20.7 9s-.8 17.5-9 20.7l-157 61.7c-12.4 4.9-23.3 12.4-32.2 21.6l159.6 57.6c7.6 2.7 15.6 4.1 23.7 4.1s16.1-1.4 23.7-4.1L624.2 182.6c9.5-3.4 15.8-12.5 15.8-22.6s-6.3-19.1-15.8-22.6L343.7 36.1C336.1 33.4 328.1 32 320 32zM128 408c0 35.3 86 72 192 72s192-36.7 192-72L496.7 262.6 354.5 314c-11.1 4-22.8 6-34.5 6s-23.5-2-34.5-6L143.3 262.6 128 408z"/>
                                    </svg>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        {item.studentIds.map((studentId) => {
                                            const student = getStudentInfo(users, studentId);
                                            const {image, initials, name} = getStudentDisplayInfo(student)

                                            return (
                                                <div key={studentId} className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage className='object-cover' src={image}/>
                                                        <AvatarFallback>{initials.toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <p className={`text-sm ${me._id === studentId || me.userId === studentId && 'text-primary/90 font-semibold'}`}>{name}</p>

                                                </div>
                                            );
                                        })}
                                        <p className='text-gray-500 text-xs'>({item.studentIds.length})</p>
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
                                {me?.role === 'mentor' &&
                                    <CardFooter className="p-4 pt-0 flex flex-col gap-3">
                                        {item.status === 'completed' &&
                                            <CommentDialog streamCallId={item.streamCallId} lesson={item}
                                                           lessonId={item._id}/>}
                                        {item.status === 'succeeded' &&
                                            <CommentDialog streamCallId={item.streamCallId} lesson={item}
                                                           lessonId={item._id}/>}


                                    </CardFooter>}

                            </Card>
                        )
                    })}
                    {displayedLessons.length > 3 && (
                        <button
                            onClick={() => setShowAllLessons(true)}
                            className="mt-4 w-full px-4 py-2 bg-primary text-white rounded"
                        >
                            Показать еще
                        </button>
                    )}



                </div>
                {showAllLessons && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-background rounded-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
                            <h3 className="text-xl font-bold mb-4">Все уроки</h3>
                            <button
                                onClick={() => setShowAllLessons(false)}
                                className="mb-4 text-sm text-muted-foreground hover:text-foreground"
                            >
                                Закрыть
                            </button>

                            {displayedLessons.map((item) => {
                                const startTime = new Date(item.startTime);

                                return (
                                    <Card className="hover:shadow-md transition-all p-2 mb-8 ">
                                        {me?.role === 'mentor' && (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>

                                                   <Trash2Icon
                                                                className="cursor-pointer absolute right-4 top-4 text-muted-foreground"
                                                            />


                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Это действие удалит урок навсегда. Вы не сможете отменить его.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => {
                                                                deleteLesson({ lessonId: item._id, mentorId: me.userId });
                                                                toast.success("Урок успешно удален!");
                                                            }}
                                                        >
                                                            Удалить
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )}


                                        <div className='flex  flex-col items-start gap-4 px-4'>
                                            <p className='text-gray-400 text-xs'># {item._id}</p>
                                            <div className='flex flex-col gap-1'>


                                                <h1 className='text-xl font-semibold flex items-center gap-2'>

                                                    <svg width={20} height={20} xmlns="http://www.w3.org/2000/svg"
                                                         viewBox="0 0 576 512">
                                                        <path fill={theme === 'dark' ? 'white' : 'black'}
                                                              d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-19.3c-2.7 1.1-5.4 2-8.2 2.7l-60.1 15c-3 .7-6 1.2-9 1.4c-.9 .1-1.8 .2-2.7 .2l-64 0c-6.1 0-11.6-3.4-14.3-8.8l-8.8-17.7c-1.7-3.4-5.1-5.5-8.8-5.5s-7.2 2.1-8.8 5.5l-8.8 17.7c-2.9 5.9-9.2 9.4-15.7 8.8s-12.1-5.1-13.9-11.3L144 381l-9.8 32.8c-6.1 20.3-24.8 34.2-46 34.2L80 448c-8.8 0-16-7.2-16-16s7.2-16 16-16l8.2 0c7.1 0 13.3-4.6 15.3-11.4l14.9-49.5c3.4-11.3 13.8-19.1 25.6-19.1s22.2 7.8 25.6 19.1l11.6 38.6c7.4-6.2 16.8-9.7 26.8-9.7c15.9 0 30.4 9 37.5 23.2l4.4 8.8 8.9 0c-3.1-8.8-3.7-18.4-1.4-27.8l15-60.1c2.8-11.3 8.6-21.5 16.8-29.7L384 203.6l0-43.6-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM549.8 139.7c-15.6-15.6-40.9-15.6-56.6 0l-29.4 29.4 71 71 29.4-29.4c15.6-15.6 15.6-40.9 0-56.6l-14.4-14.4zM311.9 321c-4.1 4.1-7 9.2-8.4 14.9l-15 60.1c-1.4 5.5 .2 11.2 4.2 15.2s9.7 5.6 15.2 4.2l60.1-15c5.6-1.4 10.8-4.3 14.9-8.4L512.1 262.7l-71-71L311.9 321z"/>
                                                    </svg>
                                                    {item.title}</h1>
                                                <p className='text-gray-400 text-sm flex items-center gap-2'>
                                                    <TextQuoteIcon width={10} height={10}/>
                                                    {item.desc}</p>
                                            </div>
                                        </div>

                                        <CardHeader className="py-2 px-4 flex items-center gap-4">
                                            <svg width={20} height={20} xmlns="http://www.w3.org/2000/svg"
                                                 viewBox="0 0 640 512">
                                                <path fill={theme === 'dark' ? 'white' : 'black'}
                                                      d="M160 64c0-35.3 28.7-64 64-64L576 0c35.3 0 64 28.7 64 64l0 288c0 35.3-28.7 64-64 64l-239.2 0c-11.8-25.5-29.9-47.5-52.4-64l99.6 0 0-32c0-17.7 14.3-32 32-32l64 0c17.7 0 32 14.3 32 32l0 32 64 0 0-288L224 64l0 49.1C205.2 102.2 183.3 96 160 96l0-32zm0 64a96 96 0 1 1 0 192 96 96 0 1 1 0-192zM133.3 352l53.3 0C260.3 352 320 411.7 320 485.3c0 14.7-11.9 26.7-26.7 26.7L26.7 512C11.9 512 0 500.1 0 485.3C0 411.7 59.7 352 133.3 352z"/>
                                            </svg>
                                            <div className="flex items-center gap-3 flex-wrap">
                                                {item.mentorIds.map((mentorId) => {
                                                    const mentor = getMentorInfo(users, mentorId);


                                                    return (
                                                        <div key={mentorId} className="flex items-center gap-2">

                                                            <Avatar className="h-8 w-8">
                                                                <AvatarImage className='object-cover' src={mentor.image}/>
                                                                <AvatarFallback>{mentor.initials}</AvatarFallback>
                                                            </Avatar>

                                                            <p className={`text-sm ${me.userId === mentorId && 'text-primary/90 font-semibold'}`}>{mentor.name}</p>

                                                        </div>
                                                    );
                                                })}
                                                <p className='text-gray-500 text-xs'>({item.mentorIds.length})</p>
                                            </div>
                                        </CardHeader>

                                        <CardHeader className="p-4 flex items-center gap-4">

                                            <svg width={20} height={20} xmlns="http://www.w3.org/2000/svg"
                                                 viewBox="0 0 640 512">
                                                <path fill={theme === 'dark' ? 'white' : 'black'}
                                                      d="M320 32c-8.1 0-16.1 1.4-23.7 4.1L15.8 137.4C6.3 140.9 0 149.9 0 160s6.3 19.1 15.8 22.6l57.9 20.9C57.3 229.3 48 259.8 48 291.9l0 28.1c0 28.4-10.8 57.7-22.3 80.8c-6.5 13-13.9 25.8-22.5 37.6C0 442.7-.9 448.3 .9 453.4s6 8.9 11.2 10.2l64 16c4.2 1.1 8.7 .3 12.4-2s6.3-6.1 7.1-10.4c8.6-42.8 4.3-81.2-2.1-108.7C90.3 344.3 86 329.8 80 316.5l0-24.6c0-30.2 10.2-58.7 27.9-81.5c12.9-15.5 29.6-28 49.2-35.7l157-61.7c8.2-3.2 17.5 .8 20.7 9s-.8 17.5-9 20.7l-157 61.7c-12.4 4.9-23.3 12.4-32.2 21.6l159.6 57.6c7.6 2.7 15.6 4.1 23.7 4.1s16.1-1.4 23.7-4.1L624.2 182.6c9.5-3.4 15.8-12.5 15.8-22.6s-6.3-19.1-15.8-22.6L343.7 36.1C336.1 33.4 328.1 32 320 32zM128 408c0 35.3 86 72 192 72s192-36.7 192-72L496.7 262.6 354.5 314c-11.1 4-22.8 6-34.5 6s-23.5-2-34.5-6L143.3 262.6 128 408z"/>
                                            </svg>
                                            <div className="flex items-center gap-3 flex-wrap">
                                                {item.studentIds.map((studentId) => {
                                                    const student = getStudentInfo(users, studentId);
                                                    const {image, initials, name} = getStudentDisplayInfo(student)

                                                    return (
                                                        <div key={studentId} className="flex items-center gap-2">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarImage className='object-cover' src={image}/>
                                                                <AvatarFallback>{initials}</AvatarFallback>
                                                            </Avatar>
                                                            <p className={`text-sm ${me.userId === studentId ||me._id === studentId   && 'text-primary/90 font-semibold'}`}>{name}</p>

                                                        </div>
                                                    );
                                                })}
                                                <p className='text-gray-500 text-xs'>({item.studentIds.length})</p>
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
                                        {me?.role === 'mentor' &&
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

                                                {item.status === 'completed' &&
                                                    <CommentDialog streamCallId={item.streamCallId} lesson={item}
                                                                   lessonId={item._id}/>}
                                                {item.status === 'succeeded' &&
                                                    <CommentDialog streamCallId={item.streamCallId} lesson={item}
                                                                   lessonId={item._id}/>}


                                            </CardFooter>}


                                    </Card>
                                )
                            })}
                            <button
                                onClick={() => setShowAllLessons(false)}
                                className="mb-1 w-full  text-sm text-muted-foreground hover:text-foreground"
                            >
                                Закрыть
                            </button>
                        </div>
                    </div>
                )}

                <div className="relative backdrop-blur-sm border border-border p-6">
                    <CornerElements/>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold tracking-tight">
                            {" "}
                            {me?.role === 'mentor' ? <span className="text-primary">Поставленные </span> :
                                <span className="text-primary">Мои </span>}
                            <span className="text-foreground"> оценки</span>
                        </h2>
                        <div className="font-mono text-xs text-muted-foreground">
                            Всего оценок: {displayedLessons.length}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">


                    </div>
                </div>

                {/* <div className="relative backdrop-blur-sm border border-border rounded-lg p-6">
                    <CornerElements/>
                    {displayedLessons.map((lesson) => {
                        const lessonMarks = allMarks.filter(
                            (mark) => mark.lessonId === lesson._id
                        );

                        return (
                            <div key={lesson._id}>
                                <h2>{lesson.title}</h2>
                                <p>{lesson.desc}</p>

                                {lessonMarks.map((mark) => (
                                    <div key={mark._id}>
                                        <p>{mark.text}</p>
                                        <p>
                                            {mark.studentId === me?.clerkId ? "Вы (студент)" : ""}
                                            {mark.mentorId === me?.clerkId ? "Вы (ментор)" : ""}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        );
                    })}


                </div> */}

                <div className="relative backdrop-blur-sm border border-border rounded-lg p-6">
                    <CornerElements/>
                    {lessonsToShow.reverse().map((item, index) => {
                        const startTime = new Date(item.startTime);

                        // Собираем все комментарии для этого урока

                        const lessonMarks = allMarks.filter((mark) => mark.lessonId === item._id);
                        const visibleLessonMarks = showAllMarks ? lessonMarks : lessonMarks.slice(-3);

                        // Предположим, что каждый комментарий может содержать поле rating (число от 1 до 5)
                        // Посчитаем средний рейтинг
                        const ratings = lessonMarks
                            .filter((c) => typeof c.rating === 'number')
                            .map((c) => c.rating);
                        const avgRating =
                            ratings.length > 0
                                ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
                                : null;

                        return (
                            <div className='mb-8'>
                                <div className='pb-6 flex items-center gap-2'>
                                    <BookMarkedIcon/>
                                    <h1 className='font-semibold text-xl'>{item.title}</h1>
                                </div>
                                <Card className=" px-4 py-6 flex items-center gap-4">


                                    <div className="flex flex-col gap-12 w-full">

                                        {me?.role === 'mentor' ? (
                                            <div className="flex flex-col gap-6 w-full">
                                                {visibleLessonMarks.map((mark) => {
                                                    const studentId = mark.studentId;
                                                    const student = getStudentInfo(users, studentId);
                                                    const {image, initials, name} = getStudentDisplayInfo(student);

                                                    // Находим оценку для этого студента по этому уроку
                                                    const studentMark = allMarks.find(
                                                        (mark) => mark.lessonId === item._id && mark.studentId === studentId
                                                    );


                                                    return (
                                                        <div key={studentId}
                                                             className="flex items-center gap-2  justify-between relative">

                                                            <div className="flex items-center gap-2">
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarImage className='object-cover' src={image}/>
                                                                    <AvatarFallback>{initials}</AvatarFallback>
                                                                </Avatar>
                                                                <p className={`text-sm ${me.userId === studentId || me._id === studentId  && 'text-primary/90 font-semibold'}`}>
                                                                    {name}
                                                                </p>
                                                            </div>
                                                            {studentMark?.rating ? (
                                                                <div className='flex items-center justify-center gap-4'>


                                                                    <p className="text-yellow-500 font-semibold text-lg flex items-center gap-1">
                                                                        ⭐ {studentMark.rating} / 5
                                                                    </p>

                                                                    <RemarkModal me={me} studentMarkId={studentMark._id}
                                                                                 initialRating={studentMark.rating}
                                                                                 initialComment={studentMark.content}/>

                                                            {me?.role === 'mentor' && (
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <Trash2Icon className="cursor-pointer text-muted-foreground"/>

                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                Это действие удалит оценку навсегда. Вы не сможете отменить его.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                onClick={() => {
                                                                                    deleteComment({ commentId: studentMark._id, mentorId: me.userId });
                                                                                    toast.success("Оценка успешно удалена!");
                                                                                }}
                                                                            >
                                                                                Удалить
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>
                                                            )}
                                                                </div>
                                                            ) : <div className='text-muted-foreground text-sm'>У ученика пока нету оценок</div>}
                                                        </div>
                                                    );
                                                })}
                                                {lessonMarks.length > 3 && (
                                                    <div className="flex justify-center mt-4">
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => setShowAllMarks((prev) => !prev)}
                                                        >
                                                            {showAllMarks ? 'Скрыть оценки' : 'Показать ещё'}
                                                        </Button>
                                                    </div>
                                                )}

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

                                                    {item.status === 'completed' &&
                                                        <CommentDialog streamCallId={item.streamCallId} lesson={item}
                                                                       lessonId={item._id}/>}
                                                    {item.status === 'succeeded' &&
                                                        <CommentDialog streamCallId={item.streamCallId} lesson={item}
                                                                       lessonId={item._id}/>}


                                                </CardFooter>
                                            </div>
                                        ) : (
                                            // Если это студент - показываем только его оценку если есть
                                            (() => {
                                                const studentMark = allMarks.find(
                                                    (mark) => mark.lessonId === item._id && mark.studentId === me._id || mark.studentId === me.userId
                                                );

                                                if (!studentMark) return <div
                                                    className={'flex gap-4 py-4 flex-col items-center justify-center text-center'}>
                                                    <BookMarkedIcon width={40} height={40}/>
                                                    <h1 className={'text-2xl font-semibold'}>У вас пока нету оценок</h1>
                                                </div>

                                                const student = getStudentInfo(users, me._id);
                                                const {image, initials, name} = getStudentDisplayInfo(student);

                                                return (
                                                    <DisplayMarkInfo studentMark={studentMark} lesson={item}
                                                                     rating={studentMark.rating}
                                                                     comment={studentMark.content}>
                                                        <div className="flex items-center gap-2 justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarImage className='object-cover' src={image}/>
                                                                    <AvatarFallback>{initials}</AvatarFallback>
                                                                </Avatar>
                                                                <p className="text-sm font-semibold text-primary/90">{name}</p>
                                                            </div>
                                                            <p className="text-yellow-500 text-xs flex items-center gap-1">
                                                                ⭐ {studentMark.rating} / 5
                                                            </p>
                                                        </div>
                                                    </DisplayMarkInfo>
                                                );
                                            })()
                                        )}

                                    </div>

                                </Card>


                            </div>
                        );
                    })}
                    {displayedLessons.length > 3 && (
                        <button
                            onClick={() => setShowAllLessons(true)}
                            className="mt-4 w-full px-4 py-2 bg-primary text-white rounded"
                        >
                            Показать еще
                        </button>
                    )}
                </div>

                <div className="relative backdrop-blur-sm border border-border p-6">
                    <CornerElements/>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold tracking-tight">
                            {" "}

                            <span className="text-primary">Домашние </span>
                            <span className="text-foreground"> задания</span>

                        </h2>
                        <div className="font-mono text-xs text-muted-foreground">
                            Всего уроков: {displayedLessons.length}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                    </div>
                </div>
                <div className="relative backdrop-blur-sm border border-border rounded-lg p-6">
                    <CornerElements/>
                    {displayedLessons.map((item, index) => {

                        const mentorId = item.mentorIds[0];
                        const mentor = users.find((user) => user._id === mentorId || user.userId === mentorId);


                        const handleDeleteHomework = async () => {
                            try {
                                await deleteHomeworkMutation({ lessonId: item._id, userId: me?.userId });

                                toast.success("Домашнее задание удалено");
                            } catch (e) {
                                toast.error("Ошибка при удалении домашнего задания");
                                console.error(e);
                            }
                        };



                        if (item.homework && !hiddenLessonIds.has(item._id) ) {
                            return (
                                    <Card className=" p-4 mb-8 relative rounded-lg border border-slate-200 shadow-sm">
                                        <div className="flex flex-col gap-2">
                                            <div className="text-md font-semibold flex items-center gap-2 ">
                                                <h1 className='text-primary'>Урок:</h1>

                                                <div>{item.title}</div>
                                            </div>
                                            <div className="text-md font-semibold flex items-center gap-2 ">
                                                <h1 className='text-primary'>Учитель:</h1>



                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage className='object-cover' src={mentor?.image}/>
                                                        <AvatarFallback>{mentor?.name.charAt(0).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <p className="text-sm font-semibold ">{mentor?.name ?? 'Нет данных'}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground whitespace-pre-wrap flex items-center gap-4">
                                                <h1 className='font-semibold text-primary  text-sm'>
                                                    Задание:
                                                </h1>
                                                {item?.homework.content}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Создано: {new Date(item?.homework.createdAt).toLocaleString()}
                                            </p>

                                            {item?.homework.files && item?.homework.files.length > 0 && (
                                                <div className="flex flex-col gap-1 mt-2">
                                                    <p className="text-xs font-medium">Файлы:</p>
                                                    {item?.homework.files.map((fileUrl, idx) => (
                                                        <a
                                                            href={fileUrl}
                                                            key={idx}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs text-blue-500 underline"
                                                        >
                                                            📁 Файл {idx + 1}
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </div>


                                        {me?.role === 'mentor' ?
                                            <div className=' cursor-pointer absolute top-6 right-6'>

                                                <Dialog>
                                                    <DialogTrigger><XCircleIcon /></DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader className='py-4'>
                                                            <DialogTitle>Вы уверены что хотите удалить домашнюю работу?</DialogTitle>
                                                            <DialogDescription className={'py-2'}>
                                                                Вы не сможете потом снова увидеть эту домашнюю работу!
                                                            </DialogDescription>
                                                            <Button className='mt-[40px]' onClick={handleDeleteHomework}>Удалить домашнюю работу</Button>
                                                        </DialogHeader>
                                                    </DialogContent>
                                                </Dialog>
                                                        </div>

                                            : <div className=' cursor-pointer absolute top-6 right-6'>
                                                <Dialog>
                                                    <DialogTrigger><XCircleIcon  title={'Скрать домашнюю работу'}/></DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader className='py-4'>
                                                            <DialogTitle>Вы уверены что хотите скрыть домашнюю работу?</DialogTitle>
                                                            <DialogDescription className={'py-2'}>
                                                                Вы не сможете потом снова увидеть эту домашнюю работу!
                                                            </DialogDescription>
                                                            <Button className='mt-[40px]' onClick={async () => {
                                                                // скрываем домашку
                                                                await hideHomework({ lessonId: item._id, userId: me.userId });

                                                                hiddenLessonIds.add(item._id);
                                                                setDisplayedLessons([...displayedLessons]);
                                                            }}>Скрыть домашнюю работу</Button>
                                                        </DialogHeader>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>}

                                    </Card>
                            )
                        }


                    })}
                </div>
            </div>
        ) : (
            <NoFitnessPlan customer={me}/>
        )}
      </section>
      </div>
  );
};

export default ProfilePage;
