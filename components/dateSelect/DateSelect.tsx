import { FormItem, FormLabel } from "../ui/form";
import { Select, SelectTrigger, SelectContent, SelectItem } from "../ui/select";

const years = Array.from(
  { length: 2030 - 2022 + 1 },
  (_, index) => 2020 + index
);
const months = Array.from({ length: 12 }, (_, index) => index + 1);
const days = Array.from({ length: 31 }, (_, index) => index + 1);

interface DateSelectProps {
  title: string,
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
      <div className="flex flex-col gap-2">
        <h2 className="text-md sm:text-lg">{title}</h2>
        <div className="w-full flex gap-3">
          <FormItem className="flex gap-1">
            <Select
              onValueChange={(value) => setYear(Number(value))}
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
            <FormLabel className="pt-[3px]">年</FormLabel>
          </FormItem>
          <FormItem className="flex gap-1">
            <Select
              onValueChange={(value) => setMonth(Number(value))}
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
            <FormLabel className="pt-[3px]">月</FormLabel>
          </FormItem>
          <FormItem className="flex gap-1">
            <Select onValueChange={(value) => setDay(Number(value))}>
              <SelectTrigger>{day}</SelectTrigger>
              <SelectContent className="max-h-[180px]">
                {days.map((day) => (
                  <SelectItem key={day} value={day.toString()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormLabel className="pt-[3px]">日</FormLabel>
          </FormItem>
        </div>
      </div>
    </>
  );
};

export default DateSelect;
