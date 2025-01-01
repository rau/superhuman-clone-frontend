import {
	useMarkEmailRead,
	useStarEmail,
	useUndoMarkEmailDone,
} from "@/hooks/dataHooks"
import { useEmailActionsStore } from "@/hooks/useEmailActionsStore"
import { toast } from "react-toastify"

export const ActionUndoToast = ({ action }: { action: string }) => {
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

	return (
		<div className="flex w-full flex-row items-center justify-between gap-2 border-l-2 border-green-500 pl-2">
			<p className="text-sm font-medium text-slate-900">{action}</p>
			<p
				className="text-sm font-medium uppercase text-blue-600 hover:cursor-pointer hover:text-blue-800"
				onClick={handleUndo}
			>
				Undo
			</p>
		</div>
	)
}
