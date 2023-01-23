import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { api } from '../lib/axios';
import { generateDatesFromYearBeginning } from '../utils/genreate-dates-from-year-beginning';
import { HabitDay } from './Habit';

const weekDqys = [
  'D', 'S', 'T', 'Q', 'Q', 'S', 'S'
];

const summaryDates = generateDatesFromYearBeginning();
const minimumSummaryDatesSize = 18 * 7; // 18 weeks
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length;

interface Summary {
  id: string;
  date: string;
  completed: number;
  amount: number;
};

export function SummaryTable() {
  const [summary, setSummary] = useState<Summary[]>([]);

  useEffect(() => {
    api.get('summary').then(response => {
      setSummary(response.data);
    });
  }, []);

  return (
    <div className="w-full flex">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {weekDqys.map((day, index) => {
          return (
            <div key={`${day}-${index}`} className="text-zinc-400 text-xl font-bold h-10 w-10 flex items-center justify-center">
              {day}
            </div>
          );
        })}
      </div>

      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {summary.length > 0 && summaryDates.map(date => {
          const dayInSummary = summary.find(day => {
            return dayjs(date).isSame(day.date, 'day');
          });
          return (
            <HabitDay
              key={date.toString()}
              date={date}
              available={dayInSummary?.amount}
              defaultCompleted={dayInSummary?.completed}
            />
          );
        })}
        {amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, index) => {
          return (
            <div key={`${index}`} className="bg-zinc-900 w-10 h-10 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"></div>
          );
        })}
      </div>
    </div>
  );
}
