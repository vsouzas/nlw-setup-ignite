import clsx from 'clsx';
import dayjs from 'dayjs';
import { Dimensions, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { generateProgessPercentage } from '../utils/generate-progress-percentage';

const WEEK_DAYS = 7;
const SCREEN_HORIZONTAL_PADDING = (32 * 2) / 5;

export const DAY_MARGIN_BETWEEN = 8;
export const DAY_SIZE = (Dimensions.get('screen').width / WEEK_DAYS) - (SCREEN_HORIZONTAL_PADDING + 5);

interface HabitDayProps extends TouchableOpacityProps {
  amountOfHabits?: number;
  completedHabits?: number;
  date: Date;
};

export function HabitDay({ amountOfHabits = 0, completedHabits = 0, date, ...rest }: HabitDayProps) {
  const completedPercentage = amountOfHabits > 0 ? generateProgessPercentage(amountOfHabits, completedHabits) : 0;
  const today = dayjs().startOf('day').toDate();
  const isCurrentDay = dayjs(date).isSame(today);
 
  return (
    <TouchableOpacity
      className={clsx('rounded-lg border-2 m-1', {
        'bg-violet-500 border-violet-400': completedPercentage >= 80,
        'bg-violet-600 border-violet-500': completedPercentage >= 60 && completedPercentage < 80,
        'bg-violet-700 border-violet-500': completedPercentage >= 40 && completedPercentage < 60,
        'bg-violet-800 border-violet-600': completedPercentage >= 20 && completedPercentage < 40,
        'bg-violet-900 border-violet-700': completedPercentage > 0 && completedPercentage < 20,
        'bg-zinc-900 border-zinc-800': completedPercentage === 0,
        'border-white border-4': isCurrentDay,
      })}
      style={{ width: DAY_SIZE, height: DAY_SIZE }}
      activeOpacity={0.7}
      {...rest}
    />
  );
}
      // className="bg-zinc-900 border-zinc-800"
