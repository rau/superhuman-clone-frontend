import { Button } from "@/components/ui/Button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog"
import { Input } from "@/components/ui/Input"
import { useSettingsStore } from "@/hooks/useSettingsStore"
import { useUIStore } from "@/hooks/useUIStore"
import { useState } from "react"

export const InstantIntroDialog = () => {
	const { isInstantIntroDialogOpen, setIsInstantIntroDialogOpen } =
		useUIStore()
	const { settings, setSettings } = useSettingsStore()
	const [instantIntro, setInstantIntro] = useState(settings.instantIntro)

	return (
		<Dialog
			open={isInstantIntroDialogOpen}
			onOpenChange={setIsInstantIntroDialogOpen}
		>
			<DialogTitle hidden>Instant Intro</DialogTitle>
			<DialogContent className="w-[600px]">
				<div className="flex flex-col gap-2">
					<h2 className="text-xl font-semibold">Instant Intro</h2>

					<p className="text-xs text-slate-800">
						Do you get lots of introductions? Use Instant Intro to
						instantly move senders to BCC!
					</p>

					<Input
						placeholder="Enter an Instant Intro, e.g. 'Thanks {first_name}! (to BCC)'"
						value={instantIntro}
						onChange={(e) => setInstantIntro(e.target.value)}
					/>

					<p className="text-xs text-slate-500">
						To use Instant Intro, open a message and hit{" "}
						<kbd className="rounded-md border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-500">
							⌘
						</kbd>{" "}
						<kbd className="rounded-md border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-500">
							shift
						</kbd>{" "}
						<kbd className="rounded-md border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-500">
							i
						</kbd>{" "}
						.
					</p>
					<div className="flex w-full flex-row justify-end gap-2">
						<Button
							onClick={() => setIsInstantIntroDialogOpen(false)}
							variant={"ghost"}
							size={"sm"}
						>
							Cancel
						</Button>
						<Button
							onClick={() => {
								setSettings({
									instantIntro: instantIntro || "",
								})
								setIsInstantIntroDialogOpen(false)
							}}
							variant={"default"}
							size={"sm"}
						>
							Save
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
