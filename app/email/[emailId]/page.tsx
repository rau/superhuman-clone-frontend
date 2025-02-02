"use client"

import { BackNavigationSection } from "@/components/BackNavigationSection"
import { ComposePaneOverlay } from "@/components/compose/ComposePaneOverlay"
import { EmailSenderDetailsPane } from "@/components/EmailSenderDetailsPane"
import { KeyboardTooltip } from "@/components/KeyboardTooltip"
import { TopActionsBar } from "@/components/TopActionsBar"
import {
	useFolderEmails,
	useMarkEmailDone,
	useMarkEmailRead,
} from "@/hooks/dataHooks"
import { useUIStore } from "@/hooks/useUIStore"
import { parseEmailBody } from "@/libs/emailUtils"
import { cn } from "@/libs/utils"
import { Check, Clock, Copy, Ellipsis, Share } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

const EmailMessage = ({
	message,
	isCollapsed,
}: {
	message: EmailMessage
	isCollapsed: boolean
}) => {
	if (isCollapsed) return null

	const { mainContent, quotedContent } = parseEmailBody(message.body)
	const [showQuoted, setShowQuoted] = useState(false)

	return (
		<div className="w-full rounded-lg bg-white py-2">
			<div
				className="[&_*]:max-w-full [&_*]:font-sans [&_*]:text-sm [&_img]:h-auto [&_img]:w-auto"
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
					<div
						className={cn(
							showQuoted
								? "block [&_*]:max-w-full [&_*]:font-sans [&_*]:text-sm [&_img]:h-auto [&_img]:w-auto"
								: "hidden"
						)}
					>
						<div
							className=""
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
	const { emailId } = useParams()
	const router = useRouter()
	const { selectedFolder, selectedIndices, setSelectedIndex } = useUIStore()
	const selectedIndex = selectedIndices[selectedFolder?.id || "INBOX"] || 0
	const { data: emails } = useFolderEmails()
	console.log("emails", emails)
	const email = emails?.find((email) => email.id === emailId)
	const { mutate: handleMarkDone } = useMarkEmailDone()
	const { mutateAsync: markEmailRead } = useMarkEmailRead()
	const {
		selectedMessageIndex,
		setSelectedMessageIndex,
		showReplyPane,
		setShowReplyPane,
		collapsedMessages,
		setCollapsedMessages,
		isComposing,
	} = useUIStore()
	const lastMessageRef = useRef<HTMLDivElement>(null)
	const [isScrolled, setIsScrolled] = useState(false)

	useEffect(() => {
		if (email && !email.messages[0].read) {
			markEmailRead({
				emails_input: [email],
				read: true,
			})
		}
	}, [emailId])

	// TODO: CHECK THIS WORKS
	useEffect(() => {
		if (email?.messages && lastMessageRef.current) {
			lastMessageRef.current.scrollIntoView()
		}
	}, [emailId])

	useEffect(() => {
		if (email?.messages) {
			setCollapsedMessages(
				email.messages.reduce(
					(acc, _, index) => ({
						...acc,
						// [index]: index !== email.messages.length - 1,
						[index]: index !== 0,
					}),
					{}
				)
			)
		}
	}, [email])

	const scrollContainerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const container = scrollContainerRef.current
		const selectedElement = container?.children[
			selectedMessageIndex
		] as HTMLElement

		if (selectedElement && container) {
			const containerRect = container.getBoundingClientRect()
			const elementRect = selectedElement.getBoundingClientRect()

			const isVisible =
				elementRect.top >= containerRect.top &&
				elementRect.bottom <= containerRect.bottom

			if (!isVisible) {
				const containerHeight = container.clientHeight
				const scrollOffset = containerHeight * 0.75
				const elementTop = selectedElement.offsetTop

				container.scrollTo({
					top: elementTop - scrollOffset,
				})
			}
		}
	}, [selectedMessageIndex])

	useEffect(() => {
		const container = scrollContainerRef.current

		const handleScroll = () => {
			if (!container) return
			setIsScrolled(container.scrollTop > 0)
		}

		container?.addEventListener("scroll", handleScroll)
		return () => container?.removeEventListener("scroll", handleScroll)
	}, [scrollContainerRef.current])

	console.log("email", emailId)

	return (
		<div className="absolute inset-0 z-50 flex flex-row bg-white">
			<BackNavigationSection
				onClose={() => {
					router.back()
				}}
				onPrevious={() =>
					setSelectedIndex(
						selectedFolder?.id || "INBOX",
						selectedIndex - 1
					)
				}
				onNext={() =>
					setSelectedIndex(
						selectedFolder?.id || "INBOX",
						selectedIndex + 1
					)
				}
			/>
			<div className="flex w-3/5 flex-col">
				<div className="flex w-full flex-col items-center">
					<div
						className={cn(
							"flex w-full flex-col items-center p-4 transition-all duration-200",
							isScrolled
								? "shadow-xl drop-shadow-xl"
								: "drop-shadow-none"
						)}
					>
						<div className="w-2/3 min-w-[600px]">
							<div className="flex flex-row justify-between gap-4">
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
							<p className="text-sm text-slate-500">
								AI summary of email would go here
							</p>
						</div>
					</div>
				</div>

				<div
					className="flex flex-col items-center gap-2 overflow-y-auto p-4"
					ref={scrollContainerRef}
				>
					{email?.messages.map((message, i) => (
						<div
							onClick={() => setSelectedMessageIndex(i)}
							className={cn(
								"flex h-fit w-2/3 min-w-[600px] flex-col rounded-[2px] bg-white px-8 py-2 hover:shadow-xl",
								i === selectedMessageIndex &&
									"-ml-[2px] border-l-[2px] border-[#BFC1E4] shadow-xl"
							)}
							ref={
								i === email.messages.length - 1
									? lastMessageRef
									: null
							}
							key={i}
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
									replyToEmail={email.messages[i]}
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

export default ViewEmailPane
