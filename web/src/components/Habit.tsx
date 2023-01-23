import * as Popover from '@radix-ui/react-popover';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useState } from 'react';
import { HabitsList } from './HabitList';
import { ProgressBar } from './ProgressBar';

interface HabitDayProps {
  date: Date;
  defaultCompleted?: number;
  available?: number;
};

export function HabitDay({ available = 0, defaultCompleted = 0, date }: HabitDayProps) {
  const [completed, setCompleted] = useState(defaultCompleted);

  const habitsProgress = available > 0 ? (completed / available) * 100 : 0;

  const dayOfTheWeek = dayjs(date).format('dddd');
  const dayAndMonth = dayjs(date).format('DD/MM');

  function handleCompletedChange(completed: number) {
    setCompleted(completed);
  }

  return (
    <Popover.Root>
      <Popover.Trigger className={clsx('w-10 h-10 border-2 rounded-lg transition-colors focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-background', {
        'bg-violet-500 border-violet-400': habitsProgress >= 80,
        'bg-violet-600 border-violet-500': habitsProgress >= 60 && habitsProgress < 80,
        'bg-violet-700 border-violet-500': habitsProgress >= 40 && habitsProgress < 60,
        'bg-violet-800 border-violet-600': habitsProgress >= 20 && habitsProgress < 40,
        'bg-violet-900 border-violet-700': habitsProgress > 0 && habitsProgress < 20,
        'bg-zinc-900 border-zinc-800': habitsProgress === 0,
      })} />

      <Popover.Portal>
        <Popover.Content className="min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col">
          <span className="font-semibold text-zinc-400">{dayOfTheWeek}</span>
          <span className="mt-1 font-extrabold leading-tight text-3xl">{dayAndMonth}</span>

          <ProgressBar progress={habitsProgress} />

          <HabitsList date={date} onCompletedChange={handleCompletedChange} />

          <Popover.Arrow width={16} height={8} className="fill-zinc-900" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
