import { Dialog, DialogContent } from "@/components/ui/Dialog"
import { Label } from "@/components/ui/Label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup"
import { useUIStore } from "@/hooks/useUIStore"

export const ImageSettingsDialog = () => {
	const { isImageSettingsOpen, setIsImageSettingsOpen } = useUIStore()

	return (
		<Dialog
			open={isImageSettingsOpen}
			onOpenChange={setIsImageSettingsOpen}
		>
			<DialogContent className="w-[500px]">
				<div className="flex flex-col gap-6 p-6">
					<h2 className="text-xl font-semibold">Images</h2>
					<p className="text-sm text-slate-600">
						Choose which images to display. This setting also
						affects Superhuman on mobile.
					</p>
					<RadioGroup
						defaultValue="show-all"
						className="flex flex-col gap-4"
					>
						<div className="flex items-center gap-2">
							<RadioGroupItem value="show-all" id="show-all" />
							<Label htmlFor="show-all">Show all images</Label>
						</div>
						<div className="flex items-center gap-2">
							<RadioGroupItem
								value="block-tracking"
								id="block-tracking"
							/>
							<Label htmlFor="block-tracking">
								Block all known tracking pixels
							</Label>
						</div>
						<div className="flex items-center gap-2">
							<RadioGroupItem value="block-all" id="block-all" />
							<Label htmlFor="block-all">
								Block all remote images
							</Label>
						</div>
					</RadioGroup>
					<div className="flex items-center gap-2 text-sm text-slate-600">
						<span>To show blocked images in a message, hit</span>
						<div className="flex items-center gap-1">
							<kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-xs font-medium">
								⌘
							</kbd>
							<kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-xs font-medium">
								K
							</kbd>
						</div>
						<span>→ Show Images.</span>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}