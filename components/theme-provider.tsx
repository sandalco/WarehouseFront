"use client"

import * as React from "react"

type Theme = "light" | "dark" | "purple" | "blue" | "green"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
}

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "warehouse-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(() => (localStorage?.getItem(storageKey) as Theme) || defaultTheme)

  React.useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark", "purple", "blue", "green")

    if (theme === "purple") {
      root.classList.add("purple")
    } else if (theme === "blue") {
      root.classList.add("blue")
    } else if (theme === "green") {
      root.classList.add("green")
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage?.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
