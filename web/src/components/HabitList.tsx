import * as Checkbox from '@radix-ui/react-checkbox';
import dayjs from 'dayjs';
import { Check } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { api } from '../lib/axios';

interface HabitDayPopoverProps {
  date: Date;
  onCompletedChange: (completed: number) => void;
};

interface HabitsInfo {
  possibleHabits: {
    id: string;
    title: string;
    created_at: string;
  }[];
  completedHabits: string[];
};

export function HabitsList({ date, onCompletedChange }: HabitDayPopoverProps) {
  const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>();

  const isDateInThePast = dayjs(date).endOf('day').isBefore(new Date());

  useEffect(() => {
    api.get('day', {
      params: {
        date: date.toISOString(),
      }
    }).then(response => setHabitsInfo(response.data));
  }, []);

  async function handleToggleHabit(habitId: string) {
    await api.patch(`habits/${habitId}/toggle`);

    const isHabitAlreadyCompleted = habitsInfo!.completedHabits.includes(habitId);

    const completedHabits = isHabitAlreadyCompleted
      ? habitsInfo!.completedHabits.filter(id => id != habitId)
      : [...habitsInfo!.completedHabits, habitId];
    setHabitsInfo({
      completedHabits,
      possibleHabits: habitsInfo!.possibleHabits,
    });
    onCompletedChange(completedHabits.length);
  }
  return (
    <div className="mt-6 flex flex-col gap-3">
      {habitsInfo?.possibleHabits.map(habit => {
        return (
          <Checkbox.Root
            key={habit.id}
            defaultChecked={habitsInfo.completedHabits.includes(habit.id)}
            disabled={isDateInThePast}
            onCheckedChange={() => handleToggleHabit(habit.id)}
            className="flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed"
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors group-focus:ring-2 group-focus:ring-violet-600 group-focus:ring-offset-2 group-focus:ring-offset-background">
              <Checkbox.Indicator>
                <Check size={20} className="text-white" />
              </Checkbox.Indicator>
            </div>

            <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
              {habit.title}
            </span>
          </Checkbox.Root>
        )
      })}
    </div>
  );
}
