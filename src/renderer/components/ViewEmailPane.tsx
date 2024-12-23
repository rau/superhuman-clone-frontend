import { ComposePaneOverlay } from "@/components/ComposePaneOverlay"
import { KeyboardTooltip } from "@/components/KeyboardTooltip"
import { useEmails } from "@/hooks/dataHooks"
import { useEmailActions } from "@/hooks/useEmailActions"
import { useUIStore } from "@/hooks/useUIStore"
import { formatSender } from "@/libs/stringOps"
import { cn } from "@/libs/utils"
import { format } from "date-fns"
import {
	ArrowDown,
	ArrowLeft,
	ArrowLeftToLine,
	ArrowRight,
	ArrowUp,
	Check,
	Clock,
	Copy,
	Share,
} from "lucide-react"
import { useEffect, useState } from "react"

interface TopActionsBarProps {
	sender: EmailSender
	date: Date
	setShowReplyPane: (show: boolean) => void
}

const TopActionsBar = ({
	sender,
	date,
	setShowReplyPane,
}: TopActionsBarProps) => {
	return (
		<div className="flex items-center justify-between border-slate-200 py-2">
			<p className="font-semibold">{formatSender(sender)}</p>

			<div className="flex items-center gap-4">
				<div className="flex items-center gap-1">
					<KeyboardTooltip keys={["R"]} label="Reply">
						<button
							onClick={() => setShowReplyPane(true)}
							className="rounded p-1 text-slate-400 hover:bg-slate-50"
						>
							<ArrowLeft className="h-4 w-4" />
						</button>
					</KeyboardTooltip>

					<KeyboardTooltip keys={["R", "↵"]} label="Reply all">
						<button className="rounded p-1 text-slate-400 hover:bg-slate-50">
							<ArrowLeftToLine className="h-4 w-4" />
						</button>
					</KeyboardTooltip>

					<KeyboardTooltip keys={["F"]} label="Forward">
						<button className="rounded p-1 text-slate-400 hover:bg-slate-50">
							<ArrowRight className="h-4 w-4" />
						</button>
					</KeyboardTooltip>
				</div>
				<KeyboardTooltip
					label={format(date, "EEE, MMMM do, yyyy, 'at' h:mm a zzz")}
					keys={[]}
				>
					<span className="text-xs font-light uppercase tracking-wider text-slate-500">
						{format(date, "LLL d")}
					</span>
				</KeyboardTooltip>
			</div>
		</div>
	)
}

interface ViewEmailPaneProps {
	emailIndex: number
	setSelectedIndex: (index: number) => void
}

export const ViewEmailPane = ({
	emailIndex,
	setSelectedIndex,
}: ViewEmailPaneProps) => {
	const { data: emails } = useEmails()
	const email = emails?.[emailIndex]
	const { handleMarkDone } = useEmailActions(email?.id || "")
	const [showReplyPane, setShowReplyPane] = useState(false)
	const [selectedMessageIndex, setSelectedMessageIndex] = useState(0)
	const { setIsShowingEmail } = useUIStore()

	const handlePrevEmail = () => {
		if (emailIndex > 0) {
			setSelectedIndex(emailIndex - 1)
		}
	}

	const handleNextEmail = () => {
		if (emails && emailIndex < emails.length - 1) {
			setSelectedIndex(emailIndex + 1)
		}
	}

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (
				e.key.toLowerCase() === "r" &&
				!e.metaKey &&
				!e.ctrlKey &&
				!showReplyPane
			) {
				e.preventDefault()
				setShowReplyPane(true)
			}
			if (e.key === "Escape" && showReplyPane) {
				e.preventDefault()
				setShowReplyPane(false)
			}
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [showReplyPane])

	return (
		<div className="absolute inset-0 z-50 flex flex-row bg-white">
			<div className="flex w-32 flex-col items-center bg-slate-50 py-4">
				<div className="flex flex-col gap-2">
					<button
						onClick={() => setIsShowingEmail(false)}
						className="rounded-full bg-white p-2 text-slate-500 shadow-md hover:bg-slate-100"
					>
						<ArrowLeft className="h-4 w-4" />
					</button>

					<div className="flex flex-col rounded-full bg-white shadow-md">
						<KeyboardTooltip keys={["K"]} label="Previous email">
							<button
								onClick={handlePrevEmail}
								className="rounded-t-full p-2 text-slate-500 hover:bg-slate-100"
							>
								<ArrowUp className="h-4 w-4" />
							</button>
						</KeyboardTooltip>
						<KeyboardTooltip keys={["J"]} label="Next email">
							<button
								onClick={handleNextEmail}
								className="rounded-b-full p-2 text-slate-500 hover:bg-slate-100"
							>
								<ArrowDown className="h-4 w-4" />
							</button>
						</KeyboardTooltip>
					</div>
				</div>
			</div>
			<div className="flex w-full flex-col border-b border-slate-200 p-4">
				<div className="flex flex-row items-center justify-between gap-2">
					<h1 className="text-2xl font-semibold">{email?.subject}</h1>

					<div className="flex items-center gap-2">
						<KeyboardTooltip keys={["⌘", "S"]} label="Share">
							<button className="rounded p-1 text-slate-400 hover:bg-blue-50 hover:text-blue-600">
								<Share className="h-4 w-4" />
							</button>
						</KeyboardTooltip>

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

				<div className="py-4">
					<span className="text-sm text-slate-500">AI Summary</span>
				</div>

				{email?.messages.map((message, i) => (
					<div
						onClick={() => setSelectedMessageIndex(i)}
						className={cn(
							"flex h-fit flex-col rounded-lg bg-white px-8 py-2 shadow-md",
							i === selectedMessageIndex &&
								"border-l-4 border-blue-500"
						)}
					>
						<TopActionsBar
							sender={message.sender || { email: "" }}
							date={message.date || new Date()}
							setShowReplyPane={setShowReplyPane}
						/>
						<div className="w-full rounded-lg bg-white py-2">
							<p className="text-sm">{message?.snippet}</p>
						</div>
						{showReplyPane && (
							<ComposePaneOverlay
								isReply={true}
								replyToEmail={message}
							/>
						)}
					</div>
				))}
			</div>
		</div>
	)
}
