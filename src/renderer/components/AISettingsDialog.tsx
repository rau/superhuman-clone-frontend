import { Button } from "@/components/ui/Button"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/Dialog"
import { useUIStore } from "@/hooks/useUIStore"

export const AISettingsDialog = () => {
	const { isAISettingsOpen, setIsAISettingsOpen } = useUIStore()

	return (
		<Dialog open={isAISettingsOpen} onOpenChange={setIsAISettingsOpen}>
			<DialogContent className="sm:max-w-[600px]">
				<div className="flex flex-col gap-6 p-6">
					<h2 className="text-xl font-semibold">Write with AI</h2>
					<p className="text-sm text-slate-600">
						Superhuman AI writes best when it knows a little about
						you. Please enter your job title, company name, and
						company description.
					</p>
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<label className="text-sm font-medium">
								Job title:
							</label>
							<input className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
						</div>
						<div className="flex flex-col gap-2">
							<label className="text-sm font-medium">
								Company name:
							</label>
							<input className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
						</div>
						<div className="flex flex-col gap-2">
							<label className="text-sm font-medium">
								Company description:
							</label>
							<input className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
						</div>
						<div className="flex flex-col gap-2">
							<label className="text-sm font-medium">
								Greeting:
							</label>
							<input className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
						</div>
						<div className="flex flex-col gap-2">
							<label className="text-sm font-medium">
								Signoff:
							</label>
							<input className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
						</div>
					</div>
				</div>
				<DialogFooter className="px-6 pb-6">
					<Button
						variant="ghost"
						onClick={() => setIsAISettingsOpen(false)}
					>
						Cancel
					</Button>
					<Button onClick={() => setIsAISettingsOpen(false)}>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
