'use client'
import React, {useState} from 'react'
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import {useRouter} from "next/navigation";
import {
    CallControls,
    CallingState,
    CallParticipantsList,
    PaginatedGridLayout, SpeakerLayout, useCall,
    useCallStateHooks
} from "@stream-io/video-react-sdk";
import {LayoutListIcon, Loader, ShareIcon, UsersIcon} from "lucide-react";
import LoaderUI from "@/components/LoaderUI";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import RichDocumentEditor from "@/components/RichDocumentEditor";
import EndCallButton from "@/components/EndCallButton";
import {useMutation, useQuery} from "convex/react";
import {api} from "../../convex/_generated/api";
import toast from "react-hot-toast";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Checkbox} from "@/components/ui/checkbox";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useUserRole} from "@/components/hooks/useUserRole";
import {useAuth} from "@/providers/authContext";

const LessonRoom = ({id}) => {
    const router = useRouter();
    const [showParticipants, setShowParticipants] = useState(false);
    const [layout, setLayout] = useState<"grid" | "speaker">("speaker");
    const {useCallCallingState} = useCallStateHooks();
    const callingState = useCallCallingState();


    const call = useCall();

    const lesson = useQuery(
        api.lessons.getLessonByStreamCallId,
        call?.id ? { streamCallId: call.id } : null
    );


    React.useEffect(() => {
        if (lesson?.status === "completed") {
            router.push("/")
        }
    }, [lesson?.status, router]);



    const {user} = useAuth()
    const [showPresenceModal, setShowPresenceModal] = useState(false);
    const users = useQuery(api.users.getUsers) ?? [];
    const me = users.find((u) => u._id === user?.id)  ?? users?.find((u) => u.userId === user?.user_id)
    const updateStudents = useMutation(api.lessons.updateLessonStudents);
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

// Из call берём участников



    const participants = Object.values(call?.state?.participants ?? {});

    const participantsWithRoles = participants.map((p) => {
        const convexUser = users?.find((u) => u.userId === p.userId);
        return {
            ...p,
            clerkId: convexUser?.userId,  // <== добавляем явно
            name: convexUser?.name,
            image: convexUser?.image,
            role: convexUser?.role ?? 'unknown',
        };
    });




// 4. Фильтруем только студентов
    const studentParticipants = participantsWithRoles.filter((p) => p.userId !== me?.userId || p.userId !== user?.user_id);
    console.log(participantsWithRoles)
    return (
        <div className="h-[calc(100vh-4rem-1px)] overflow-auto">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={35} minSize={25} maxSize={100} className="relative">
                    {/* VIDEO LAYOUT */}
                    <div className="absolute inset-0">
                        {layout === "grid" ? <PaginatedGridLayout/> : <SpeakerLayout/>}

                        {/* PARTICIPANTS LIST OVERLAY */}
                        {showParticipants && (
                            <div
                                className="absolute right-0 top-0 h-full w-[300px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                                <CallParticipantsList
                                    onClose={() => setShowParticipants(false)}/>
                            </div>
                        )}
                    </div>

                    {/* VIDEO CONTROLS */}

                    <div className="absolute bottom-8 left-0 right-0 ">
                        <div className="flex flex-col items-center gap-4 ">
                            <div className="flex flex-col sm:flex-row items-center gap-2 flex-wrap justify-center px-4 overflow-x-auto">
                                <CallControls onLeave={() => router.push("/")}/>

                                <div className="flex items-center flex-col md:flex-row  gap-2">
                                    <DropdownMenu >
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="icon" className="size-10">
                                                <LayoutListIcon className="size-4"/>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => setLayout("grid")}>
                                                Grid view
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setLayout("speaker")}>
                                                Speaker View
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="size-10"
                                        onClick={() => setShowParticipants(!showParticipants)}
                                    >
                                        <UsersIcon className="size-4"/>
                                    </Button>
                                    {me?.role === 'mentor' && <Button
                                                           className=""
                                                           onClick={() => setShowPresenceModal(true)}
                                    >
                                        Отметить студентов
                                    </Button>}


                                    <Dialog open={showPresenceModal} onOpenChange={setShowPresenceModal}>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Кто присутствовал на уроке?</DialogTitle>
                                            </DialogHeader>
                                            <div className="max-h-[300px] overflow-y-auto space-y-2">
                                                {studentParticipants.map((p) => {
                                                    const isChecked = selectedStudentIds.includes(p.userId);

                                                    const participant = users.find((u) => u._id === p.userId || u.userId === p.userId)

                                                    return (
                                                        <div key={p.clerkId} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                checked={isChecked}
                                                                onCheckedChange={(checked) => {
                                                                    setSelectedStudentIds((prev) =>
                                                                        checked
                                                                            ? [...prev, p.userId]
                                                                            : prev.filter((id) => id !== p.userId)
                                                                    );
                                                                }}
                                                            />
                                                            <div className='flex items-center gap-3'>
                                                                <Avatar className='flex items-center justify-center'>
                                                                    <AvatarImage src={participant?.image} />
                                                                    <AvatarFallback>{participant?.name.charAt(0).toUpperCase()}</AvatarFallback>
                                                                </Avatar>
                                                                <span >{participant?.name || "Неизвестный"}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="flex justify-end gap-2 pt-4">
                                                <Button variant="outline" onClick={() => setShowPresenceModal(false)}>
                                                    Отмена
                                                </Button>

                                                <Button
                                                    onClick={async () => {
                                                        try {
                                                            await updateStudents({
                                                                userId: me?.userId,
                                                                streamCallId: call?.id,
                                                                studentIds: selectedStudentIds,
                                                            });
                                                            toast.success("Список посещения сохранён!");
                                                            setShowPresenceModal(false);
                                                        } catch (err) {
                                                            toast.error("Ошибка при сохранении списка");
                                                        }
                                                    }}
                                                >
                                                    Сохранить
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    <EndCallButton/>
                                </div>
                            </div>

                        </div>
                    </div>

                </ResizablePanel>

                <ResizableHandle withHandle/>

                <ResizablePanel defaultSize={65} minSize={55}>
                    <RichDocumentEditor lessonId={call?.id}/>
                    <div
                        className="absolute top-2 right-2 bg-muted text-muted-foreground text-xs px-3 py-1 rounded-md shadow-sm flex items-center gap-2">
                        <kbd className="bg-background border px-1.5 py-0.5 rounded text-sm shadow-inner">Enter</kbd>
                        <span>нажмите для сохранения текста</span>
                    </div>
                </ResizablePanel>

                <Button
                    className="absolute top-4 right-4 z-10"
                    onClick={() => setShowPresenceModal(true)}
                >
                    Отметить студентов
                </Button>


            </ResizablePanelGroup>

            <div className='mt-2 absolute z-20 right-0 bottom-4 w-[40%] flex items-center justify-end   '>
                {id && (
                    <div className="hidden sm:flex flex-col items-center gap-2 py-2 bg-muted px-3 py-1 rounded-md text-sm">
                        <div className='flex items-center justify-center gap-2'>
                            <ShareIcon/>
                            <h1 className='text-lg'>Поделитесь вашим уроком с другими</h1>
                        </div>

                        <div className={'flex items-center gap-2'}>


                        <span className="font-mono truncate max-w-[160px]">{id}</span>

                        <Button
                            size="sm"
                          className='bg-green-500'
                            onClick={() => {
                                navigator.clipboard.writeText(id);
                                toast.success('Вы скопировали ссылку урока')
                            }}
                        >
                            Копировать
                        </Button>
                        </div>
                    </div>
                )}
                {id && <Button    size="sm"
                                  className='bg-green-500 block sm:hidden'
                                  onClick={() => {
                                      navigator.clipboard.writeText(id);
                                      toast.success('Вы скопировали ссылку урока')
                                  }}>
                    Копировать ссылку урока
                </Button>}
            </div>
        </div>
    )
}
export default LessonRoom
