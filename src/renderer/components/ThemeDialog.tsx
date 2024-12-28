import { Dialog, DialogContent } from "@/components/ui/Dialog"
import { Label } from "@/components/ui/Label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup"
import { useUIStore } from "@/hooks/useUIStore"

export const ThemeDialog = () => {
	const { isThemeDialogOpen, setIsThemeDialogOpen } = useUIStore()

	return (
		<Dialog open={isThemeDialogOpen} onOpenChange={setIsThemeDialogOpen}>
			<DialogContent className="w-[500px]">
				<div className="flex flex-col gap-6 p-6">
					<h2 className="text-xl font-semibold">Theme</h2>
					<RadioGroup
						defaultValue="snow"
						className="flex flex-col gap-4"
					>
						<div className="flex items-center gap-2">
							<RadioGroupItem value="snow" id="snow" />
							<Label htmlFor="snow">Snow</Label>
						</div>
						<div className="flex items-center gap-2">
							<RadioGroupItem value="carbon" id="carbon" />
							<Label htmlFor="carbon">Carbon</Label>
						</div>
						<div className="flex items-center gap-2">
							<RadioGroupItem
								value="match-macos"
								id="match-macos"
							/>
							<Label htmlFor="match-macos">Match macOS</Label>
						</div>
					</RadioGroup>
					<p className="text-sm text-slate-600">
						The Carbon theme can help reduce eyestrain and is best
						used in low light conditions.
					</p>
				</div>
			</DialogContent>
		</Dialog>
	)
}
