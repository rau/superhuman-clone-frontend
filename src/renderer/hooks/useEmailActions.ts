import { useEffect } from "react"
import { useMarkEmailDone } from "./dataHooks"
import { useUIStore } from "./useUIStore"

export const useEmailActions = (emailId: string) => {
	const { isShowingEmail, isComposing, isSearching } = useUIStore()
	const { mutate: markDone } = useMarkEmailDone()

	const handleMarkDone = () => {
		markDone(emailId)
	}

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (
				e.key.toLowerCase() === "e" &&
				!isComposing &&
				!isSearching &&
				!isShowingEmail
			) {
				console.log("marking done")
				console.log("isShowingEmail", isShowingEmail)
				console.log("isComposing", isComposing)
				console.log("isSearching", isSearching)
				// handleMarkDone()
			}
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [emailId])

	return { handleMarkDone }
}
