'use client'
import TerminalOverlay from "@/components/TerminalOverlay";
import { Button } from "@/components/ui/button";
import UserPrograms from "@/components/UserPrograms";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import educatifyLogo from '../../educatify.png'
import whiteEducatifyLogo from '../../white-educatify.png'
import {useUserRole} from "@/components/hooks/useUserRole";
import {useUser} from "@clerk/nextjs";
import {useTheme} from "next-themes";
import {useState} from "react";
import {useQuery} from "convex/react";
import {api} from "../../../../convex/_generated/api";
import {useRouter} from "next/navigation";
import {useAuth} from "@/providers/authContext";
const HomePage = () => {
  const {user} = useAuth()
  console.log(user)

  const {theme} = useTheme()
  console.log(theme)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<"start" | "join">()
  const users = useQuery(api.users.getUsers) ?? []
  const me = users.find((u) => u._id === user?.id)  ?? users?.find((u) => u.userId === user?.user_id)

  const router = useRouter()
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
  return (
    <div className="flex flex-col  min-h-screen text-foreground overflow-hidden">
      <section className="relative z-10 py-24 flex-grow">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
            {/* CORNER DECARATION */}
            <div className="absolute -top-10 left-0 w-40 h-40 border-l-2 border-t-2"/>


            <div className="lg:col-span-5 relative">
              {/* CORNER PIECES */}
              <div className="absolute inset-4 pointer-events-none">
                <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-border"/>
                <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-border"/>
                <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-border"/>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-border"/>
              </div>

              {/* IMAGE CONTANINER */}
              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="relative overflow-hidden rounded-lg bg-cyber-black">
                  {theme === 'dark' || theme === 'system' ? <Image width={300} height={300}
                                                                   src={educatifyLogo}
                                                                   alt='logo'
                                                                   className="size-full object-center  object-cover "
                  /> : <Image width={300} height={300}
                              src={whiteEducatifyLogo}
                              alt='logo'
                              className="size-full object-center  object-cover "
                  />}


                  {/* SCAN LINE */}
                  <div
                      className="absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_calc(50%-1px),var(--cyber-glow-primary)_50%,transparent_calc(50%+1px),transparent_100%)] bg-[length:100%_8px] animate-scanline pointer-events-none"/>

                  {/* DECORATIONS ON TOP THE IMAGE */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 border border-primary/40 rounded-full"/>

                    {/* Targeting lines */}
                    <div className="absolute top-1/2 left-0 w-1/4 h-px bg-primary/50"/>
                    <div className="absolute top-1/2 right-0 w-1/4 h-px bg-primary/50"/>
                    <div className="absolute top-0 left-1/2 h-1/4 w-px bg-primary/50"/>
                    <div className="absolute bottom-0 left-1/2 h-1/4 w-px bg-primary/50"/>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"/>
                </div>

                {/* TERMINAL OVERLAY */}

              </div>
            </div>


            <div className="lg:col-span-7 space-y-8 relative text-end">
              {user ? (<h1 className="text-5xl md:text-6xl lg:text-7xl text-end font-bold tracking-tight">
                    <div>
                      <span className="text-foreground text-end">Добро пожаловать,</span>
                    </div>

                    <div>
                      <span className="text-primary text-end">{me?.name}</span>
                    </div>


                  </h1>) :
                  (<h1 className="text-5xl md:text-6xl lg:text-7xl text-end font-bold tracking-tight">
                    <div>
                    <span className="text-foreground text-end">Добро пожаловать,</span>
                    </div>

                  </h1>)}


              {/* SEPERATOR LINE */}
              <div
                  className="h-px w-full text-end bg-gradient-to-r from-primary via-secondary to-primary opacity-50"></div>
              <div className='w-full text-end flex items-end justify-end'>

                {me?.role === 'student' ? <p className="text-xl text-end text-muted-foreground w-2/3">

                  Начните получать знания <span className='text-primary'>онлайн</span> прямо сейчас!
                </p> : <p className="text-xl text-end text-muted-foreground w-2/3">

                  Развивайте свою карьеру преподавателя <span className='text-primary'>онлайн</span>!
                </p>}

              </div>


              {/* BUTTON */}
              <div className="flex flex-col items-end justify-end sm:flex-row gap-4 pt-6">
                <Button onClick={() => {
                  if (me?.role === 'mentor') {
                    handleQuickAction('Новый звонок')
                  } else {
                    handleQuickAction('Присоедениться к уроку')
                  }
                }}
                        size="lg"
                        asChild
                        className="overflow-hidden cursor-pointer bg-primary text-primary-foreground px-8 py-6 text-lg font-medium"
                >
                  <Link href='/schedule'>
                    <p>{me?.role === 'mentor' ? 'Начать урок' : 'Присоединиться к уроку'}</p>

                    <ArrowRightIcon className="ml-2 size-5"/>
                  </Link>


                </Button>
              </div>
            </div>


          </div>
        </div>
      </section>

      <UserPrograms/>

    </div>
  );
};
export default HomePage;
