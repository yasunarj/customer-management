import type { Task } from "./TaskList";
import WeekBadges from "./WeekBadges";
import { useState } from "react";

const TaskRow = ({ task }: { task: Task }) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="rounded-xl border border-gray-700 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className={`font-semibold ${task.isActive ? "" : "line-through text-gray-500"}`}>
            {task.title}
          </div>
          <div className="mt-2">
            <WeekBadges {...task} />
          </div>
          <div className="mt-2 text-xs text-gray-400">並び: {task.sortOrder}</div>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded bg-gray-800 px-3 py-1 text-sm text-gray-200 hover:bg-gray-700"
        >
          {open ? "閉じる" : "編集"}
        </button>
      </div>

      {/* {open && <TaskEditor task={task} onDone={() => setOpen(false)} />} */}
    </div>
  );
}
export default TaskRow;
