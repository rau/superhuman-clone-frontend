"use client";

import { useThemeStore } from "@/hooks/useThemeStore";
import { useEffect } from "react";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	const { theme } = useThemeStore()

	useEffect(() => {
		const root = window.document.documentElement
		root.classList.remove("light", "dark")

		if (theme === "system") {
			const systemTheme = window.matchMedia(
				"(prefers-color-scheme: dark)"
			).matches
				? "dark"
				: "light"
			root.classList.add(systemTheme)
		} else {
			root.classList.add(theme)
		}
	}, [theme])

	return <>{children}</>
}
