import { ComposePaneOverlay } from "@/components/ComposePaneOverlay"
import { KeyboardTooltip } from "@/components/KeyboardTooltip"
import { useEmails } from "@/hooks/dataHooks"
import { useEmailActions } from "@/hooks/useEmailActions"
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts"
import { useUIStore } from "@/hooks/useUIStore"
import { parseEmailBody } from "@/libs/emailUtils"
import { cn } from "@/libs/utils"
import {
	ArrowLeft,
	Check,
	ChevronDown,
	ChevronUp,
	Clock,
	Copy,
	Share,
} from "lucide-react"
import { useState } from "react"
import { EmailSenderDetailsPane } from "./EmailSenderDetailsPane"
import { TopActionsBar } from "./TopActionsBar"
import { Button } from "./ui/Button"

const EmailMessage = ({
	message,
	isCollapsed,
}: {
	message: EmailMessage
	isCollapsed: boolean
}) => {
	const { mainContent, quotedContent } = parseEmailBody(message.body)
	const [showQuoted, setShowQuoted] = useState(false)

	return (
		<div className="w-full rounded-lg bg-white py-2">
			<div>
				{isCollapsed ? (
					<p className="text-sm text-slate-500">{message.snippet}</p>
				) : (
					<>
						<div
							className="prose max-w-none text-sm"
							dangerouslySetInnerHTML={{
								__html: mainContent,
							}}
						/>
						{quotedContent && (
							<div className="mt-4">
								<button
									onClick={() => setShowQuoted(!showQuoted)}
									className="text-sm text-blue-500 hover:text-blue-600"
								>
									{showQuoted
										? "Hide quoted text"
										: "Show quoted text"}
								</button>
								<div
									className={cn(
										showQuoted ? "block" : "hidden"
									)}
								>
									<div
										className="prose max-w-none text-sm text-slate-500"
										dangerouslySetInnerHTML={{
											__html: quotedContent,
										}}
									/>
								</div>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	)
}

export const ViewEmailPane = () => {
	const { selectedFolder, selectedIndices, setSelectedIndex } = useUIStore()
	const selectedIndex = selectedIndices[selectedFolder?.id || "inbox"] || 0
	const { data: emails } = useEmails()
	const email = emails?.[selectedIndex]
	const { handleMarkDone } = useEmailActions(email?.id || "")
	const [showReplyPane, setShowReplyPane] = useState(false)
	const [selectedMessageIndex, setSelectedMessageIndex] = useState(0)
	const { isShowingEmail, setIsShowingEmail } = useUIStore()
	const [collapsedMessages, setCollapsedMessages] = useState<
		Record<number, boolean>
	>({})

	const handlePrevEmail = () => {
		if (selectedIndex > 0) {
			setSelectedIndex(selectedFolder?.id || "inbox", selectedIndex - 1)
		}
	}

	const handleNextEmail = () => {
		if (emails && selectedIndex < emails.length - 1) {
			setSelectedIndex(selectedFolder?.id || "inbox", selectedIndex + 1)
		}
	}

	useKeyboardShortcuts([
		{
			key: "r",
			handler: () => setShowReplyPane(true),
			mode: "email",
		},
		{
			key: "Escape",
			handler: () => setShowReplyPane(false),
			mode: "email",
		},
		{
			key: "o",
			handler: () => setCollapsedMessages({}),
			shift: true,
			mode: "email",
		},
	])

	const toggleMessage = (index: number) => {
		setCollapsedMessages((prev) => ({
			...prev,
			[index]: !prev[index],
		}))
	}

	if (!isShowingEmail) return null

	console.log(email)

	return (
		<div className="absolute inset-0 z-50 flex flex-row bg-white">
			<div className="flex w-1/5 flex-col bg-slate-50 p-4">
				<div className="flex flex-row gap-2">
					<KeyboardTooltip
						tooltips={[
							{
								keys: ["Esc"],
								label: "Close",
							},
						]}
						delayDuration={150}
					>
						<Button
							onClick={() => setIsShowingEmail(false)}
							variant="ghost"
							className="rounded-full bg-white shadow-md"
						>
							<ArrowLeft className="h-4 w-4" />
						</Button>
					</KeyboardTooltip>

					<div className="flex flex-row gap-2 rounded-full bg-white shadow-md">
						<KeyboardTooltip
							tooltips={[
								{
									keys: ["K"],
									label: "Previous conversation",
								},
							]}
							delayDuration={150}
						>
							<Button variant="ghost" onClick={handlePrevEmail}>
								<ChevronUp className="h-4 w-4" />
							</Button>
						</KeyboardTooltip>
						<KeyboardTooltip
							tooltips={[
								{
									keys: ["J"],
									label: "Next conversation",
								},
							]}
							delayDuration={150}
						>
							<Button variant="ghost" onClick={handleNextEmail}>
								<ChevronDown className="h-4 w-4" />
							</Button>
						</KeyboardTooltip>
					</div>
				</div>
			</div>
			<div className="flex w-3/5 flex-col overflow-y-auto border-b border-slate-200 p-4">
				<div className="flex flex-row items-center justify-between gap-2">
					<h1 className="text-xl">{email?.subject}</h1>

					<div className="flex items-center gap-2">
						<KeyboardTooltip
							tooltips={[
								{
									keys: ["⌘", "S"],
									label: "Share",
								},
							]}
						>
							<button className="rounded p-1 text-slate-400 hover:bg-blue-50 hover:text-blue-600">
								<Share className="h-4 w-4" />
							</button>
						</KeyboardTooltip>

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

				<div className="flex flex-col gap-2">
					{email?.messages.map((message, i) => (
						<div
							onClick={() => setSelectedMessageIndex(i)}
							className={cn(
								"flex h-fit flex-col rounded-lg bg-white px-8 py-2 shadow-md",
								i === selectedMessageIndex &&
									"-ml-[4px] border-l-[4px] border-blue-500"
							)}
						>
							<TopActionsBar
								message={message}
								setShowReplyPane={setShowReplyPane}
								isCollapsed={collapsedMessages[i]}
								onToggle={() => toggleMessage(i)}
							/>
							<EmailMessage
								message={message}
								isCollapsed={collapsedMessages[i]}
							/>
							{showReplyPane && (
								<ComposePaneOverlay
									isReply={true}
									replyToEmail={email}
								/>
							)}
						</div>
					))}
				</div>
			</div>
			<div className="flex w-1/5 flex-col bg-slate-50 p-4">
				<EmailSenderDetailsPane email={email} />
			</div>
		</div>
	)
}
