'use client'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronRight,
  Dumbbell,
  Sparkles,
  Users,
  Clock,
  AppleIcon,
  ShieldIcon,
  PhoneCallIcon,
  GroupIcon,
  CalendarIcon,
  CameraIcon,
  CheckIcon,
  XCircleIcon,
  WorkflowIcon,
  StarIcon,
  MessageSquareIcon, MessageCircleIcon,
} from "lucide-react";
import { USER_PROGRAMS } from "@/constants";
import {useUserRole} from "@/components/hooks/useUserRole";
import ActionCard from "@/components/ActionCard";
import {mentorNavigation} from "@/components/hooks";
import {studentNavigation} from "@/components/hooks";
import {useMutation, useQuery} from "convex/react";
import {api} from "../../convex/_generated/api";
import React, {useState, useEffect, useRef} from "react";
import {useRouter} from "next/navigation";
import LessonModal from "@/components/LessonModal";
import Image from "next/image";
import messagePng from '../app/message_png.png'
import messagePngDark from '../app/message_png-dark.png'
import {useTheme} from "next-themes";

import {useUser} from "@clerk/nextjs";
import {YourStats} from "@/components/YourStats";
import LoaderUI from "@/components/LoaderUI";
import {getStatsForUser} from "../../convex/stats";
import CornerElements from "@/components/CornerElements";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {createReview} from "../../convex/reviews";
import toast from "react-hot-toast";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {format} from "date-fns";
import {ru} from "date-fns/locale";
import {useAuth} from "@/providers/authContext";


const UserPrograms = () => {
  const {isMentor, isStudent} = useUserRole()

  const [showModal, setShowModal] = useState(false)

  const [modalType, setModalType] = useState<"start" | "join">()
  const router = useRouter()
  const {theme} = useTheme()
  const {user} = useAuth()

  const users = useQuery(api.users.getUsers) ?? []

  const me = users?.find((u) => u._id === user?.id || u.userId === user?.user_id)
  const lessons = useQuery(api.lessons.getMyLessons, {userId: me?.userId}) ?? []
  const mentors = users.filter((u) => u?.role === 'mentor') ?? []
  const students = users.filter((u) => u?.role === 'student') ?? []
  const clerkMentorIds = mentors.map((m) => m.userId);
  const clerkStudentIds = students.map((s) => s.userId)

  const mentorStats = useQuery(api.stats.getStatsForMentorsBatch, { clerkIds: clerkMentorIds });

  const studentStats = useQuery(api.stats.getStatsForStudentsBatch, { clerkIds: clerkStudentIds })


  console.log(me)

  useEffect(() => {
    if (!me || lessons.length === 0) return;

    const myLessons = lessons.filter((lesson) =>
        lesson.studentIds.includes(me._id) || lesson.mentorIds.includes(me._id)
    );

    setDisplayedLessons(myLessons);
  }, [me, lessons]);
  const stats = useQuery(api.stats.getStatsForUser, { clerkId: me?.userId });
  console.log(stats)


  console.log(me?.userId)
  const data = [stats];

  const handleQuickAction = (title: string) => {
    switch (title) {
      case "Новый звонок":
        setModalType("start");
        setShowModal(true);
        break;
      case "Присоедениться к уроку":
        setModalType("join");
        setShowModal(true);
        break;
      default:
        router.push(`/${title.toLowerCase()}`);
    }
  };

  const [displayedLessons, setDisplayedLessons] = useState([])













  const rusStats = [
    { 'Уроков посещено': stats?.lessonsAttended, 'За неделю':stats?.lessonsAttended, 'Средний балл': stats?.averageRating}
  ]

  const [reviewText, setReviewText] = useState<string>()
  const [stars, setStars] = useState<number>(3)
  const reviews = useQuery(api.reviews.getAllReviews)

  const createReview = useMutation(api.reviews.createReview)


  const renderStars = (rating: number) => (
      <div className='flex gap-0.5'>
        {[0,2, 3, 4,5 ].map((val) => (
            <StarIcon key={val} className={`w-4 h-4 ${val <= rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`}/>
        ))}
      </div>
  )

  const handleSubmit = async (e) => {
      try {
          e.preventDefault()
          if (!reviewText.trim()) return toast.error('Напиши ваш отзыв о нас')

        if (reviewText.trim().length > 80 ) {
          return  toast.error('Слишком длинный текст')
        }
        if (reviewText.trim().length < 5 ) {
          return  toast.error('Слишком короткий текст')
        }


        await createReview({authorId: me?.userId, text: reviewText, stars: Number(stars)})

        setReviewText('')
        setStars(3)
      } catch (error) {
        toast.error('Не удалось оставить отзыв!')
      }
  }
  const sliderRef = useRef(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  useEffect(() => {
    setShouldAnimate(reviews?.length > 3);
  }, [reviews?.length]);



  // Дублируем отзывы для бесконечной прокрутки
  const displayedReviews = shouldAnimate ? [...reviews, ...reviews] : reviews;
  return (
    <div className="w-full pb-24 pt-16 relative">
      <div className="container mx-auto max-w-6xl px-4">
        {/* HEADER- PROGRAM GALLERY */}
        <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg overflow-hidden mb-16">
          {/* HEADER BAR */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-background/70">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
              <span className="text-sm text-primary font-medium">Навигация</span>
            </div>
            <div className="text-sm text-muted-foreground">edu navigation</div>
          </div>

          {/* HEADER CONTENT */}
          {me?.role === 'mentor' ? (<div className="p-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-foreground">Educatify</span>

            </h2>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
              Получите <span className='text-primary'>возможность</span> развивать свой образовательный бизнес
            </p>


            <div className=" flex-col  flex lg:flex-row items-center justify-center gap-16 mt-10 font-mono ">
              {mentorNavigation.map((action, index) => (
                  <ActionCard onClick={() => handleQuickAction(action.title)} action={action} key={index}/>

              ))}
            </div>

            <LessonModal isJoinLesson={modalType === 'join'} isOpen={showModal} onClose={() => setShowModal(false)}
                         title={modalType === 'join' ? 'Присоединиться к уроку' : 'Новый звонок'}/>
          </div>) : (<div className="p-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-foreground">Educatify</span>

            </h2>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
              Получите <span className='text-primary'>возможность</span> узнать ваши будущие уроки и многое другое
            </p>


            <div className=" flex-col  flex lg:flex-row items-center justify-center gap-16 mt-10 font-mono ">
              {studentNavigation.map((action, index) => (
                  <ActionCard onClick={() => handleQuickAction(action.title)} action={action} key={index}/>

              ))}
            </div>

            <LessonModal isJoinLesson={modalType === 'join'} isOpen={showModal} onClose={() => setShowModal(false)}
                         title={modalType === 'join' ? 'Присоединиться к уроку' : 'Новый звонок'}/>
          </div>)}

        </div>

        <div className='mt-20 flex  items-center flex-col-reverse md:flex-row-reverse justify-between'>
          <div className='my-10 '>
            {theme === 'dark' || theme === 'system' ?
                <Image className='rounded-xl' id='animate-grow' src={messagePngDark} width={700} height={700}/> :
                <Image className='rounded-xl' id='animate-grow' src={messagePng} width={700} height={700}/>}

          </div>
          <div>
            <h1 className='text-4xl text-left'>Свяжитесь с вашими преподавателями на <p className='text-primary font-semibold
            '>educatify chats</p></h1>
          </div>

        </div>
        <Button onClick={() => router.push('/chats')} className='mb-[200px]  py-6 px-4'>Перейти
          на <b>educatify-chats</b></Button>


        <div className='flex flex-col-reverse gap-[200px] justify-center items-center'>

          <div className='w-full flex flex-col md:flex-row items-center justify-between '>

            <MessageCircleIcon id='animate-grow' className='text-primary  w-[400px] h-[400px]'/>
            <div className='flex items-center  flex-col-reverse gap-4'>
              <form onSubmit={handleSubmit} className="mb-6 min-w-[400px] flex flex-col gap-2 max-w-md">


                <Select value={stars} onValueChange={setStars}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выбрать оценку"/>
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((value) => (
                        <SelectItem key={value} value={value.toString()}>
                          <div className="flex items-center gap-2">{renderStars(value)}</div>
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Ваш отзыв"
                    className="p-2 border border-border rounded resize-none"
                    rows={4}
                />
                <button type="submit" className="bg-primary text-white py-2 rounded">
                  Отправить отзыв
                </button>
              </form>
              <h2 className="text-2xl mb-6 mt-20 font-semibold ">Напишите <span
                  className='font-semibold text-primary'>отзыв</span> для нас</h2>
            </div>
          </div>

          {reviews?.length !== 0 && <div className='flex flex-col-reverse  '>
            <div className="overflow-hidden py-4 relative">
              <div
                  ref={sliderRef}
                  className={`flex gap-6 min-w-max px-4 ${
                      shouldAnimate ? "animate-scrollLeft" : ""
                  }`}
                  style={{willChange: "transform"}}
              >
                {displayedReviews?.map((review, idx) => {
                  const author = users.find((u) => u.userId === review.authorId || u._id === review.authorId);

                  return (
                      <div
                          key={review._id.toString() + idx}
                          className="min-w-[400px] hover:scale-105 transition-all cursor-pointer hover:border-primary gap-4 max-w-xs p-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg flex justify-start flex-col"
                      >
                        <div className="text-muted-foreground text-sm w-full flex-col flex justify-center items-start">
                          <div className="flex items-center justify-end w-full">
                            {format(review._creationTime, "MMM d, yyyy • h:mm ", {
                              locale: ru,
                            })}
                          </div>
                          <div className="flex items-center justify-start gap-2">
                            <Avatar className='flex items-center justify-center'>
                             <AvatarImage className='object-cover' src={author?.image}/>
                              <AvatarFallback>{author?.name.charAt(0).toUpperCase()}</AvatarFallback>

                            </Avatar>
                            <div className="font-semibold text-primary">{author?.name}</div>
                            <div className='text-muted-foreground font-semibold text-lg'>·

                            </div>
                            <div className='text-muted-foreground text-xs flex items-center justify-center'>
                              {author?.role === 'mentor' ? " Преподователь" : ' Ученик'}
                            </div>
                          </div>
                        </div>

                        {renderStars(review.stars)}
                        <p className="text-sm text-muted-foreground flex-1">{review.text}</p>
                      </div>
                  );
                })}
              </div>

              {/* CSS-анимацию */}
              <style jsx>{`
        @keyframes scrollLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scrollLeft {
          animation: scrollLeft 30s linear infinite;
        }
      `}</style>
            </div>

            <h2 className="text-2xl mb-6 w-full font-semibold flex justify-center items-center gap-2 ">
              <MessageCircleIcon  className='text-primary'/>
              Наши <span
                className='font-semibold text-primary'>отзывы</span>
              <p className='text-muted-foreground text-sm'>({reviews?.length})</p>
            </h2>
          </div>}


        </div>


        {/* Program cards */}

        {me?.role !== 'mentor' ? <>
          <div className='w-full gap-4 flex text-center items-center justify-center mt-[200px] my-10'>
            <h1 className='font-semibold text-2xl'>Наши преподаватели</h1>
            <svg width={40} height={40} xmlns="http://www.w3.org/2000/svg"
                 viewBox="0 0 640 512">
              <path fill='red'
                    d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z"/>
            </svg>
          </div>
          {mentors.length === 0 &&
              <div className='text-center font-semibold flex items-center justify-center w-full'><h1>упс.. походу тут
                ничего нет</h1></div>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">


            {mentors.slice(0, 3).map((mentor) => {

              if (mentor.userId === me.userId) return null

              const mentorStat = mentorStats?.find((m) => mentor.userId === m.clerkId)

              // const stats = mentorStats?.find((s) => s.clerkId === mentor.clerkId);
              //  console.log(stats)
              // const mentorStat = mentorStatsMap[mentor.clerkId]
              //  console.log(mentorStat)
              return (
                  <Card
                      key={mentor._id}
                      className="bg-card/90 backdrop-blur-sm border border-border hover:border-primary/50 transition-colors overflow-hidden"
                  >
                    {/* Card header with user info */}
                    <div
                        className="flex items-center justify-between px-5 py-2 border-b border-border bg-background/70">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="text-sm text-primary">USER. {mentor._id}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">

                      </div>
                    </div>

                    <CardHeader className="pt-6 px-5">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-11 w-11 rounded-full overflow-hidden border border-border">
                            <Avatar>
                              <AvatarImage width={44} height={44}
                                           src={mentor.image}
                                           alt={`${mentor.name}`}
                                           className="rounded-full object-cover"
                              />
                              <AvatarFallback>{mentor.name.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>

                        </div>
                        <div>
                          <CardTitle className="text-lg text-foreground">
                            {mentor.name}

                          </CardTitle>
                          <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <Users className="h-4 w-4"/>
                            {mentor.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-primary/10 flex items-center gap-2 text-primary mt-0.5">
                          <svg width={18} height={18} xmlns="http://www.w3.org/2000/svg"
                               viewBox="0 0 640 512">
                            <path fill={'red'}
                                  d="M160 64c0-35.3 28.7-64 64-64L576 0c35.3 0 64 28.7 64 64l0 288c0 35.3-28.7 64-64 64l-239.2 0c-11.8-25.5-29.9-47.5-52.4-64l99.6 0 0-32c0-17.7 14.3-32 32-32l64 0c17.7 0 32 14.3 32 32l0 32 64 0 0-288L224 64l0 49.1C205.2 102.2 183.3 96 160 96l0-32zm0 64a96 96 0 1 1 0 192 96 96 0 1 1 0-192zM133.3 352l53.3 0C260.3 352 320 411.7 320 485.3c0 14.7-11.9 26.7-26.7 26.7L26.7 512C11.9 512 0 500.1 0 485.3C0 411.7 59.7 352 133.3 352z"/>
                          </svg>
                          {mentorStat?.lessonsConducted}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-center items-center">
                            <h3 className="font-medium flex items-center  text-foreground">
                              Уроков проведено
                            </h3>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">

                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="px-5">
                      {/* Program details */}
                      <div className="space-y-5 pt-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-md bg-primary/10 flex items-center gap-2 text-primary mt-0.5">
                            <svg width={18} height={18} xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 640 512">
                              <path fill='red'
                                    d="M72 88a56 56 0 1 1 112 0A56 56 0 1 1 72 88zM64 245.7C54 256.9 48 271.8 48 288s6 31.1 16 42.3l0-84.7zm144.4-49.3C178.7 222.7 160 261.2 160 304c0 34.3 12 65.8 32 90.5l0 21.5c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32l0-26.8C26.2 371.2 0 332.7 0 288c0-61.9 50.1-112 112-112l32 0c24 0 46.2 7.5 64.4 20.3zM448 416l0-21.5c20-24.7 32-56.2 32-90.5c0-42.8-18.7-81.3-48.4-107.7C449.8 183.5 472 176 496 176l32 0c61.9 0 112 50.1 112 112c0 44.7-26.2 83.2-64 101.2l0 26.8c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32zm8-328a56 56 0 1 1 112 0A56 56 0 1 1 456 88zM576 245.7l0 84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM320 32a64 64 0 1 1 0 128 64 64 0 1 1 0-128zM240 304c0 16.2 6 31 16 42.3l0-84.7c-10 11.3-16 26.1-16 42.3zm144-42.3l0 84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM448 304c0 44.7-26.2 83.2-64 101.2l0 42.8c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32l0-42.8c-37.8-18-64-56.5-64-101.2c0-61.9 50.1-112 112-112l32 0c61.9 0 112 50.1 112 112z"/>
                            </svg>
                            {mentorStat?.totalStudents}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-center items-center">
                              <h3 className="font-medium flex items-center  text-foreground">
                                Всего учеников
                              </h3>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">

                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-md bg-primary/10 flex items-center gap-2 text-primary mt-0.5">
                            <CheckIcon width={18} height={18} className='text-primary'/>

                          </div>
                          <div className="flex-1">
                            <div className="flex justify-center items-center">
                              <h3 className="text-foreground/40 flex items-center text-sm   text-foreground">
                                Квалифицированный учитель
                              </h3>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">

                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-md bg-primary/10 text-primary mt-0.5">
                            <ShieldIcon className="h-5 w-5"/>
                          </div>
                          <div className="flex-1">
                            <div className="flex text-center justify-center items-center">
                              <h3 className="font-medium text-foreground flex items-center gap-2">Под защитой <p
                                  className='text-primary'>eduPro</p></h3>
                            </div>
                            <p className="text-sm text-center text-muted-foreground mt-1">
                              Имеется лицензия ИИ
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Program description */}
                      <div className="mt-5 pt-5 border-t border-border">
                        <div className="text-sm flex items-center relative justify-center text-muted-foreground">
                          <span className="text-primary absolute left-2">&gt; </span>
                          Присоединился: {new Date(mentor._creationTime).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="px-5 py-4 border-t border-border">
                      <Link href={`/profile/${mentor._id}`} className="w-full">
                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                          Посмотреть профиль
                          <ChevronRight className="ml-2 h-4 w-4"/>
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
              )
            })}

          </div>
        </> : (
            <>
              <div className='w-full gap-4 flex text-center items-center justify-center my-10'>
                <h1 className='font-semibold text-2xl'>Наши ученики</h1>
                <svg width={40} height={40} xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 640 512">
                  <path fill='red'
                        d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z"/>
                </svg>
              </div>
              {students.length === 0 &&
                  <div className='text-center font-semibold flex items-center justify-center w-full'><h1>упс.. походу
                    тут ничего нет</h1></div>}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">


                {students.slice(0, 6).map((student) => {

                  if (student.userId === me.userId) return null

                  const studentStat = studentStats?.find((s) => student.userId === s.clerkId)

                  // const stats = mentorStats?.find((s) => s.clerkId === mentor.clerkId);
                  //  console.log(stats)
                  // const mentorStat = mentorStatsMap[mentor.clerkId]
                  //  console.log(mentorStat)
                  return (
                      <Card
                          key={student._id}
                          className="bg-card/90 backdrop-blur-sm border border-border hover:border-primary/50 transition-colors overflow-hidden"
                      >
                        {/* Card header with user info */}
                        <div
                            className="flex items-center justify-between px-5 py-2 border-b border-border bg-background/70">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <span className="text-sm text-primary">USER. {student._id}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">

                          </div>
                        </div>

                        <CardHeader className="pt-6 px-5">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="h-11 w-11 rounded-full overflow-hidden border border-border">

                              <Avatar>
                                {student.image ? <Image width={44} height={44}
                                                           src={student.image}
                                                           alt={`${student.name}`}
                                                           className="rounded-full object-cover"
                                /> :  <AvatarFallback>{student.name.charAt(0).toUpperCase()}</AvatarFallback>}


                              </Avatar>
                            </div>
                            <div>
                              <CardTitle className="text-lg text-foreground">
                                {student.name}

                              </CardTitle>
                              <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <Users className="h-4 w-4"/>
                                {student.email}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-md bg-primary/10 flex items-center gap-2 text-primary mt-0.5">
                              <svg width={18} height={18} xmlns="http://www.w3.org/2000/svg"
                                   viewBox="0 0 640 512">
                                <path fill={'red'}
                                      d="M160 64c0-35.3 28.7-64 64-64L576 0c35.3 0 64 28.7 64 64l0 288c0 35.3-28.7 64-64 64l-239.2 0c-11.8-25.5-29.9-47.5-52.4-64l99.6 0 0-32c0-17.7 14.3-32 32-32l64 0c17.7 0 32 14.3 32 32l0 32 64 0 0-288L224 64l0 49.1C205.2 102.2 183.3 96 160 96l0-32zm0 64a96 96 0 1 1 0 192 96 96 0 1 1 0-192zM133.3 352l53.3 0C260.3 352 320 411.7 320 485.3c0 14.7-11.9 26.7-26.7 26.7L26.7 512C11.9 512 0 500.1 0 485.3C0 411.7 59.7 352 133.3 352z"/>
                              </svg>
                              {studentStat?.lessonsAttended}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-center items-center">
                                <h3 className="font-medium flex items-center  text-foreground">
                                  Уроков посещено
                                </h3>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">

                              </p>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="px-5">
                          {/* Program details */}
                          <div className="space-y-5 pt-2">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-md bg-primary/10 flex items-center gap-2 text-primary mt-0.5">
                                <WorkflowIcon className='text-primary' size={20}/>
                                {studentStat?.lessonsLastWeek}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-center items-center">
                                  <h3 className="font-medium flex items-center  text-foreground">
                                    За неделю
                                  </h3>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">

                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-md bg-primary/10 flex items-center gap-2 text-primary mt-0.5">
                                <Sparkles width={18} height={18} className='text-primary'/>
                                {studentStat?.averageRating}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-center items-center">
                                  <h3 className="text-foreground/40 flex items-center text-sm   text-foreground">
                                    Средняя оценка
                                  </h3>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">

                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-md bg-primary/10 text-primary mt-0.5">
                                <ShieldIcon className="h-5 w-5"/>
                              </div>
                              <div className="flex-1">
                                <div className="flex text-center justify-center items-center">
                                  <h3 className="font-medium text-foreground flex items-center gap-2">Под защитой <p
                                      className='text-primary'>eduPro</p></h3>
                                </div>
                                <p className="text-sm text-center text-muted-foreground mt-1">
                                  Имеется лицензия ИИ
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Program description */}
                          <div className="mt-5 pt-5 border-t border-border">
                            <div className="text-sm flex items-center relative justify-center text-muted-foreground">
                              <span className="text-primary absolute left-2">&gt; </span>
                              Присоединился: {new Date(student._creationTime).toLocaleDateString('ru-RU', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="px-5 py-4 border-t border-border">
                          <Link href={`/profile/${student._id}`} className="w-full">
                            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                              Посмотреть профиль
                              <ChevronRight className="ml-2 h-4 w-4"/>
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                  )
                })}

              </div>
            </>)}


        {stats && (
            <div className='w-full mt-20 flex items-center  flex-col gap-6'>
              <div className='flex items-center gap-6 flex-row-reverse'>
                <svg width={40} height={40} xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 448 512">
                  <path fill='red'
                        d="M160 80c0-26.5 21.5-48 48-48l32 0c26.5 0 48 21.5 48 48l0 352c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48l0-352zM0 272c0-26.5 21.5-48 48-48l32 0c26.5 0 48 21.5 48 48l0 160c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48L0 272zM368 96l32 0c26.5 0 48 21.5 48 48l0 288c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48z"/>
                </svg>
                <h1 className='text-2xl'>Ваша статистика</h1>
              </div>
              {me?.role === 'mentor' ? <YourStats
                  stats={{
                    totalLessons: stats.lessonsConducted,
                    totalStudents: stats.totalStudents,
                    totalCalls: stats.lessonsConducted,
                    totalHours: stats.totalHours,
                  }}
              /> : <div className="p-4 rounded-2xl  shadow-md">

                <ResponsiveContainer width={600}  height={300}>
                  <BarChart barCategoryGap={30} barSize={70} barGap={20} data={rusStats}
                            margin={{top: 20, right: 50, left: 0, bottom: 5}}>
                    <CartesianGrid width={400} strokeDasharray="3 3"/>
                    <XAxis dataKey={`${me?.role === 'mentor' ? 'mentor' : 'student'}`}/>
                    <YAxis/>
                    <Tooltip/>
                    <Legend/>
                    <Bar dataKey="Уроков посещено" fill="#970101"/>
                    <Bar dataKey="За неделю" fill="#ff0000"/>
                    <Bar dataKey="Средний балл" fill="#ff5d5d"/>
                  </BarChart>
                </ResponsiveContainer>
              </div>}

            </div>
        )}


        {/* CTA section */}
        {me?.role === 'mentor' ? <div className="mt-16 text-center">

          <Link href="/schedule">
            <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg"
            >
              Начни новый урок
              <Sparkles className="ml-2 h-5 w-5"/>
            </Button>
          </Link>
          <p className="text-muted-foreground mt-4">
            Развивай свою преподовательскую карьеру с помощью <span className='text-primary'>educatify</span>
          </p>
        </div> : <div className="mt-16 text-center">

          <Link href="/">
            <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg"
            >
              Присоединиться к уроку
              <Sparkles className="ml-2 h-5 w-5"/>
            </Button>
          </Link>
          <p className="text-muted-foreground mt-4">
            Достигай успехов в учёбе с помощью <span className='text-primary'>educatify</span>
          </p>
        </div>}

      </div>
    </div>
  );
};

export default UserPrograms;
