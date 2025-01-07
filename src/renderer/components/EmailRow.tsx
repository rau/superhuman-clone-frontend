import { ActionUndoToast } from "@/components/ActionUndoToast"
import { KeyboardTooltip } from "@/components/KeyboardTooltip"

import { useFolderEmails, useMarkEmailDone } from "@/hooks/dataHooks"
import { useComposeStore } from "@/hooks/useComposeStore"
import { useUIStore } from "@/hooks/useUIStore"
import { getUniqueSenderNames } from "@/libs/emailUtils"
import { cn, decodeHtml } from "@/libs/utils"
import { format } from "date-fns"
import { Check, Clock, Copy, Paperclip, SquareCheckBig } from "lucide-react"
import { toast } from "react-toastify"

interface EmailRowProps {
	email: EmailThread
	isSelected?: boolean
}

export const EmailRow = ({ email, isSelected }: EmailRowProps) => {
	const { setSelectedIndex, setIsShowingEmail } = useUIStore()
	const { data: emails } = useFolderEmails()
	const { mutateAsync: markDone } = useMarkEmailDone()
	const {
		selectedThreads,
		selectedFolder,
		toggleThreadSelection,
		setIsComposing,
	} = useUIStore()
	const isThreadSelected = selectedThreads[
		selectedFolder?.id || "INBOX"
	]?.has(email.id)
	const { reset, setDraftId } = useComposeStore()

	const handleClick = () => {
		if (!emails || !selectedFolder) return
		if (email.is_draft) {
			reset()
			setIsComposing(true)
			setDraftId(email.id)
			return
		} else {
			setSelectedIndex(selectedFolder.id, emails.indexOf(email))
			setIsShowingEmail(true)
		}
	}

	return (
		<div
			onClick={handleClick}
			className={cn(
				"group relative z-0 flex h-fit w-full max-w-full cursor-pointer items-center gap-4 overflow-hidden py-1 pr-2 hover:bg-slate-50"
			)}
		>
			<div
				className={cn(
					"absolute left-0 top-0 z-50 h-full w-[2px]",
					isSelected
						? isThreadSelected
							? "bg-white"
							: "bg-[#AFB1DC]"
						: "bg-transparent"
				)}
			/>
			<div
				className={cn(
					"absolute inset-0 transition-transform duration-300 ease-out",
					isThreadSelected
						? "translate-x-0 bg-[#54ACDB]"
						: isSelected
							? "translate-x-0 bg-[#F4F6FC]"
							: "-translate-x-full bg-[#F4F6FC]"
				)}
			/>
			<div className="relative flex w-full items-center gap-4 pl-3">
				<div className="flex w-10 flex-row items-center gap-2">
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
								"w-w h-4 cursor-pointer text-slate-50 hover:text-slate-200",
								isThreadSelected ? "block" : "hidden"
							)}
						/>
					</div>

					<div className="flex">
						<div
							className={cn(
								"h-2 w-2 rounded-full transition-all duration-200",
								email.starred
									? "scale-100 bg-yellow-400 opacity-100"
									: "scale-0 opacity-0"
							)}
						/>
						<div
							className={cn(
								"-ml-[1px] h-2 w-2 rounded-full transition-all duration-200",
								email.messages[0].read
									? "scale-0 opacity-0"
									: "scale-100 bg-blue-500 opacity-100"
							)}
						/>
					</div>
				</div>

				<div className="w-[250px] truncate">
					<span
						className={cn(
							"truncate text-xs font-medium",
							isThreadSelected && "text-white"
						)}
					>
						<span className="text-green-500">
							{email.is_draft && "Draft to "}
						</span>
						{getUniqueSenderNames(email.messages)}
					</span>
				</div>
				<div className="flex flex-1 gap-2 truncate">
					<span
						className={cn(
							"w-[350px] truncate text-xs",
							isThreadSelected && "text-white"
						)}
					>
						{email.subject}
					</span>
					<span
						className={cn(
							"truncate text-xs text-slate-500",
							isThreadSelected && "text-white"
						)}
					>
						{decodeHtml(email.snippet)}
					</span>
				</div>
				<div className="flex w-fit min-w-[100px] items-center justify-end">
					<div
						className={cn(
							"flex items-center gap-1",
							isSelected && !isThreadSelected && "hidden",
							"group-hover:hidden"
						)}
					>
						{email.messages.some(
							(m) => m.attachments?.length > 0
						) && <Paperclip className="h-3 w-3 text-slate-500" />}
						<span
							className={cn(
								"text-xs",
								isThreadSelected
									? "text-white"
									: "text-slate-500"
							)}
						>
							{new Date().toDateString() ===
							new Date(
								email.messages[email.messages.length - 1].date
							).toDateString()
								? format(
										email.messages[
											email.messages.length - 1
										].date,
										"h:mm a"
									)
								: format(
										email.messages[
											email.messages.length - 1
										].date,
										"LLL d"
									)}
						</span>
					</div>
					<div
						className={cn(
							"ml-4 hidden items-center gap-1",
							isSelected && !isThreadSelected
								? "flex"
								: "group-hover:flex"
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
									markDone([email]).then(() => {
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
								<Check
									className={cn(
										"h-4 w-4",
										isThreadSelected && "text-white"
									)}
								/>
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
								<Clock
									className={cn(
										"h-4 w-4",
										isThreadSelected && "text-white"
									)}
								/>
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
								<Copy
									className={cn(
										"h-4 w-4",
										isThreadSelected && "text-white"
									)}
								/>
							</button>
						</KeyboardTooltip>
					</div>
				</div>
			</div>
		</div>
	)
}
