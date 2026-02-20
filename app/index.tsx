import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { TitleScreen } from '../ui/title-screen';

export default function Page() {
  const router = useRouter();

  const handleStart = useCallback(
    (_className: string) => {
      router.push('/game');
    },
    [router],
  );

  const handleContinue = useCallback(() => {
    router.push('/game');
  }, [router]);

  return <TitleScreen onStart={handleStart} onContinue={handleContinue} hasSaveData={false} />;
}
