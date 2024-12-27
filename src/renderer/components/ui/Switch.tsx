import * as SwitchPrimitives from "@radix-ui/react-switch"
import * as React from "react"

import { cn } from "@/libs/utils"

const Switch = React.forwardRef<
	React.ElementRef<typeof SwitchPrimitives.Root>,
	React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
		variant?: "default" | "small"
	}
>(({ className, variant = "default", ...props }, ref) => (
	<SwitchPrimitives.Root
		className={cn(
			"peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
			variant === "default"
				? "h-6 w-11 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
				: "h-4 w-8 data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-slate-200",
			className
		)}
		{...props}
		ref={ref}
	>
		<SwitchPrimitives.Thumb
			className={cn(
				"pointer-events-none block rounded-full shadow-lg ring-0 transition-transform",
				variant === "default"
					? "h-5 w-5 bg-background data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
					: "h-3 w-3 bg-white data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
			)}
		/>
	</SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
