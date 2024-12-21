import { useEmailActions } from "@/hooks/useEmailActions"
import { formatSender } from "@/libs/stringOps"
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
				"group flex h-14 cursor-pointer items-center gap-4 border-b border-slate-100 px-4 hover:bg-slate-50",
				isSelected && "bg-blue-50"
			)}
		>
			{email.messages[0].read && (
				<div className="h-1 w-1 rounded-full bg-blue-500" />
			)}
			<div className="w-[300px]">
				<span className="truncate text-xs font-medium">
					{formatSender(email.messages[0].sender)}
				</span>
			</div>
			<div className="flex-1 overflow-hidden">
				<div className="flex flex-row gap-2">
					<span className="truncate text-xs font-medium">
						{email.subject}
					</span>
					<span className="truncate text-xs text-slate-500">
						{email.snippet}
					</span>
				</div>
			</div>
			<div className="flex w-[200px] items-center justify-end gap-2">
				<span className="text-xs text-slate-500">
					{format(email.messages[0].date, "LLL d")}
				</span>
				<div className="ml-4 hidden items-center gap-1 group-hover:flex">
					<KeyboardTooltip keys={["E"]} label="Mark done">
						<button
							onClick={handleMarkDone}
							className="rounded p-1 text-slate-400 hover:bg-green-50 hover:text-green-600"
						>
							<Check className="h-4 w-4" />
						</button>
					</KeyboardTooltip>

					<KeyboardTooltip keys={["H"]} label="Remind me">
						<button className="rounded p-1 text-slate-400 hover:bg-orange-50 hover:text-orange-600">
							<Clock className="h-4 w-4" />
						</button>
					</KeyboardTooltip>

					<KeyboardTooltip
						keys={["⌘", "K"]}
						label="Superhuman command"
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
