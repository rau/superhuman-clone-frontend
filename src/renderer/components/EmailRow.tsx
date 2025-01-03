import { ActionUndoToast } from "@/components/ActionUndoToast"
import { KeyboardTooltip } from "@/components/KeyboardTooltip"

import { useMarkEmailDone, useStarEmail } from "@/hooks/dataHooks"
import { useUIStore } from "@/hooks/useUIStore"
import { getUniqueSenderNames } from "@/libs/stringOps"
import { cn, decodeHtml } from "@/libs/utils"
import { format } from "date-fns"
import { Check, Clock, Copy, SquareCheckBig, Star } from "lucide-react"
import { toast } from "react-toastify"

interface EmailRowProps {
	email: EmailThread
	isSelected?: boolean
	onClick?: () => void
}

export const EmailRow = ({ email, isSelected, onClick }: EmailRowProps) => {
	const { mutateAsync: markDone } = useMarkEmailDone()
	const { mutate: handleStar } = useStarEmail()
	const { selectedThreads, selectedFolder, toggleThreadSelection } =
		useUIStore()
	const isThreadSelected = selectedThreads[
		selectedFolder?.id || "INBOX"
	]?.has(email.id)

	return (
		<div
			onClick={onClick}
			className="group relative flex h-fit w-full max-w-full cursor-pointer items-center gap-4 overflow-hidden border-b border-slate-100 px-2 py-2 hover:bg-slate-50"
		>
			<div
				className={cn(
					"absolute inset-0 transition-transform duration-300 ease-out",
					isThreadSelected
						? "translate-x-0 bg-blue-300"
						: isSelected
							? "translate-x-0 bg-blue-50"
							: "-translate-x-full bg-blue-50"
				)}
			/>
			<div className="relative flex w-full items-center gap-4">
				<div className="flex flex-row items-center gap-2">
					<div className="h-4 w-4">
						<SquareCheckBig
							onClick={(e) => {
								e.stopPropagation()
								toggleThreadSelection(
									selectedFolder?.id || "INBOX",
									email.id
								)
							}}
							className={cn(
								"h-4 w-4 cursor-pointer text-slate-50 hover:text-slate-200",
								isThreadSelected ? "block" : "hidden"
							)}
						/>
					</div>
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
				</div>

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
					<span
						className={cn(
							"text-xs text-slate-500",
							isSelected && "hidden"
						)}
					>
						{format(email.messages[0].date, "LLL d")}
					</span>
					<div
						className={cn(
							"ml-4 hidden items-center gap-1",
							isSelected ? "flex" : "group-hover:flex"
						)}
					>
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
									markDone(email).then(() => {
										toast(
											<ActionUndoToast action="Marked as Done" />,
											{
												className:
													"px-2 w-[400px] border border-purple-600/40",
												closeButton: false,
											}
										)
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
		</div>
	)
}
