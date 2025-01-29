import { Button } from "@/components/ui/Button"
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTitle,
} from "@/components/ui/Dialog"
import { useSettingsStore } from "@/hooks/useSettingsStore"
import { useUIStore } from "@/hooks/useUIStore"

export const AISettingsDialog = () => {
	const { isAISettingsOpen, setIsAISettingsOpen } = useUIStore()
	const { settings, setSettings } = useSettingsStore()

	return (
		<Dialog open={isAISettingsOpen} onOpenChange={setIsAISettingsOpen}>
			<DialogTitle hidden>Write with AI</DialogTitle>
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
							<input
								className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
								value={settings.jobTitle}
								onChange={(e) =>
									setSettings({ jobTitle: e.target.value })
								}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<label className="text-sm font-medium">
								Company name:
							</label>
							<input
								className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
								value={settings.company}
								onChange={(e) =>
									setSettings({ company: e.target.value })
								}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<label className="text-sm font-medium">
								Company description:
							</label>
							<input
								className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
								value={settings.companyDescription}
								onChange={(e) =>
									setSettings({
										companyDescription: e.target.value,
									})
								}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<label className="text-sm font-medium">
								Greeting:
							</label>
							<input
								className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
								value={settings.greeting}
								onChange={(e) =>
									setSettings({ greeting: e.target.value })
								}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<label className="text-sm font-medium">
								Signoff:
							</label>
							<input
								className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
								value={settings.signature}
								onChange={(e) =>
									setSettings({ signature: e.target.value })
								}
							/>
						</div>
					</div>
				</div>
				<DialogFooter className="px-6 pb-6">
					<Button
						onClick={() => setIsAISettingsOpen(false)}
						variant={"destructive"}
					>
						Cancel
					</Button>
					<Button
						onClick={() => setIsAISettingsOpen(false)}
						variant={"default"}
					>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
