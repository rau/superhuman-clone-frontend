import { KeyboardTooltip } from "@/components/KeyboardTooltip"
import { Button } from "@/components/ui/Button"
import { Separator } from "@/components/ui/Separator"
import { useUIStore } from "@/hooks/useUIStore"
import { cn } from "@/libs/utils"
import { Calendar, CircleHelp, Gift, Settings } from "lucide-react"

export const SuperhumanFooter = () => {
	const { setIsSettingsOpen, isSettingsOpen } = useUIStore()

	return (
		<div className="mt-auto flex flex-col">
			<Separator />
			<div className="mt-2 flex flex-row items-center justify-between gap-2">
				<span className="text-sm font-medium text-slate-700">
					Superhuman
				</span>
				<div className="flex flex-row gap-0">
					<KeyboardTooltip
						tooltips={[
							{
								keys: ["?"],
								label: "Ask AI",
							},
						]}
					>
						<Button variant="ghost" size="icon">
							<span>AI</span>
						</Button>
					</KeyboardTooltip>
					<Button variant="ghost" size="icon">
						<Gift className="h-4 w-4" />
					</Button>
					<Button variant="ghost" size="icon">
						<CircleHelp className="h-4 w-4" />
					</Button>
					<Button variant="ghost" size="icon">
						<Calendar className="h-4 w-4" />
					</Button>
					<Button variant="ghost" size="icon">
						<Settings
							onClick={() => {
								setIsSettingsOpen(!isSettingsOpen)
							}}
							className={cn(
								"h-4 w-4",
								isSettingsOpen && "text-red-500"
							)}
						/>
					</Button>
				</div>
			</div>
		</div>
	)
}
