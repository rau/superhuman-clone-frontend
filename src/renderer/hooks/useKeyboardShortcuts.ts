import { useUIStore } from "@/hooks/useUIStore"
import { useEffect } from "react"

interface ShortcutConfig {
	key: string
	handler: (e: KeyboardEvent) => void
	meta?: boolean
	shift?: boolean
	ctrl?: boolean
	mode: ShortcutMode
}

export const useKeyboardShortcuts = (shortcuts: ShortcutConfig[]) => {
	const { isComposing, isSearching, isShowingEmail, isMoveToDialogOpen } =
		useUIStore()

	const getCurrentMode = (): ShortcutMode => {
		if (isMoveToDialogOpen) return "dialog"
		if (isComposing) return "compose"
		if (isSearching) return "search"
		if (isShowingEmail) return "email"
		return "global"
	}

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const currentMode = getCurrentMode()
			let handled = false

			shortcuts.forEach(({ key, handler, meta, shift, ctrl, mode }) => {
				if (handled) return
				if (
					mode !== currentMode &&
					(mode !== "global" || currentMode === "dialog")
				)
					return

				const metaMatch = meta ? e.metaKey : !e.metaKey
				const shiftMatch = shift ? e.shiftKey : !e.shiftKey
				const ctrlMatch = ctrl ? e.ctrlKey : !e.ctrlKey

				if (
					e.key.toLowerCase() === key.toLowerCase() &&
					metaMatch &&
					shiftMatch &&
					ctrlMatch
				) {
					e.preventDefault()
					e.stopPropagation()
					handler(e)
					handled = true
				}
			})
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [
		isComposing,
		isSearching,
		isShowingEmail,
		isMoveToDialogOpen,
		shortcuts,
	])
}
