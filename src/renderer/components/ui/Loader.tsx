import { cn } from "@/libs/utils"

export const Loader = ({ className }: { className?: string }) => (
	<div className={cn("flex items-center justify-center", className)}>
		<div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600" />
	</div>
)
