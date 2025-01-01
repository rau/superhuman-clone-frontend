import {
	useMarkEmailRead,
	useSpamEmail,
	useStarEmail,
	useTrashEmail,
	useUndoMarkEmailDone,
} from "@/hooks/dataHooks"
import { useEmailActionsStore } from "@/hooks/useEmailActionsStore"
import { toast } from "react-toastify"

export const useUndo = () => {
	const { lastAction } = useEmailActionsStore()
	const { mutate: undoMarkEmailDone } = useUndoMarkEmailDone()
	const { mutate: starEmail } = useStarEmail()
	const { mutate: markEmailRead } = useMarkEmailRead()
	const { mutate: trashEmail } = useTrashEmail()
	const { mutate: spamEmail } = useSpamEmail()

	const handleUndo = () => {
		console.log("lastAction", lastAction)
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
			case "trash":
				trashEmail({
					email: lastAction.email,
					trash: false,
				})
				break
			case "spam":
				spamEmail({
					email: lastAction.email,
					spam: false,
				})
				break
		}
		toast.dismiss()
	}

	return { handleUndo }
}
