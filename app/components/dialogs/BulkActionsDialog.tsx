import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog"
import { useUIStore } from "@/hooks/useUIStore"

export const BulkActionsDialog = () => {
	const { isBulkActionsOpen, setIsBulkActionsOpen } = useUIStore()

	return (
		<Dialog open={isBulkActionsOpen} onOpenChange={setIsBulkActionsOpen}>
			<DialogTitle hidden>Bulk Actions</DialogTitle>
			<DialogContent className="w-[700px]">
				<div className="flex flex-col gap-4">
					<h2 className="text-lg font-semibold">Bulk Actions</h2>
					<div className="flex flex-col gap-2">
						<p className="text-xs text-slate-700">
							There are no recent bulk actions.
						</p>
					</div>

					<p className="text-xs text-slate-500">
						Would you like to clean up your inbox? Hit{" "}
						<kbd className="rounded-md border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-500">
							⌘
						</kbd>{" "}
						<kbd className="rounded-md border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-500">
							K
						</kbd>{" "}
						and Get Me To Zero.
					</p>
				</div>
			</DialogContent>
		</Dialog>
	)
}
