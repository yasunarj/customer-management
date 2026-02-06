"use client";
import useSWR from "swr";
import TaskRow from "./TaskRow";

export type Task = {
  id: string;
  title: string;
  sortOrder: number;
  isActive: boolean;
  onMon: boolean;
  onTue: boolean;
  onWed: boolean;
  onThu: boolean;
  onFri: boolean;
  onSat: boolean;
  onSun: boolean;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const TaskList = () => {
  const { data, error } = useSWR("/api/daily-task", fetcher);
  if (error) return <div className="text-red-500">読み込みに失敗しました</div>;
  if (!data) return <div className="text-gray-500">読み込み中,,,</div>;

  const tasks = data.tasks as Task[];
  
  if (data.tasks.length === 0) return <div className="text-gray-400">タスクがありません</div>

  return (
    <div className="space-y-3">
      {tasks.map((t) => (
        <TaskRow key={t.id} task={t} />
      ))}
    </div>
  );
};

export default TaskList;
