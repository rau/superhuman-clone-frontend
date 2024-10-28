import { format } from "date-fns"
import { formatSender } from "@/libs/stringOps"
import { cn } from "@/libs/utils"

interface EmailRowProps {
	email: Email
	isSelected?: boolean
	onClick?: () => void
}

export const EmailRow = ({ email, isSelected, onClick }: EmailRowProps) => {
	return (
		<div
			onClick={onClick}
			className={cn(
				"grid h-14 cursor-pointer grid-cols-[200px_1fr_100px] items-center gap-4 border-b border-slate-100 px-4 hover:bg-slate-50",
				isSelected && "bg-blue-50"
			)}
		>
			<div className="flex items-center">
				<span className="truncate font-medium">
					{formatSender(email.sender)}
				</span>
			</div>
			<div className="flex flex-col overflow-hidden">
				<span className="truncate">{email.subject}</span>
				<span className="truncate text-sm text-slate-500">
					{email.snippet}
				</span>
			</div>
			<div className="flex items-center justify-end">
				<span className="text-xs text-slate-500">
					{format(email.date, "LLL d")}
				</span>
			</div>
		</div>
	)
}
