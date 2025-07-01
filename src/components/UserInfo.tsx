import React from 'react'
import {Doc} from "../../convex/_generated/dataModel";
import {Avatar} from "@stream-io/video-react-sdk";
import {AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {UserCircleIcon} from "lucide-react";
import Image from "next/image";

type User = Doc<"users">
// creating user data from db
const UserInfo = ({user}: {user:User}) => {

    return (
     <div className='flex items-center gap-2'>

         {user?.image ?  <Image src={user?.image} alt={user?.name} width={30} height={30} className='rounded-full'/> :
            <div className='bg-primary text-white flex justify-center items-center w-[30px] h-[30px] rounded-full
            '>
                <div>
                    {user?.name.charAt(0).toUpperCase()}
                </div>
            </div>


           }


         <span>{user.name}</span>
     </div>
    )
}
export default UserInfo
