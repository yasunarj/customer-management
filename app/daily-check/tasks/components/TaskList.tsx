"use client";
import useSWR from "swr";
import WeekBadges from "./WeekBadges";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const TaskList = () => {
  const { data, error } = useSWR("/api/daily-task", fetcher);

  if (error) return <div className="text-red-500">読み込みに失敗しました</div>;
  if (!data) return <div className="text-gray-400">読み込み中...</div>;
  // ↑データがない場合になぜ読み込み中と表示するのか確認をする

  const tasks = data.tasks;
  
  return <></>;
};

export default TaskList;
