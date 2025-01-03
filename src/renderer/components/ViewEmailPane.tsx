import { ComposePaneOverlay } from "@/components/ComposePaneOverlay"
import { EmailSenderDetailsPane } from "@/components/EmailSenderDetailsPane"
import { KeyboardTooltip } from "@/components/KeyboardTooltip"
import { TopActionsBar } from "@/components/TopActionsBar"
import { Button } from "@/components/ui/Button"
import { useFolderEmails, useMarkEmailDone } from "@/hooks/dataHooks"
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
	Ellipsis,
	Share,
} from "lucide-react"
import { useEffect, useState } from "react"

const EmailMessage = ({
	message,
	isCollapsed,
}: {
	message: EmailMessage
	isCollapsed: boolean
}) => {
	const { mainContent, quotedContent } = parseEmailBody(message.body)
	const [showQuoted, setShowQuoted] = useState(false)

	if (isCollapsed) return null

	return (
		<div className="w-full rounded-lg bg-white py-2">
			<div
				className="prose max-w-none text-sm"
				dangerouslySetInnerHTML={{
					__html: mainContent,
				}}
			/>
			{quotedContent && (
				<>
					<button
						onClick={() => setShowQuoted(!showQuoted)}
						className="text-sm text-blue-500 hover:text-blue-600"
					>
						<Ellipsis className="h-4 w-4" />
					</button>
					<div className={cn(showQuoted ? "block" : "hidden")}>
						<div
							className="prose max-w-none text-sm text-slate-500"
							dangerouslySetInnerHTML={{
								__html: quotedContent,
							}}
						/>
					</div>
				</>
			)}
		</div>
	)
}

export const ViewEmailPane = () => {
	const { selectedFolder, selectedIndices, setSelectedIndex } = useUIStore()
	const selectedIndex = selectedIndices[selectedFolder?.id || "INBOX"] || 0
	const { data: emails } = useFolderEmails()
	const email = emails?.[selectedIndex]
	const { mutate: handleMarkDone } = useMarkEmailDone()
	const {
		selectedMessageIndex,
		setSelectedMessageIndex,
		showReplyPane,
		setShowReplyPane,
		collapsedMessages,
		setCollapsedMessages,
	} = useUIStore()
	const { isShowingEmail, setIsShowingEmail } = useUIStore()

	useEffect(() => {
		if (email?.messages) {
			setCollapsedMessages(
				email.messages.reduce(
					(acc, _, index) => ({
						...acc,
						[index]: index !== email.messages.length - 1,
					}),
					{}
				)
			)
		}
	}, [email])

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
							<Button
								variant="ghost"
								onClick={() => {
									if (selectedIndex > 0) {
										setSelectedIndex(
											selectedFolder?.id || "INBOX",
											selectedIndex - 1
										)
									}
								}}
							>
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
							<Button
								variant="ghost"
								onClick={() => {
									if (
										emails &&
										selectedIndex < emails.length - 1
									) {
										setSelectedIndex(
											selectedFolder?.id || "INBOX",
											selectedIndex + 1
										)
									}
								}}
							>
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
								onClick={() => {
									if (!email) return
									handleMarkDone([email])
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
								index={i}
								message={message}
								setShowReplyPane={setShowReplyPane}
								isCollapsed={collapsedMessages[i]}
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
