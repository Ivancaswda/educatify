'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import LoaderUI from '@/components/LoaderUI';
import {useUserRole} from "@/components/hooks/useUserRole";
import {useTheme} from "next-themes";
import {useAuth} from "@/providers/authContext";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";


export default function ChatsPage() {
    const { user } = useAuth();
    console.log(user)
    const router = useRouter();
    const mentors = useQuery(api.users.listUsers)?.filter((u) => u.role === 'mentor') ?? [];
    const students = useQuery(api.users.listUsers)?.filter((u) => u.role !== 'mentor') ?? [];
    const me =  useQuery(api.users.listUsers)?.find((u) => u._id === user?.id || u.userId === user?.user_id)
    console.log(students)
    console.log(mentors)
    const {isMentor} = useUserRole()
    const {theme} = useTheme()
    console.log(isMentor)
    console.log(me)
    if (!me || !mentors) return <LoaderUI />;

    return (
        <div className="p-6 relative z-20 w-full">
            {me?.role !== 'mentor' ? <h1 className="text-2xl font-bold mb-4">Выберите ментора для общения</h1> :
                <h1 className="text-2xl font-bold mb-4">Выберите ученика для общения</h1>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {me?.role !== 'mentor' ? (
                    mentors.length === 0 ? (
                        <div className="flex items-center justify-center w-[97vw]">
                            <div>Учителя не найдены!</div>
                        </div>
                    ) : (
                        mentors.map((mentor) => (
                            <div
                                key={mentor._id}
                                className={`p-4 border rounded-lg cursor-pointer ${theme === 'system' || theme === 'dark' ? 'hover:bg-gray-600 hover:text-white' : 'hover:bg-gray-200 hover:text-black'} transition`}
                                onClick={() => router.push(`/chats/${mentor.userId}`)}>
                                <Avatar>

                                    <AvatarImage className='w-12 h-12 flex items-center justify-center text-center' src={mentor.image}/>
                                    <AvatarFallback>{mentor.name.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>

                                <h2 className="text-lg font-medium">{mentor.name}</h2>
                            </div>
                        ))
                    )
                ) : (
                    students.length === 0 ? (
                            <div className="flex items-center justify-center w-[97vw]">
                                <div>Ученики не найдены!</div>
                            </div>
                        ) :
                        students.map((student) => (
                        <div
                            key={student._id}
                            className={`p-4 border rounded-lg cursor-pointer ${theme === 'dark' ? 'hover:bg-gray-600 hover:text-white' : "hover:bg-gray-200 hover:text-black"} hover:bg-gray-100 transition`}
                            onClick={() => router.push(`/chats/${student.userId}`)}
                        >
                            <Avatar>
                                <AvatarImage className='w-12 h-12' src={student.image}/>
                                <AvatarFallback>{student.name.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <h2 className="text-lg font-medium">{student.name}</h2>
                        </div>
                    ))
                )}

            </div>
        </div>
    );
}