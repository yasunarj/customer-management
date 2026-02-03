type Props = {
  onMon: boolean;
  onTue: boolean;
  onWed: boolean;
  onThu: boolean;
  onFri: boolean;
  onSat: boolean;
  onSun: boolean;
};

const WeekBadges = (props: Props) => {
  const days = [
    ["月", props.onMon],
    ["火", props.onTue],
    ["水", props.onWed],
    ["木", props.onThu],
    ["金", props.onFri],
    ["土", props.onSat],
    ["日", props.onSun],
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
