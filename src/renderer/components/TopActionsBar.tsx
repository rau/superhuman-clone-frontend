import { KeyboardTooltip } from "@/components/KeyboardTooltip"
import { useUIStore } from "@/hooks/useUIStore"
import { formatEmailParticipant, formatRecipients } from "@/libs/emailUtils"
import { decodeHtml } from "@/libs/utils"
import { format } from "date-fns"
import {
	ArrowLeft,
	ArrowLeftToLine,
	ArrowRight,
	ChevronDown,
	Minimize2,
} from "lucide-react"
import { useState } from "react"

interface TopActionsBarProps {
	index: number
	message: EmailMessage
	setShowReplyPane: (show: boolean) => void
	isCollapsed: boolean
}

export const TopActionsBar = ({
	index,
	message,
	setShowReplyPane,
	isCollapsed,
}: TopActionsBarProps) => {
	const { collapsedMessages, setCollapsedMessages } = useUIStore()
	const [showDetails, setShowDetails] = useState(false)
	const senderName = formatEmailParticipant(message.sender).split(" ")[0]
	const recipientText = formatRecipients(message)

	const onToggle = () => {
		const next: Record<number, boolean> = { ...collapsedMessages }
		next[index] = !collapsedMessages[index]
		setCollapsedMessages(next)
	}

	if (isCollapsed) {
		return (
			<div
				className="flex w-full flex-row items-center justify-between border-slate-200 py-1 hover:cursor-pointer"
				onClick={() => {
					onToggle()
				}}
			>
				<div className="flex w-[90%] items-center gap-2">
					<p className="w-[10%] min-w-[100px] text-sm text-slate-500">
						{senderName}
					</p>
					<p className="truncate text-sm text-slate-400">
						{decodeHtml(message.snippet)}
					</p>
				</div>
				<span className="w-fit text-xs font-light uppercase tracking-wider text-slate-500">
					{format(message.date || new Date(), "LLL d")}
				</span>
			</div>
		)
	}

	return (
		<div
			className="flex flex-row items-start justify-between gap-2 border-slate-200 hover:cursor-pointer"
			onClick={onToggle}
		>
			<div
				className="flex flex-row items-center gap-2"
				onClick={(e) => {
					e.stopPropagation()
					setShowDetails(true)
				}}
			>
				{showDetails ? (
					<div className="flex flex-col gap-1 text-sm text-slate-500">
						<div className="flex">
							<span className="w-12">From:</span>
							<span>
								{message.sender.name}{" "}
								{`<${message.sender.email}>`}
							</span>
						</div>
						<div className="flex">
							<span className="w-12">To:</span>
							<span>
								{message.to.to
									?.map(
										(r) =>
											`${r.name || r.email} <${r.email}>`
									)
									.join(", ")}
							</span>
						</div>
						{message.to?.cc && (
							<div className="flex">
								<span className="w-12">Cc:</span>
								<span>
									{message.to.cc
										.map(
											(r) =>
												`${r.name || r.email} <${r.email}>`
										)
										.join(", ")}
								</span>
							</div>
						)}
						<div className="flex">
							<span className="w-12">Date:</span>
							<span>
								{format(
									message.date || new Date(),
									"EEE, MMMM do, yyyy, 'at' h:mm a zzz"
								)}
							</span>
							<button
								onClick={(e) => {
									e.stopPropagation()
									setShowDetails(false)
								}}
								className="ml-2 rounded p-1 text-slate-400 hover:bg-slate-50"
							>
								<Minimize2 className="h-4 w-4" />
							</button>
						</div>
					</div>
				) : (
					<p className="text-sm text-slate-500">
						{senderName} {recipientText}
					</p>
				)}
				{!showDetails && (
					<button
						onClick={(e) => {
							e.stopPropagation()
							setShowDetails(!showDetails)
						}}
						className="rounded p-1 text-slate-400 hover:bg-slate-50"
					>
						<ChevronDown className="h-4 w-4" />
					</button>
				)}
			</div>

			<div className="flex items-center gap-4">
				<div className="flex items-center gap-1">
					<KeyboardTooltip
						tooltips={[{ keys: ["R"], label: "Reply" }]}
					>
						<button
							onClick={(e) => {
								e.stopPropagation()
								setShowReplyPane(true)
							}}
							className="rounded p-1 text-slate-400 hover:bg-slate-50"
						>
							<ArrowLeft className="h-4 w-4" />
						</button>
					</KeyboardTooltip>
					<KeyboardTooltip
						tooltips={[{ keys: ["R", "↵"], label: "Reply all" }]}
					>
						<button
							onClick={(e) => {
								e.stopPropagation()
								setShowReplyPane(true)
							}}
							className="rounded p-1 text-slate-400 hover:bg-slate-50"
						>
							<ArrowLeftToLine className="h-4 w-4" />
						</button>
					</KeyboardTooltip>
					<KeyboardTooltip
						tooltips={[{ keys: ["F"], label: "Forward" }]}
					>
						<button
							onClick={(e) => {
								e.stopPropagation()
								setShowReplyPane(true)
							}}
							className="rounded p-1 text-slate-400 hover:bg-slate-50"
						>
							<ArrowRight className="h-4 w-4" />
						</button>
					</KeyboardTooltip>
				</div>
				<KeyboardTooltip
					tooltips={[
						{
							keys: [],
							label: format(
								message.date || new Date(),
								"EEE, MMMM do, yyyy, 'at' h:mm a zzz"
							),
						},
					]}
				>
					<span
						className="text-xs font-light uppercase tracking-wider text-slate-500"
						onClick={(e) => {
							e.stopPropagation()
						}}
					>
						{format(message.date || new Date(), "LLL d")}
					</span>
				</KeyboardTooltip>
			</div>
		</div>
	)
}
