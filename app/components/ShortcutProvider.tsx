"use client"

import { useAppShortcuts } from "@/hooks/useAppShortcuts"

const ShortcutProvider = ({ children }: { children: React.ReactNode }) => {
	useAppShortcuts()

	return <>{children}</>
}

export { ShortcutProvider }
