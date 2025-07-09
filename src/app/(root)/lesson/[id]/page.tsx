'use client'
import React from 'react'
import {useParams} from "next/navigation";
import {useUser} from "@clerk/nextjs";
import {useState} from "react";
import LoaderUI from "@/components/LoaderUI";
import {StreamCall, StreamTheme} from "@stream-io/video-react-sdk";
import LessonSetup from "@/components/LessonSetup";
import LessonRoom from "@/components/LessonRoom";
import useGetCallById from "@/components/hooks/useGetCallById";
import {useAuth} from "@/providers/authContext";

const Page = () => {

    const {id} = useParams()
    const {user} = useAuth()


    const [isSetupComplete, setIsSetupComplete] = useState(false)

    const {call, isCallLoading} =  useGetCallById(id)

    if (!user || isCallLoading ) return <LoaderUI/>
    if (!call) {
        return (<div className='h-screen text-center relative z-20 flex items-center justify-center'>
            <div className='text-2xl  font-semibold'>Урок не найден!
                <p className='text-muted-foreground text-sm'>Попробуйте присоединиться к уроку еще раз в меню "Уроки"!</p>
            </div>
        </div>)
    }


    return (
        <StreamCall call={call}>
                <StreamTheme>
                    {!isSetupComplete ? (
                        <LessonSetup onSetupComplete={() => setIsSetupComplete(true)}/>
                    ) : (
                        <LessonRoom id={id}/>
                    )}
                </StreamTheme>
        </StreamCall>
    )
}
export default Page

