import { Alert, ScrollView, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { BackButton } from '../components/BackButton';
import { ProgressBar } from '../components/ProgressBar';
import dayjs from 'dayjs';
import { CheckBox } from '../components/CheckBox';
import { useEffect, useState } from 'react';
import { Loading } from '../components/Loading';
import { api } from '../lib/axios';
import { generateProgessPercentage } from '../utils/generate-progress-percentage';
import { HabitsEmpty } from '../components/HabitsEmpty';
import clsx from 'clsx';

interface HabitParams {
  date: string;
};

interface HabitsInfo {
  possibleHabits: {
    id: string;
    title: string;
    created_at: string;
  }[];
  completedHabits: string[];
};

export function Habit() {
  const route = useRoute();
  const { date } = route.params as HabitParams;

  const [loading, setLoading] = useState<boolean>(true);
  const [habitsInfo, setHabitsInfo] = useState<HabitsInfo | null>(null);
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);

  const habitsProgress = habitsInfo?.possibleHabits.length
    ? generateProgessPercentage(habitsInfo?.possibleHabits.length, completedHabits.length)
    : 0;

  const parsedDate = dayjs(date);
  const isDayInThePast = parsedDate.endOf('day').isBefore(new Date());
  const dayOfTheWeek = parsedDate.format('dddd');
  const dayAndMonth = parsedDate.format('DD/MM');

  useEffect(() => {
    fechHabits();
  }, [])

  async function fechHabits() {
    try {
      setLoading(true);

      const response = await api.get('day', {
        params: { date }
      });
      setHabitsInfo(response.data);
      setCompletedHabits(response.data.completedHabits);
    } catch (err) {
      console.error(err);
      Alert.alert('Ops', 'Não foi possível carregar as informações de hábitos');
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleHabit(habitId: string) {
    try {
      await api.patch(`habits/${habitId}/toggle`);
      if (completedHabits.includes(habitId)) {
        setCompletedHabits(prevState => prevState.filter(id => id !== habitId));
      } else {
        setCompletedHabits(prevState => [...prevState, habitId]);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Ops', 'Não foi possível atualizar o status do hábito');
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfTheWeek}
        </Text>

        <Text className="text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>

        <ProgressBar progress={habitsProgress} />

        <View className={clsx('mt-6', {
          'opacity-50': isDayInThePast,
        })}>
          {habitsInfo?.possibleHabits ? habitsInfo?.possibleHabits.map(habit => (
            <CheckBox
              key={habit.id}
              title={habit.title}
              disabled={isDayInThePast}
              checked={completedHabits.includes(habit.id)}
              onPress={() => handleToggleHabit(habit.id)}
            />
          )) : <HabitsEmpty />}
        </View>

        {isDayInThePast && (
          <Text className="text-white mt-10 text-center">
            Você não pode editar hábitos de uma data passada
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
