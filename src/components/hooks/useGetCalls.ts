
import {Call, useStreamVideoClient} from "@stream-io/video-react-sdk";
import {useEffect, useState} from "react";
import {useAuth} from "@/providers/authContext";



const useGetCalls = () => {

    const {user} = useAuth()
    const client = useStreamVideoClient()
    const [calls, setCalls] = useState<Call[]>()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const loadCalls = async () => {
            if (!client || !user?.id) return
            setIsLoading(true)

            try {
                // initializing recordings of calls from stream
                const {calls} = await client.queryCalls({
                    sort: [{field: 'starts_at', direction: -1}],
                    filter_conditions: {
                        starts_at: {$exists: true},
                        $or: [{created_by_user_id: user.id}, {members: {$in: [user.id]}}]
                    }
                })
                setCalls(calls)

            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }
        loadCalls()
    }, [client, user?.id])

    const now = new Date()

    // checking for already ended calls amidst calls
    const endedCalls = calls?.filter(({state: {startsAt, endedAt}}:Call) => {
        return (startsAt && new Date(startsAt) < now) || !!endedAt
    })

    // checking for future calls amidst calls
    const upcomingCalls = calls?.filter(({state: {startsAt}}: Call) => {
        return startsAt && new Date(startsAt) > now
    })

    // checking for live calls amidst calls without end time means live calls
    const liveCalls = calls?.filter(({state: {startsAt, endedAt}}: Call) => {
        return startsAt && new Date(startsAt) < now && !endedAt
    })

    return {calls, endedCalls, upcomingCalls, liveCalls, isLoading}


}




export default useGetCalls


















