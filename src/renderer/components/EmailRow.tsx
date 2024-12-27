import { useEmailActions } from "@/hooks/useEmailActions"
import { getUniqueSenderNames } from "@/libs/stringOps"
import { cn } from "@/libs/utils"
import { format } from "date-fns"
import { Check, Clock, Copy } from "lucide-react"
import { KeyboardTooltip } from "./KeyboardTooltip"

interface EmailRowProps {
	email: EmailThread
	isSelected?: boolean
	onClick?: () => void
}

export const EmailRow = ({ email, isSelected, onClick }: EmailRowProps) => {
	const { handleMarkDone } = useEmailActions(email.id)

	return (
		<div
			onClick={onClick}
			className={cn(
				"group flex h-14 w-full max-w-full cursor-pointer items-center gap-4 border-b border-slate-100 px-4 hover:bg-slate-50",
				isSelected && "bg-blue-50"
			)}
		>
			<div className="h-1 w-1">
				{!email.messages[0].read && (
					<div className="h-full w-full rounded-full bg-blue-500" />
				)}
			</div>
			<div className="w-[300px] overflow-hidden truncate">
				<span className="truncate text-xs font-medium">
					{getUniqueSenderNames(email.messages)}
				</span>
			</div>
			<div className="flex flex-1 flex-row gap-2 overflow-hidden">
				<span className="truncate text-xs font-medium">
					{email.subject}
				</span>
				<span className="truncate text-xs text-slate-500">
					{email.snippet}
				</span>
			</div>
			<div className="flex w-[200px] items-center justify-end gap-2">
				<span className="text-xs text-slate-500">
					{format(email.messages[0].date, "LLL d")}
				</span>
				<div className="ml-4 hidden items-center gap-1 group-hover:flex">
					<KeyboardTooltip
						tooltips={[
							{
								keys: ["E"],
								label: "Mark done",
							},
						]}
					>
						<button
							onClick={handleMarkDone}
							className="rounded p-1 text-slate-400 hover:bg-green-50 hover:text-green-600"
						>
							<Check className="h-4 w-4" />
						</button>
					</KeyboardTooltip>

					<KeyboardTooltip
						tooltips={[
							{
								keys: ["H"],
								label: "Remind me",
							},
						]}
					>
						<button className="rounded p-1 text-slate-400 hover:bg-orange-50 hover:text-orange-600">
							<Clock className="h-4 w-4" />
						</button>
					</KeyboardTooltip>

					<KeyboardTooltip
						tooltips={[
							{
								keys: ["⌘", "K"],
								label: "Superhuman command",
							},
						]}
					>
						<button className="rounded p-1 text-slate-400 hover:bg-blue-50 hover:text-blue-600">
							<Copy className="h-4 w-4" />
						</button>
					</KeyboardTooltip>
				</div>
			</div>
		</div>
	)
}
