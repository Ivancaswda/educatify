'use client'
// app/blog/[id]/page.tsx
import {notFound, useParams, useRouter} from "next/navigation";
import LoaderUI from "@/components/LoaderUI";
import aiPng from '../../../../ai.png'
import boyPng from '../../../../boy-png.jpg'
import Image from "next/image";
import {useQuery} from "convex/react";
import {useEffect} from "react";
import {api} from "../../../../../convex/_generated/api";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import React from "react";
import {ArrowLeftCircle} from "lucide-react";


function BlogPostPage() {
    const params = useParams()
    const router = useRouter()
    console.log(params?.id)
    const blogPosts = useQuery(api.blogPosts.getAllPosts) ?? []
    console.log(blogPosts)
    const post = blogPosts?.find((p) => p._id === params?.id);
    const users = useQuery(api.users.getUsers) ?? []
    const author = users.find((u) => u.userId === post?.authorId || u._id === post?.authorId)
    console.log(author)
    console.log(post)
    if (!post) {
        return <LoaderUI />;
    }

    return post && (
        <div className="max-w-3xl mx-auto py-16 px-4 md:px-0 relative">
            <ArrowLeftCircle className='text-white absolute z-20 left-[-10%] cursor-pointer' onClick={() => router.push('/blog')}/>
            <Image width={400} height={360} src={post.image} alt={'image'} className="w-full h-96 object-cover rounded-xl mb-8" />
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <p className="text-gray-500 mb-6">
                • <div className='flex items-center gap-3 '>
                <Avatar>
                    <AvatarImage src={author.image}/>
                </Avatar>
                <p className='font-semibold '>{author.name}</p>
                <p className='font-semibold text-2xl'>&middot;</p>
                <p className='text-muted-foreground font-semibold text-xs'> {author.role === 'mentor' ? 'преподаватель' : 'ученик'}</p>
            </div>
            </p>
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{__html: post.content}}/>
        </div>
    ) ;
}


export default BlogPostPage