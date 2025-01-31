import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select"
import { AutoAdvanceBehavior, useSettingsStore } from "@/hooks/useSettingsStore"
import { useUIStore } from "@/hooks/useUIStore"

const autoAdvanceOptions = [
	{ label: "go down and show the older conversation", value: "older" },
	{ label: "go back to the list of conversations", value: "list" },
	{ label: "go up and show the newer conversation", value: "newer" },
]

export const AutoAdvanceDialog = () => {
	const { isAutoAdvanceDialogOpen, setIsAutoAdvanceDialogOpen } = useUIStore()
	const { settings, setSettings } = useSettingsStore()

	return (
		<Dialog
			open={isAutoAdvanceDialogOpen}
			onOpenChange={setIsAutoAdvanceDialogOpen}
		>
			<DialogTitle hidden>Auto Advance</DialogTitle>
			<DialogContent className="w-[600px]">
				<div className="flex flex-col gap-4">
					<h2 className="text-xl font-semibold">Auto Advance</h2>
					<p className="text-xs text-slate-800">
						Choose where you go after triaging a conversation (e.g.
						Mark Done, Remind me, Trash).
					</p>
					<div className="flex h-fit flex-row items-center gap-2">
						<p className="text-xs text-slate-600">
							After triaging a conversation:
						</p>
						<Select
							value={settings.autoAdvanceBehavior}
							onValueChange={(value) =>
								setSettings({
									autoAdvanceBehavior:
										value as AutoAdvanceBehavior,
								})
							}
						>
							<SelectTrigger className="h-2 w-fit border-none text-xs text-slate-600">
								<SelectValue
									placeholder={
										autoAdvanceOptions.find(
											(option) =>
												option.value ===
												settings.autoAdvanceBehavior
										)?.label
									}
								/>
							</SelectTrigger>
							<SelectContent>
								{autoAdvanceOptions.map((option) => (
									<SelectItem
										key={option.value}
										value={option.value}
									>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
