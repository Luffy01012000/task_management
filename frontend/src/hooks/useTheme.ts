import { ThemeContext, type ThemeContextValue } from '../context/ThemeContext'
import { useContext } from 'react'

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
