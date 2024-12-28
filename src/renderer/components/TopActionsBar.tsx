import { KeyboardTooltip } from "@/components/KeyboardTooltip"
import { formatEmailParticipant, formatRecipients } from "@/libs/emailUtils"
import { format } from "date-fns"
import {
	ArrowLeft,
	ArrowLeftToLine,
	ArrowRight,
	ChevronDown,
	ChevronUp,
} from "lucide-react"
import { useState } from "react"

interface TopActionsBarProps {
	message: EmailMessage
	setShowReplyPane: (show: boolean) => void
	isCollapsed: boolean
	onToggle: () => void
}

export const TopActionsBar = ({
	message,
	setShowReplyPane,
	isCollapsed,
	onToggle,
}: TopActionsBarProps) => {
	const [showDetails, setShowDetails] = useState(false)
	const senderName = formatEmailParticipant(message.sender)
	const recipientText = formatRecipients(message)

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between border-slate-200 py-2">
				<div className="flex items-center gap-2">
					<button
						onClick={onToggle}
						className="rounded p-1 text-slate-400 hover:bg-slate-50"
					>
						{isCollapsed ? (
							<ChevronUp className="h-4 w-4" />
						) : (
							<ChevronDown className="h-4 w-4" />
						)}
					</button>
					<div className="flex items-center gap-2">
						<p className="text-sm text-slate-500">
							{senderName} {recipientText}
						</p>
						<button
							onClick={() => setShowDetails(!showDetails)}
							className="rounded p-1 text-slate-400 hover:bg-slate-50"
						>
							{showDetails ? (
								<ChevronUp className="h-4 w-4" />
							) : (
								<ChevronDown className="h-4 w-4" />
							)}
						</button>
					</div>
				</div>

				<div className="flex items-center gap-4">
					<div className="flex items-center gap-1">
						<KeyboardTooltip
							tooltips={[{ keys: ["R"], label: "Reply" }]}
						>
							<button
								onClick={() => setShowReplyPane(true)}
								className="rounded p-1 text-slate-400 hover:bg-slate-50"
							>
								<ArrowLeft className="h-4 w-4" />
							</button>
						</KeyboardTooltip>
						<KeyboardTooltip
							tooltips={[
								{ keys: ["R", "↵"], label: "Reply all" },
							]}
						>
							<button className="rounded p-1 text-slate-400 hover:bg-slate-50">
								<ArrowLeftToLine className="h-4 w-4" />
							</button>
						</KeyboardTooltip>
						<KeyboardTooltip
							tooltips={[{ keys: ["F"], label: "Forward" }]}
						>
							<button className="rounded p-1 text-slate-400 hover:bg-slate-50">
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
						<span className="text-xs font-light uppercase tracking-wider text-slate-500">
							{format(message.date || new Date(), "LLL d")}
						</span>
					</KeyboardTooltip>
				</div>
			</div>

			{showDetails && (
				<div className="flex flex-col gap-1 px-8 text-sm text-slate-500">
					<div className="flex">
						<span className="w-12">From:</span>
						<span>
							{message.sender.name} {`<${message.sender.email}>`}
						</span>
					</div>
					<div className="flex">
						<span className="w-12">To:</span>
						<span>
							{message.to.to
								?.map(
									(r) => `${r.name || r.email} <${r.email}>`
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
					</div>
				</div>
			)}
		</div>
	)
}
