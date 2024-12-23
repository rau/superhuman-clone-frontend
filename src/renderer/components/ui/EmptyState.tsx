import { AlertCircle } from "lucide-react"

export const EmptyState = () => {
	return (
		<div className="flex h-full flex-col items-center justify-center gap-4 p-8">
			<AlertCircle className="h-12 w-12 text-slate-300" />
			<div className="text-center">
				<h3 className="text-lg font-semibold text-slate-900">
					No emails found
				</h3>
				<p className="text-sm text-slate-500">This folder is empty</p>
			</div>
		</div>
	)
}
