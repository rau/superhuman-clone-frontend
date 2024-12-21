import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/Tooltip"

export const KeyboardTooltip = ({
	children,
	keys,
	label,
	delayDuration,
}: {
	children: React.ReactNode
	keys: string[]
	label: string
	delayDuration?: number
}) => (
	<Tooltip delayDuration={delayDuration}>
		<TooltipTrigger asChild>{children}</TooltipTrigger>
		<TooltipContent>
			<div className="flex items-center gap-2">
				<div className="flex items-center gap-1">
					<span className="text-slate-200">{label}</span>
					{keys.map((key) => (
						<kbd
							key={key}
							className="rounded bg-slate-800 px-1.5 py-0.5 text-xs"
						>
							{key}
						</kbd>
					))}
				</div>
			</div>
		</TooltipContent>
	</Tooltip>
)
