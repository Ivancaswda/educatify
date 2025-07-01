// useGetCallById.ts
import { useState, useEffect } from "react";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import LoaderUI from "@/components/LoaderUI";

const useGetCallById = (id: string | undefined | string[]) => {
    const [call, setCall] = useState<Call | undefined>(undefined);
    const [isCallLoading, setIsCallLoading] = useState(true);
    const client = useStreamVideoClient();

    // Нормализуем id в строку
    const normalizedId = Array.isArray(id) ? id[0] : id;


    useEffect(() => {


        console.log(client)

        const getCall = async () => {
            if (!client || !normalizedId) return;

            setIsCallLoading(true);
            try {
                const { calls } = await client.queryCalls({
                    filter_conditions: { id: normalizedId },
                });
                if (calls.length > 0) {
                    setCall(calls[0]);
                } else {
                    setCall(undefined);
                }
            } catch (error) {
                console.error("Error fetching call:", error);
                setCall(undefined);
            } finally {
                setIsCallLoading(false);
            }
        };

        // Запускаем getCall только если client готов и есть id

            getCall();

    }, [client, normalizedId]);

    // Очень важно: пока client не готов — считаем, что мы всё ещё грузим
    const isClientReady = Boolean(client);
    return { call, isCallLoading: !isClientReady || isCallLoading };
};

export default useGetCallById;
