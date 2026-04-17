import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colorScheme as nativewindColorScheme } from "nativewind";

type Theme = "dark" | "light" | "system";

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "mobile-ui-theme",
}: { children: React.ReactNode; defaultTheme?: Theme; storageKey?: string }) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  useEffect(() => {
    AsyncStorage.getItem(storageKey).then((savedTheme) => {
      if (savedTheme) {
        setThemeState(savedTheme as Theme);
        if (savedTheme !== "system") {
           // Provide fallback integration 
        }
      }
    });
  }, [storageKey]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      setThemeState(newTheme);
      AsyncStorage.setItem(storageKey, newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};