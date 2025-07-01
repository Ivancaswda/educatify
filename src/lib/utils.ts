import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { addHours, intervalToDuration, isAfter, isBefore, isWithinInterval } from "date-fns";
import {  formatDuration } from "date-fns";
import { ru } from "date-fns/locale";
import { Doc } from "../../convex/_generated/dataModel";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}




type Lesson = Doc<"lessons">;
type User = Doc<"users">;

export const groupLessons = (lessons: Lesson[]) => {
  if (!lessons) return {};

  return lessons.reduce((acc: any, lesson: Lesson) => {
    const date = new Date(lesson.startTime);
    const now = new Date();

    if (lesson.status === "succeeded") {
      acc.succeeded = [...(acc.succeeded || []), lesson];
    } else if (lesson.status === "failed") {
      acc.failed = [...(acc.failed || []), lesson];
    } else if (isBefore(date, now)) {
      acc.completed = [...(acc.completed || []), lesson];
    } else if (isAfter(date, now)) {
      acc.upcoming = [...(acc.upcoming || []), lesson];
    }

    return acc;
  }, {});
};


/*  export const getStudentInfo = (users: User[], studentId: string) => {
  const student = users?.find((user) => user.clerkId === studentId);
  return {
    name: student?.name || "неизвестный ученик",
    image: student?.image || "",
    initials:
        student?.name
            ?.split(" ")
            .map((n) => n[0])
            .join("") || "UC",
  };
};*/
export const getStudentInfo = (users: User[], studentId: string) => {
  return users?.find((user) => user._id === studentId || user.userId === studentId);
};

export const getMentorInfo = (users: User[], mentorId: string) => {
  const mentor = users?.find((user) => user._id === mentorId || user.userId === mentorId);
  return {
    name: mentor?.name || "Неизвестный учитель",
    image: mentor?.image,
    initials:
        mentor?.name
            ?.split(" ")
            .map((n) => n[0])
            .join("") || "UI",
  };
};
export const getStudentDisplayInfo = (user?: User) => {
  return {
    name: user?.name || "неизвестный ученик",
    image: user?.image || "",
    initials: user?.name?.split(" ").map((n) => n[0]).join("") || "UC",
  };
};

export const calculateRecordingDuration = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const duration = intervalToDuration({ start, end });

  if (duration.hours && duration.hours > 0) {
    return `${duration.hours}:${String(duration.minutes).padStart(2, "0")}:${String(
        duration.seconds
    ).padStart(2, "0")}`;
  }

  if (duration.minutes && duration.minutes > 0) {
    return `${duration.minutes}:${String(duration.seconds).padStart(2, "0")}`;
  }
  // Форматируем продолжительность на русском
  const formatted = formatDuration(duration, { locale: ru });

  return formatted;
};

export const getLessonStatus = (lesson: Lesson) => {
  const now = new Date();
  const interviewStartTime = lesson.startTime;
  const endTime = addHours(interviewStartTime, 1);

  if (
      lesson.status === "completed" ||
      lesson.status === "failed" ||
      lesson.status === "succeeded"
  )
    return "completed";
  if (isWithinInterval(now, { start: interviewStartTime, end: endTime })) return "live";
  if (isBefore(now, interviewStartTime)) return "upcoming";
  return "completed";
};