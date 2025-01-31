import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog"
import { useSettingsStore } from "@/hooks/useSettingsStore"
import { useUIStore } from "@/hooks/useUIStore"

export const SignatureDialog = () => {
	const { isSignatureDialogOpen, setIsSignatureDialogOpen } = useUIStore()
	const { settings, setSettings } = useSettingsStore()

	return (
		<Dialog
			open={isSignatureDialogOpen}
			onOpenChange={setIsSignatureDialogOpen}
		>
			<DialogTitle hidden>Emoji</DialogTitle>
			<DialogContent className="w-[600px]">
				<div className="flex flex-col gap-6 p-6">
					<h2 className="text-xl font-semibold">Emoji</h2>
					<p className="text-sm text-slate-600">
						Choose a default skin tone for your emoji.
					</p>
					<div className="flex w-2/3 flex-row items-center justify-between"></div>
					<p className="text-sm text-slate-600">
						To use an emoji just type{" "}
						<kbd className="rounded border border-slate-200 bg-slate-50 px-1 py-0.5 text-xs font-medium">
							:
						</kbd>{" "}
						and then the emoji's name!
					</p>
				</div>
			</DialogContent>
		</Dialog>
	)
}
