import { useUIStore } from "@/hooks/useUIStore"
import { X } from "lucide-react"

export const TipBar = () => {
	const { isQuickTipsOpen, setIsQuickTipsOpen } = useUIStore()
	if (!isQuickTipsOpen) return null

	return (
		<div className="mt-auto flex h-[40px] items-center justify-center bg-slate-800 px-4 text-white">
			<div className="flex items-center gap-6">
				<span className="text-sm">Hit</span>
				<div className="flex items-center gap-6">
					<div className="flex items-center gap-2">
						<kbd className="rounded border border-slate-200 px-1.5 py-0.5 text-xs font-medium">
							E
						</kbd>
						<span className="text-slate-300">to Mark Done</span>
					</div>
					<div className="flex items-center gap-2">
						<kbd className="rounded border border-slate-200 px-1.5 py-0.5 text-xs font-medium">
							H
						</kbd>
						<span className="text-slate-300">
							to set a reminder
						</span>
					</div>
					<div className="flex items-center gap-2">
						<kbd className="rounded border border-slate-200 px-1.5 py-0.5 text-xs font-medium">
							C
						</kbd>
						<span className="text-slate-300">to compose</span>
					</div>
					<div className="flex items-center gap-2">
						<kbd className="rounded border border-slate-200 px-1.5 py-0.5 text-xs font-medium">
							/
						</kbd>
						<span className="text-slate-300">to search</span>
					</div>
				</div>
			</div>
			<button
				onClick={() => setIsQuickTipsOpen(false)}
				className="absolute right-4 rounded p-1 hover:bg-slate-700"
			>
				<X className="h-4 w-4" />
			</button>
		</div>
	)
}
