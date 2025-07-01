import React from 'react'
import {Loader2Icon, LoaderIcon} from "lucide-react";

const LoaderUi = () => {
    return (
        <div className='h-[calc(100vh-4rem-1px)] flex items-center justify-center'>
            <Loader2Icon className='text-primary w-8 h-8 animate-spin'/>
        </div>
    )
}
export default LoaderUi
