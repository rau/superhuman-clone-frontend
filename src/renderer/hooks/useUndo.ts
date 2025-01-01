import { toast } from "react-toastify"
import {
	useMarkEmailRead,
	useStarEmail,
	useUndoMarkEmailDone,
} from "./dataHooks"
import { useEmailActionsStore } from "./useEmailActionsStore"

export const useUndo = () => {
	const { lastAction } = useEmailActionsStore()
	const { mutate: undoMarkEmailDone } = useUndoMarkEmailDone()
	const { mutate: starEmail } = useStarEmail()
	const { mutate: markEmailRead } = useMarkEmailRead()

	const handleUndo = () => {
		if (!lastAction) return

		switch (lastAction.type) {
			case "done":
				undoMarkEmailDone(lastAction.email)
				break
			case "star":
				starEmail({
					email: lastAction.email,
					star: lastAction.previousValue,
				})
				break
			case "read":
				markEmailRead({
					email: lastAction.email,
					read: lastAction.previousValue,
				})
				break
		}
		toast.dismiss()
	}

	return { handleUndo }
}
