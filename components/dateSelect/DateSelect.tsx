
import { Select, SelectTrigger, SelectContent, SelectItem } from "../ui/select";

const years = Array.from(
  { length: 2030 - 2022 + 1 },
  (_, index) => 2020 + index
);
const months = Array.from({ length: 12 }, (_, index) => index + 1);
const days = Array.from({ length: 31 }, (_, index) => index + 1);

interface DateSelectProps {
  title?: string,
  setYear: (year: number) => void;
  setMonth: (month: number) => void;
  setDay: (day: number) => void;
  year: number;
  month: number;
  day: number;
}

const DateSelect = ({title, setYear, setMonth, setDay, year, month, day}: DateSelectProps) => {
  return (
    <>
      <div className="flex flex-col gap-2 justify-center">
        { title && <h2 className="text-md sm:text-lg">{title}</h2> }
        <div className="w-full flex gap-3">
          <div className="flex gap-1 items-center">
            <Select
              onValueChange={(value) => setYear(Number(value))}
              defaultValue={String(year)}
            >
              <SelectTrigger>{year}</SelectTrigger>
              <SelectContent className="max-h-[180px]">
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="pt-[3px]">年</span>
          </div>
          <div className="flex gap-1 items-center">
            <Select
              onValueChange={(value) => setMonth(Number(value))}
              defaultValue={String(month)}
            >
              <SelectTrigger>{month}</SelectTrigger>
              <SelectContent className="max-h-[180px]">
                {months.map((month) => (
                  <SelectItem key={month} value={month.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="pt-[3px]">月</span>
          </div>
          <div className="flex gap-1 items-center">
            <Select onValueChange={(value) => setDay(Number(value))}
              defaultValue={String(day)}>
              <SelectTrigger>{day}</SelectTrigger>
              <SelectContent className="max-h-[180px]">
                {days.map((day) => (
                  <SelectItem key={day} value={day.toString()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="pt-[3px]">日</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default DateSelect;
