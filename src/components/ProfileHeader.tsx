
import CornerElements from "./CornerElements";
import EditProfileModal from "@/components/EditProfileModal";
import React from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

interface UserResource {
  id: string,
  image: string,
  name: string,
  role: string,
  email: string
}

const ProfileHeader = ({ user }: { user: UserResource | null | undefined }) => {
  if (!user) return null;
  console.log(user)
  console.log(user)
  return (
    <div className="mb-10 relative backdrop-blur-sm border border-border  p-6">
      <CornerElements />

      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="relative">
          {user?.image ? (
              <div className='w-24 h-24 object-cover'>


                <Avatar className='w-full h-full'>
                  <AvatarImage className='w-full ' src={user?.image}/>
                  <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
          ) : (
              <div
                  className="w-24 h-24 rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary">
                {user.name?.charAt(0) || user.email.split('@')[0].charAt(0)}
              </span>
              </div>
          )}

          <div
              className="w-4 h-4 rounded-full bg-green-500 absolute z-20 bottom-0 right-[-9px] animate-pulse mr-2"></div>

        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="text-foreground">{user.name || user.email.split('@')[0]}</span>
            </h1>
            <div className="flex items-center bg-cyber-terminal-bg backdrop-blur-sm border border-border rounded px-3 py-1">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse mr-2"></div>
              <p className="text-xs font-mono text-primary font-semibold">{user.role === 'mentor' ? 'ПРЕПОДОВАТЕЛЬ' : 'УЧЕНИК'}</p>
            </div>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-primary via-secondary to-primary opacity-50 my-2"></div>
          <div className='flex items-center justify-between'>
            <p className="text-muted-foreground font-mono">
              {user.email}
            </p>
            <EditProfileModal/>
          </div>

        </div>
      </div>
    </div>
  );
};
export default ProfileHeader;
