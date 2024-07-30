import { create } from 'zustand'

export const useStore = create((set) => ({
  darkMode: true,
  // darkMode: localStorage.getItem("darkMode") === "true",
  toggleDarkMode: () =>
    set((state) => {
      const darkMode = !state.darkMode
      localStorage.setItem('darkMode', darkMode)
      return { darkMode }
    })
}))
