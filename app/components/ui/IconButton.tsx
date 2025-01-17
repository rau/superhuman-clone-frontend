import { KeyboardTooltip } from "@/components/KeyboardTooltip"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/Tooltip"
import { cn } from "@/libs/utils"
import { LucideIcon } from "lucide-react"
import { ComponentPropsWithoutRef } from "react"

interface IconButtonProps extends ComponentPropsWithoutRef<"button"> {
	icon: LucideIcon
	tooltipLabel?: string
	keyboardShortcuts?: Array<{
		keys: string[]
		label: string
	}>
	variant?: "default" | "danger" | "success" | "warning" | "inverse"
	size?: "sm" | "md"
}

export const IconButton = ({
	icon: Icon,
	tooltipLabel,
	keyboardShortcuts,
	variant = "default",
	size = "md",
	className,
	...props
}: IconButtonProps) => {
	const button = (
		<button
			className={cn(
				"rounded-md p-1 transition-colors duration-100",
				size === "sm" && "p-1",
				variant === "default" && "text-slate-400 hover:text-slate-900",
				variant === "danger" &&
					"text-slate-400 hover:bg-red-50 hover:text-red-600",
				variant === "success" &&
					"text-slate-400 hover:bg-green-50 hover:text-green-600",
				variant === "warning" &&
					"text-slate-400 hover:bg-orange-50 hover:text-orange-600",
				variant === "inverse" && "text-white hover:text-slate-200",
				props.disabled && "cursor-not-allowed opacity-50",
				className
			)}
			{...props}
			type={props.type || "button"}
		>
			<Icon className={cn("h-4 w-4", size === "sm" && "h-3 w-3")} />
		</button>
	)

	if (keyboardShortcuts) {
		return (
			<KeyboardTooltip tooltips={keyboardShortcuts} delayDuration={150}>
				{button}
			</KeyboardTooltip>
		)
	}

	if (tooltipLabel) {
		return (
			<Tooltip>
				<TooltipTrigger asChild>{button}</TooltipTrigger>
				<TooltipContent>{tooltipLabel}</TooltipContent>
			</Tooltip>
		)
	}

	return button
}
