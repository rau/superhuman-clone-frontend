import { useUndo } from "@/hooks/useUndo"
import { toast } from "react-toastify"

export const ActionUndoToast = ({ action }: { action: string }) => {
	const { handleUndo } = useUndo()

	return (
		<div className="flex w-full flex-row items-center justify-between gap-2 border-l-2 border-green-500 pl-2">
			<p className="text-sm font-medium text-slate-900">{action}</p>
			<p
				className="text-sm font-medium uppercase text-blue-600 hover:cursor-pointer hover:text-blue-800"
				onClick={() => {
					handleUndo()
					toast.dismiss()
				}}
			>
				Undo
			</p>
		</div>
	)
}
