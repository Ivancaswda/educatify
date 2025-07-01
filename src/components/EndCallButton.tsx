'use client'
import React from 'react'
import {useCall, useCallStateHooks} from "@stream-io/video-react-sdk";
import {useRouter} from "next/navigation";
import {useMutation, useQuery} from "convex/react";
import {api} from "../../convex/_generated/api";
import {Button} from "@/components/ui/button";
import toast from "react-hot-toast";
import {useEffect} from "react";

const EndCallButton = () => {
    const call = useCall()

    const router = useRouter()

    const {useLocalParticipant} = useCallStateHooks()
    const localParticipant = useLocalParticipant()
    const updateLessonStatus = useMutation(api.lessons.updateLessonStatus);

    const lesson = useQuery(api.lessons.getLessonByStreamCallId, {
        streamCallId: call?.id || ""
    })
    useEffect(() => {
        if (lesson?.status === "completed") {
            router.push("/")
        }
    }, [lesson?.status, router])

    if (!call || !lesson) return  null

    const isMeetingOwner = localParticipant?.userId === call.state.createdBy?.id
    console.log(isMeetingOwner)


    const endCall = async () => {
        try {
            await call.endCall()

            await updateLessonStatus({
                id: lesson._id,
                status: 'completed'
            })
            router.push('/')
            toast.success('Учитель закончил урок')
        } catch (error) {
            console.log(error)
            toast.error('error to end the lesson')
        }
    }


    return  (

        <Button disabled={!isMeetingOwner} variant='destructive' onClick={endCall}>
            Закончить урок
        </Button>
    )
}
export default EndCallButton
















