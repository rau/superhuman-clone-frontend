import { X } from "lucide-react"
import { useState } from "react"

export const TipBar = () => {
	const [isVisible, setIsVisible] = useState(true)

	if (!isVisible) return null

	return (
		<div className="fixed bottom-0 left-0 right-0 z-50 flex h-12 items-center justify-center bg-slate-800 px-4 text-white">
			<div className="flex items-center gap-6">
				<span className="text-sm">Hit</span>
				<div className="flex items-center gap-6">
					<div className="flex items-center gap-2">
						<kbd className="rounded bg-slate-700 px-2 py-1 text-sm">
							E
						</kbd>
						<span className="text-slate-300">to Mark Done</span>
					</div>
					<div className="flex items-center gap-2">
						<kbd className="rounded bg-slate-700 px-2 py-1 text-sm">
							H
						</kbd>
						<span className="text-slate-300">
							to set a reminder
						</span>
					</div>
					<div className="flex items-center gap-2">
						<kbd className="rounded bg-slate-700 px-2 py-1 text-sm">
							C
						</kbd>
						<span className="text-slate-300">to compose</span>
					</div>
					<div className="flex items-center gap-2">
						<kbd className="rounded bg-slate-700 px-2 py-1 text-sm">
							/
						</kbd>
						<span className="text-slate-300">to search</span>
					</div>
				</div>
			</div>
			<button
				onClick={() => setIsVisible(false)}
				className="absolute right-4 rounded p-1 hover:bg-slate-700"
			>
				<X className="h-4 w-4" />
			</button>
		</div>
	)
}
