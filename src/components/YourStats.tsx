import { Card, CardContent } from "@/components/ui/card";
import { Users, Video, BookOpenCheck, Clock } from "lucide-react";

type StatCardProps = {
    label: string;
    value: number;
    icon: React.ReactNode;
};

const StatCard = ({ label, value, icon }: StatCardProps) => (
    <Card className="flex flex-col items-center hover:border-red-600 transition-all cursor-pointer justify-center p-6 text-center bg-card border border-border shadow-md rounded-2xl hover:shadow-lg transition">
        <div className="text-primary mb-2">{icon}</div>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
    </Card>
);

type StatsOverviewProps = {
    stats: {
        totalLessons?: number;
        totalStudents?: number;
        totalCalls?: number;
        totalHours?: number;
    };
};

export const YourStats = ({ stats }: StatsOverviewProps) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-10">
            <StatCard
                label="Уроков"
                value={stats.totalLessons ?? 0}
                icon={<BookOpenCheck className="h-6 w-6" />}
            />
            <StatCard
                label="Студентов"
                value={stats.totalStudents ?? 0}
                icon={<Users className="h-6 w-6" />}
            />
            <StatCard
                label="Звонков"
                value={stats.totalCalls ?? 0}
                icon={<Video className="h-6 w-6" />}
            />
            <StatCard
                label="Часы работы"
                value={stats.totalHours ?? 0}
                icon={<Clock className="h-6 w-6" />}
            />
        </div>
    );
};
