import { useEffect, useState } from "react";

export type Theme = "light" | "dark";
const KEY = "randomness-lab-theme";

function applyTheme(t: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", t === "dark");
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => {
    const stored = (localStorage.getItem(KEY) as Theme | null) ?? "light";
    setTheme(stored);
    applyTheme(stored);
  }, []);
  const update = (t: Theme) => {
    setTheme(t);
    localStorage.setItem(KEY, t);
    applyTheme(t);
  };
  return { theme, setTheme: update, toggle: () => update(theme === "light" ? "dark" : "light") };
}
