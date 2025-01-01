import { useUndoMarkEmailDone } from "@/hooks/dataHooks"
import { useEmailActionsStore } from "@/hooks/useEmailActionsStore"
import { toast } from "react-toastify"

export const UndoToast = () => {
	const { mutate: undoMarkEmailDone } = useUndoMarkEmailDone()
	const { lastDoneEmail } = useEmailActionsStore()

	return (
		<div className="flex w-full flex-row items-center justify-between gap-2 border-l-2 border-green-500 pl-2">
			<p className="text-sm font-medium text-slate-900">
				Marked as Done.
			</p>
			<p
				className="text-sm font-medium uppercase text-blue-600 hover:cursor-pointer hover:text-blue-800"
				onClick={() => {
					if (lastDoneEmail) {
						undoMarkEmailDone(lastDoneEmail)
						toast.dismiss()
					}
				}}
			>
				Undo
			</p>
		</div>
	)
}
