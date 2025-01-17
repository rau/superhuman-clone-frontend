import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/Tooltip"
import { cn } from "@/libs/utils"

interface KeyboardTooltipProps {
	children: React.ReactNode
	tooltips: {
		keys: string[]
		label: string
	}[]
	delayDuration?: number
}

export const KeyboardTooltip = ({
	children,
	tooltips,
	delayDuration = 0,
}: KeyboardTooltipProps) => {
	return (
		<TooltipProvider delayDuration={delayDuration}>
			<Tooltip>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent className="flex flex-col gap-1 p-2">
					{tooltips.map((tooltip, i) => (
						<div key={i} className="flex items-center gap-2">
							<div className="flex items-center gap-1">
								{tooltip.keys.map((key, j) => (
									<kbd
										key={j}
										className={cn(
											"rounded border border-slate-200 px-1.5 py-0.5 text-xs font-medium",
											j !== tooltip.keys.length - 1 &&
												"mr-1"
										)}
									>
										{key}
									</kbd>
								))}
							</div>
							<span className="text-xs text-slate-300">
								{tooltip.label}
							</span>
						</div>
					))}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
