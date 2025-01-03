import {
	useMarkEmailRead,
	useModifyLabels,
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
	const { mutate: modifyLabels } = useModifyLabels()

	const handleUndo = () => {
		if (!lastAction) return

		switch (lastAction.type) {
			case "done":
				undoMarkEmailDone(lastAction.emails)
				break
			case "star":
				starEmail({
					emails_input: lastAction.emails,
					star: lastAction.previousValues[0],
				})
				break
			case "read":
				markEmailRead({
					emails_input: lastAction.emails,
					read: lastAction.previousValues[0],
				})
				break
			case "trash":
				trashEmail({
					emails_input: lastAction.emails,
					trash: false,
				})
				break
			case "spam":
				spamEmail({
					emails_input: lastAction.emails,
					spam: false,
				})
				break
			case "modifyLabels":
				modifyLabels({
					threads: lastAction.emails,
					addLabels: lastAction.previousValues[1],
					removeLabels: lastAction.previousValues[0],
				})
				break
		}
		toast.dismiss()
	}

	return { handleUndo }
}
