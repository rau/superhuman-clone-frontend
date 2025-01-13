import { Dialog, DialogContent } from "@/components/ui/Dialog"
import { Label } from "@/components/ui/Label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup"
import { useThemeStore } from "@/hooks/useThemeStore"
import { useUIStore } from "@/hooks/useUIStore"

export const ThemeDialog = () => {
	const { isThemeDialogOpen, setIsThemeDialogOpen } = useUIStore()
	const { theme, setTheme } = useThemeStore()

	return (
		<Dialog open={isThemeDialogOpen} onOpenChange={setIsThemeDialogOpen}>
			<DialogContent className="w-[500px]">
				<div className="flex flex-col gap-6 p-6">
					<h2 className="text-xl font-semibold">Theme</h2>
					<RadioGroup
						defaultValue={theme}
						className="flex flex-col gap-4"
						onValueChange={(value) =>
							setTheme(value as "light" | "dark" | "system")
						}
					>
						<div className="flex items-center gap-2">
							<RadioGroupItem value="light" id="light" />
							<Label htmlFor="light">Snow</Label>
						</div>
						<div className="flex items-center gap-2">
							<RadioGroupItem value="dark" id="dark" />
							<Label htmlFor="dark">Carbon</Label>
						</div>
						<div className="flex items-center gap-2">
							<RadioGroupItem value="system" id="system" />
							<Label htmlFor="system">Match MacOS</Label>
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
