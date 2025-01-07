import { KeyboardTooltip } from "@/components/KeyboardTooltip"
import { IconButton } from "@/components/ui/IconButton"
import { Separator } from "@/components/ui/Separator"
import { useUIStore } from "@/hooks/useUIStore"
import { Calendar, CircleHelp, Gift, Settings } from "lucide-react"

export const SuperhumanFooter = () => {
	const { setIsSettingsOpen, isSettingsOpen } = useUIStore()

	return (
		<div className="mt-auto flex flex-col">
			{isSettingsOpen && <Separator />}
			<div className="mt-2 flex flex-row items-center justify-between gap-2">
				<span className="text-sm font-medium text-slate-700">
					Superhuman
				</span>
				<div className="flex flex-row items-center gap-0">
					<KeyboardTooltip
						tooltips={[
							{
								keys: ["?"],
								label: "Ask AI",
							},
						]}
					>
						<span className="mr-1 text-[16px] font-medium text-slate-400 transition-colors duration-100 hover:cursor-pointer hover:text-slate-900">
							ai
						</span>
					</KeyboardTooltip>

					<IconButton icon={Gift} />
					<IconButton icon={CircleHelp} />
					<IconButton icon={Calendar} />
					<IconButton
						icon={Settings}
						onClick={() => {
							setIsSettingsOpen(!isSettingsOpen)
						}}
					/>
				</div>
			</div>
		</div>
	)
}
