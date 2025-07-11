import { DeviceSettings, useCall, VideoPreview } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { CameraIcon, MicIcon, SettingsIcon } from "lucide-react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";

function LessonSetup({ onSetupComplete }: { onSetupComplete: () => void }) {
    const [isCameraDisabled, setIsCameraDisabled] = useState(true);
    const [isMicDisabled, setIsMicDisabled] = useState(false);

    const call = useCall();



    useEffect(() => {
        if (isCameraDisabled) call?.camera.disable();
        else call?.camera.enable();
    }, [isCameraDisabled, call?.camera]);

    useEffect(() => {
        if (isMicDisabled) call?.microphone.disable();
        else call?.microphone.enable();
    }, [isMicDisabled, call?.microphone]);

    const handleJoin = async () => {
        await call?.join();
        onSetupComplete();
    };

    return (
        <div
            className="min-h-screen  text-white  flex md:flex-row flex-col gap-20  items-center justify-between  p-6 bg-background/95">

            <div className="w-full max-w-[1200px] mx-auto">
                <div className=" gap-6  ">
                    {/* VIDEO PREVIEW CONTAINER */}

                    <Card className="md:col-span-1 hidden md:flex p-6  flex-col absolute w-[40%] top-24">
                        <div>
                            <h1 className="text-xl font-semibold mb-1 text-yellow-500">Вид видеокамеры</h1>
                            <p className="text-sm text-muted-foreground">Убедись что выглядишь хорошо!</p>
                        </div>

                        {/* VIDEO PREVIEW */}
                        <div
                            className="mt-4 flex-1 min-h-[400px] rounded-xl overflow-hidden bg-muted/50 border relative">

                            <VideoPreview className="min-h-[400px]"/>


                        </div>
                    </Card>

                    {/* CARD CONTROLS */}

                    <Card className="md:col-span-1 p-6 absolute right-20 top-44 ">
                        <div className="h-full flex flex-col">
                            {/* MEETING DETAILS  */}
                            <div>
                                <h2 className="text-xl font-semibold mb-1">Найстройки ваших девайсов</h2>
                                <p className="text-sm text-muted-foreground break-all">{call?.id}</p>
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                                <div className="space-y-6 mt-8">
                                    {/* CAM CONTROL */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <CameraIcon className="h-5 w-5 text-primary"/>
                                            </div>
                                            <div>
                                                <p className="font-medium">Camera</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {isCameraDisabled ? "Выкл" : "Вкл"}
                                                </p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={!isCameraDisabled}
                                            onCheckedChange={(checked) => setIsCameraDisabled(!checked)}
                                        />
                                    </div>

                                    {/* MIC CONTROL */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <MicIcon className="h-5 w-5 text-primary"/>
                                            </div>
                                            <div>
                                                <p className="font-medium">Микрофон</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {isMicDisabled ? "Выкл" : "Вкл"}
                                                </p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={!isMicDisabled}
                                            onCheckedChange={(checked) => setIsMicDisabled(!checked)}
                                        />
                                    </div>

                                    {/* DEVICE SETTINGS */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <SettingsIcon className="h-5 w-5 text-primary"/>
                                            </div>
                                            <div>
                                                <p className="font-medium">Настройки</p>
                                                <p className="text-sm text-muted-foreground">Выбери устройство</p>
                                            </div>
                                        </div>
                                        <DeviceSettings/>
                                    </div>
                                </div>

                                {/* JOIN BTN */}
                                <div className="space-y-3 mt-8">
                                    <Button className="w-full" size="lg" onClick={handleJoin}>
                                        Присоедениться к уроку
                                    </Button>
                                    <p className="text-xs text-center text-muted-foreground">
                                        Надеемся вы не забыли повторить правила, Удачи! 🎉
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
                </div>

                </div>

                );
                }
                export default LessonSetup;
