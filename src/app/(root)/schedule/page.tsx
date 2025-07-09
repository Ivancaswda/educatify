'use client'
import React from 'react'
import {useUserRole} from "@/components/hooks/useUserRole";
import LoaderUI from "@/components/LoaderUI";
import {useRouter} from "next/navigation";
import LessonRoom from "@/components/LessonRoom";
import LessonScheduleUI from "@/components/LessonScheduleUI";

const Page = () => {
    const router = useRouter()
    const {isMentor, isLoading} = useUserRole()
    if (isLoading) return  <LoaderUI/>


    return (
        <LessonScheduleUI/>
    )
}
export default Page
