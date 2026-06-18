import React, { createContext, useContext, useState } from 'react';

export interface OnboardingData {
  bodyType: string | null;      // e.g. 'muscular_male'
  bodyTypeLabel: string | null; // e.g. 'Muscular Male'
}

interface OnboardingContextValue extends OnboardingData {
  setBodyType: (id: string, label: string) => void;
  reset: () => void;
}

const initial: OnboardingData = {
  bodyType: null,
  bodyTypeLabel: null,
};

const Ctx = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<OnboardingData>(initial);

  const setBodyType = (id: string, label: string) =>
    setData({ bodyType: id, bodyTypeLabel: label });

  const reset = () => setData(initial);

  return (
    <Ctx.Provider value={{ ...data, setBodyType, reset }}>
      {children}
    </Ctx.Provider>
  );
}

export function useOnboarding() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useOnboarding must be used inside <OnboardingProvider>');
  return v;
}
