import { KeyboardTooltip } from "@/components/KeyboardTooltip"
import { UndoToast } from "@/components/ui/UndoToast"
import { useMarkEmailDone, useStarEmail } from "@/hooks/dataHooks"
import { getUniqueSenderNames } from "@/libs/stringOps"
import { cn, decodeHtml } from "@/libs/utils"
import { format } from "date-fns"
import { Check, Clock, Copy, Star } from "lucide-react"
import { toast } from "react-toastify"

interface EmailRowProps {
	email: EmailThread
	isSelected?: boolean
	onClick?: () => void
}

export const EmailRow = ({ email, isSelected, onClick }: EmailRowProps) => {
	const { mutate: handleMarkDone } = useMarkEmailDone()
	const { mutate: handleStar } = useStarEmail()

	return (
		<div
			onClick={onClick}
			className={cn(
				"group flex h-14 w-full max-w-full cursor-pointer items-center gap-4 border-b border-slate-100 px-4 hover:bg-slate-50",
				isSelected && "bg-blue-50"
			)}
		>
			<div
				className={cn(
					"h-1 w-1 rounded-full transition-all duration-200",
					email.messages[0].read
						? "scale-0 opacity-0"
						: "scale-100 bg-blue-500 opacity-100"
				)}
			/>
			<Star
				onClick={(e) => {
					e.stopPropagation()
					handleStar({ email: email, star: !email.starred })
				}}
				className={cn(
					"h-4 w-4 cursor-pointer transition-all duration-200",
					email.starred
						? "rotate-[720deg] scale-100 fill-yellow-400 text-yellow-400"
						: "scale-0"
				)}
			/>
			<div className="w-[300px] overflow-hidden truncate">
				<span className="truncate text-xs font-medium">
					{getUniqueSenderNames(email.messages)}
				</span>
			</div>
			<div className="flex flex-1 flex-row gap-2 overflow-hidden">
				<span className="w-full truncate text-xs font-medium">
					{email.subject}
				</span>
				<span className="truncate text-xs text-slate-500">
					{decodeHtml(email.snippet)}
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
							onClick={(e) => {
								e.stopPropagation()
								handleMarkDone(email)
								toast(<UndoToast />, {
									className:
										"px-2 w-[400px] border border-purple-600/40",
									closeButton: false,
								})
							}}
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
