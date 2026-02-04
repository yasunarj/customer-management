"use client";
import useSWR from "swr";
import WeekBadges from "./WeekBadges";

type Task = {
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

  if (data.tasks.length === 0) return <div className="text-gray-400">タスクがありません</div>

  const tasks = data.tasks as Task[];

  return (
    <div className="space-y-3">
      {tasks.map((t) => (
        <div key={t.id} className="rounded border border-gray-700 p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div
                className={`font-bold ${t.isActive ? "" : "line-through text-gray-500"}`}
              >
                {t.title}
              </div>
              <div>
                <WeekBadges tasks={t} />
              </div>
            </div>
            <div>並び: {t.sortOrder}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
