"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";  // import Next.js theme provider
import { type ThemeProviderProps } from "next-themes/dist/types";  // type for theme provider props

// wrapper component for theme provider
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;  // pass props to NextThemesProvider
}
