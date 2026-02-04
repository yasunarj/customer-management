type Props = {
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

const WeekBadges = ({tasks}: {tasks: Props}) => {
  const days = [
    ["月", tasks.onMon],
    ["火", tasks.onTue],
    ["水", tasks.onWed],
    ["木", tasks.onThu],
    ["金", tasks.onFri],
    ["土", tasks.onSat],
    ["日", tasks.onSun],
  ] as const;

  return (
    <div className="flex flex-wrap gap-1">
      {days.map(([label, on]) => {
        return (
          <span
            key={label}
            className={`rounded px-2 py-0.5 text-xs ${on ? "bg-white text-black" : "bg-gray-700 text-gray-400"}`}
          >
            {label}
          </span>
        );
      })}
    </div>
  );
};

export default WeekBadges;
