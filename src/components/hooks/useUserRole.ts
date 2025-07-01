import {useUser} from "@clerk/nextjs";
import {useQuery} from "convex/react";
import {api} from "../../../convex/_generated/api";
import {useAuth} from "@/providers/authContext";

export const useUserRole = () => {
    const {user} = useAuth()

    const userData = useQuery(api.users.getUserByUserId, {
        userId: user?.userId || ""
    })

    const isLoading = userData === undefined

    // defining property if isMentor or isStudent

    return {
        isLoading,
        isMentor: userData?.role === 'mentor',
        isStudent: userData?.role === 'student'
    }
}