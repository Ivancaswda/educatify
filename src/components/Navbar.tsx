"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import {
  DumbbellIcon,
  HomeIcon,
  UserIcon,
  ZapIcon,
  List,
  ArrowBigLeftDashIcon,
  ArrowBigRightDashIcon
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import {ModeToggle} from "@/components/ModeToggle";
import educatifyLogo from '../app/educatify.png'
import whiteEducatifyLogo from '../app/white-educatify.png'
import Image from "next/image";
import {useUserRole} from "@/components/hooks/useUserRole";
import {useTheme} from "next-themes";
import {useEffect, useState} from "react";
import {NotificationDialog} from "@/components/NotificationDialog";
import {useQuery} from "convex/react";
import {api} from "../../convex/_generated/api";
import { useUnreadMessages} from "@/components/hooks/useUnreadMessages";
import {useChatContext} from "stream-chat-react";
import {usePathname} from "next/navigation";
import {useAuth} from "@/providers/authContext";
import {useRouter} from "next/navigation";

const Navbar = () => {
  const router = useRouter()
  const {logout} = useAuth()

  const { client } = useChatContext();
  const {theme} = useTheme()
  const {isMentor, isStudent} = useUserRole()
  const [sidebarVis, setSidebarVis] = useState(false)
  const users = useQuery(api.users.getUsers)

  console.log(users)

  const [displayedLessons, setDisplayedLessons] = useState([])
  const {user} = useAuth()
  const lessons = useQuery(api.lessons.getAllLessons) ?? []
  console.log(user)
  const me = users?.find((u) => u._id === user?.id)  ?? users?.find((u) => u.userId === user?.user_id)

  useEffect(() => {
    if (!me || lessons.length === 0) return;

    const myLessons = lessons.filter((lesson) =>
        lesson.studentIds.includes(me.userId) || lesson.mentorIds.includes(me.userId)
    );

  }, [me, lessons]);
  const {unreadCount, unreadMessages, setUnreadCount, setUnreadMessages, refresh, clearUnreadMessages} = useUnreadMessages()


  console.log(unreadMessages)

  const pathname = usePathname()
  let buttonHref = "/schedule";
  let buttonText = isMentor ? "Начать урок" : "Мои уроки";

  if (pathname === "/blog") {
    buttonHref = "/myBlogs";
    buttonText = "Мои посты";
  } else if (pathname === "/myBlogs") {
    buttonHref = "/blog";
    buttonText = "Все посты";
  } else if (pathname === '/profile') {
    buttonHref = "/blog";
    buttonText = "Все посты";
  }
  return (
    <header className="     fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-md border-b border-border py-3">
      <div className="container  w-[100%]  mx-auto flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <div className="p-1 bg-primary/10 rounded">
            {theme === 'dark' || theme === 'system' ?
                <Image alt='edu-logo ' src={educatifyLogo} className="w-12 h-12 text-primary "/> :
                <Image alt='edu-logo' src={whiteEducatifyLogo} className="w-12 h-12 text-primary"/>}

          </div>
          <span className=" hidden lg:block text-xl font-bold font-mono">
            <span className="text-primary">edu</span>cati<span className="text-primary">fy</span>
          </span>
        </Link>

        <nav className='hidden md:flex gap-4'>
          <Link
              href="/"
              className="hidden lg:flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
          >
            <HomeIcon size={16}/>
            <span>Главная страница</span>
          </Link>

          <Link
              href="/schedule"
              className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
          >
            <DumbbellIcon size={16}/>
            <span>Уроки</span>
          </Link>
          {isMentor && <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
          >
            <DumbbellIcon size={16}/>
            <span>Панель управления</span>
          </Link>}

          <NotificationDialog clearUnreadMessages={clearUnreadMessages} refresh={refresh} unreadCount={unreadCount} unreadMessages={unreadMessages} setUnreadCount={setUnreadCount} setUnreadMessages={setUnreadMessages}/>

          <Link
              href="/profile"
              className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
          >
            <UserIcon size={16}/>
            <span>Профиль</span>
          </Link>


          <Button
              asChild
              variant="outline"
              className="ml-2 border-primary/50 text-primary hover:text-white hover:bg-primary/10"
          >
            <Link href={buttonHref}>{buttonText}</Link>

          </Button>
          {/* <UserButton/> */}
          <Link href='/sign-in'>
            <Button  onClick={logout}>
              Выйти
              <ArrowBigRightDashIcon/>
            </Button>
          </Link>

          <ModeToggle/>
        </nav>
        {/* NAVIGATION */}
        {pathname !== '/profile' && <div className='md:hidden block z-20 right-[20%] absolute'>
          <NotificationDialog unreadCount={unreadCount} unreadMessages={unreadMessages.reverse()}/>
        </div>}


        <List size={31} onClick={() => setSidebarVis(!sidebarVis)}
              className='absolute md:hidden cursor-pointer z-20 right-12'/>

        <nav
            className={`
    absolute top-20 right-0 border bg-primary/70 font-semibold  h-[88vh] md:hidden px-2 w-50  flex flex-col justify-between 
    transition-transform transition-opacity duration-300 ease-in-out
    ${sidebarVis ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
    z-30
  `}>
          {user ? (
              <>
                <div className='flex items-start flex-col gap-10'>

                  <Link href="/" className="flex items-center gap-2">
                    <div className="p-1 bg-primary/10 rounded">
                      {theme === 'dark' || theme === 'system' ?
                          <Image alt='edu-logo' src={educatifyLogo} className="w-12 h-12 text-primary rounded-lg"/> :
                          <Image alt='edu-logo' src={whiteEducatifyLogo} className="w-12 h-12 text-primary rounded-lg"/>}

                    </div>
                    <span className="text-xl font-bold font-mono">
            <span className="text-primary">edu</span>cati<span className="text-primary">fy</span>
          </span>
                  </Link>
                  <Link
                      href="/"
                      className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
                  >
                    <HomeIcon size={16}/>
                    <span>Главная страница</span>
                  </Link>

                  <Link
                      href="/schedule"
                      className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
                  >
                    <DumbbellIcon size={16}/>
                    <span>Уроки</span>
                  </Link>
                  {isMentor && <Link
                      href="/dashboard"
                      className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
                  >
                    <DumbbellIcon size={16}/>
                    <span>Панель управления</span>
                  </Link>}

                  <Link
                      href="/profile"
                      className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
                  >
                    <UserIcon size={16}/>
                    <span>Профиль</span>
                  </Link>
                </div>
                <div className='flex  items-center gap-2'>


                  <Button
                      asChild
                      variant="outline"
                      className="ml-2 border-primary/50 text-primary hover:text-white hover:bg-primary/10"
                  >
                    <Link href="/schedule">{isMentor ? 'Начать урок' : 'Мои уроки'}</Link>
                  </Button>
                  {/* <UserButton/> */}
                  <Link href='/sign-in'>
                    <Button onClick={logout}>

                      Выйти
                      <ArrowBigRightDashIcon/>
                    </Button>
                  </Link>

                  <ModeToggle/>
                </div>
              </>
          ) : (
              <>
                {/*
               <SignInButton>
                  <Button
                      variant={"outline"}
                      className="border-primary/50 text-primary hover:text-white hover:bg-primary/10"
                  >
                    Войти
                  </Button>
                </SignInButton>
                        <SignUpButton>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Создать аккаунт
                  </Button>

                </SignUpButton>
          */}

                <Button onClick={() => router.push('/sign-in')}>
                  signin
                </Button>
            <Button onClick={() => router.push('/sign-up')}>
                  signup
                </Button>
              </>
          )}

        </nav>

      </div>
    </header>
  );
};
export default Navbar;
