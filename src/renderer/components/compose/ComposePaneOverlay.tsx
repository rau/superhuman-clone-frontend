import { BackNavigationSection } from "@/components/BackNavigationSection"
import RecipientFields from "@/components/compose/RecipientFields"
import { SendEmptySubjectDialog } from "@/components/compose/SendEmptySubjectDialog"
import { SubjectField } from "@/components/compose/SubjectField"
import { EmailSenderDetailsPane } from "@/components/EmailSenderDetailsPane"
import { KeyboardTooltip } from "@/components/KeyboardTooltip"
import {
	sendEmailMutation,
	useContacts,
	useFolderEmails,
} from "@/hooks/dataHooks"
import { useComposeStore } from "@/hooks/useComposeStore"
import { useUIStore } from "@/hooks/useUIStore"
import { filterContacts } from "@/libs/contactUtils"
import { Braces, Calendar, File, Paperclip, Trash2, X } from "lucide-react"
import { useEffect } from "react"
import TextareaAutosize from "react-textarea-autosize"

const MessageArea = () => {
	const { message, setMessage } = useComposeStore()

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<div className="flex-1 overflow-y-auto">
				<TextareaAutosize
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder="Tip: Hit ⌘J for AI"
					className="w-full resize-none pt-1 text-sm font-light outline-none"
					minRows={12}
					maxRows={24}
				/>
			</div>
			<div className="flex items-center gap-2 border-t py-2 text-sm text-slate-500">
				<span>Hit</span>
				<kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
					Shift
				</kbd>
				<span>+</span>
				<kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
					Enter
				</kbd>
				<span>to add a new line</span>
			</div>
		</div>
	)
}

const MessageActions = ({
	onSend,
	isSending,
}: {
	onSend: () => void
	isSending: boolean
}) => {
	const { attachments, addAttachment } = useComposeStore()
	const { setIsComposing } = useUIStore()

	const handleAttach = async () => {
		const result = await window.electron.openFile()
		if (!result.canceled && result.filePaths.length > 0) {
			const filePath = result.filePaths[0]
			const stats = await window.electron.getFileStats(filePath)
			addAttachment({
				name: filePath.split("/").pop()!,
				size: stats.size,
				path: filePath,
			})
		}
	}

	return (
		<div className="flex flex-col border-t border-slate-200">
			{attachments.length > 0 && (
				<div className="flex flex-wrap gap-2 border-b border-slate-200 p-4">
					{attachments.map((attachment) => (
						<AttachmentChip
							key={attachment.path}
							attachment={attachment}
						/>
					))}
				</div>
			)}
			<div className="flex items-center justify-between pb-1 pt-4">
				<div className="flex items-center gap-2">
					<KeyboardTooltip
						tooltips={[
							{
								keys: ["⌘", "Enter"],
								label: "Send",
							},
						]}
						delayDuration={150}
					>
						<button onClick={onSend} disabled={isSending}>
							<p className="text-sm font-medium">Send</p>
						</button>
					</KeyboardTooltip>
					<KeyboardTooltip
						tooltips={[
							{
								keys: ["⌘", "shift", "L"],
								label: "Send later",
							},
						]}
						delayDuration={150}
					>
						<button onClick={onSend} disabled={isSending}>
							<p className="text-sm font-medium text-slate-400">
								Send later
							</p>
						</button>
					</KeyboardTooltip>
					<KeyboardTooltip
						tooltips={[
							{
								keys: ["⌘", "shift", "H"],
								label: "Remind me",
							},
						]}
						delayDuration={150}
					>
						<button onClick={onSend} disabled={isSending}>
							<p className="text-sm font-medium text-slate-400">
								Remind me
							</p>
						</button>
					</KeyboardTooltip>
				</div>

				<div className="flex items-center gap-1">
					<KeyboardTooltip
						tooltips={[
							{
								keys: ["⌘", "J"],
								label: "Write with AI",
							},
						]}
						delayDuration={150}
					>
						<button className="rounded-md p-2 text-slate-500 hover:text-slate-700">
							<span className="text-sm font-medium">AI</span>
						</button>
					</KeyboardTooltip>
					<KeyboardTooltip
						tooltips={[
							{
								keys: ["⌘", "shift", "A"],
								label: "Share availability",
							},
						]}
						delayDuration={150}
					>
						<button className="rounded-md p-2 text-slate-500 hover:text-slate-700">
							<Calendar className="h-4 w-4" />
						</button>
					</KeyboardTooltip>
					<KeyboardTooltip
						tooltips={[
							{
								keys: [";"],
								label: "Use snippet inline",
							},
						]}
						delayDuration={150}
					>
						<button className="rounded-md p-2 text-slate-500 hover:text-slate-700">
							<Braces className="h-4 w-4" />
						</button>
					</KeyboardTooltip>

					<KeyboardTooltip
						tooltips={[
							{
								keys: ["⌘", "shift", "U"],
								label: "Attach",
							},
						]}
						delayDuration={150}
					>
						<button
							onClick={handleAttach}
							className="rounded-md p-2 text-slate-500 hover:text-slate-700"
						>
							<Paperclip className="h-4 w-4" />
						</button>
					</KeyboardTooltip>
					<KeyboardTooltip
						tooltips={[
							{
								keys: ["⌘", "shift", ","],
								label: "Discard",
							},
						]}
						delayDuration={150}
					>
						<button
							onClick={() => setIsComposing(false)}
							className="rounded-md p-2 text-slate-500 hover:text-slate-700"
						>
							<Trash2 className="h-4 w-4" />
						</button>
					</KeyboardTooltip>
				</div>
			</div>
		</div>
	)
}

const AttachmentChip = ({ attachment }: { attachment: Attachment }) => {
	const { removeAttachment } = useComposeStore()

	return (
		<div className="flex items-center gap-2 rounded-md border border-slate-200 px-2 py-1">
			<File className="h-4 w-4 text-slate-500" />
			<div className="flex flex-col">
				<span className="text-sm">{attachment.name}</span>
				<span className="text-xs text-slate-500">
					{Math.round(attachment.size / 1024)}kb
				</span>
			</div>
			<button
				onClick={() => removeAttachment(attachment.path)}
				className="ml-2 rounded-full p-1 hover:bg-slate-100"
			>
				<X className="h-3 w-3" />
			</button>
		</div>
	)
}

export const ComposePaneOverlay = ({
	isReply = false,
	replyToEmail,
}: {
	isReply?: boolean
	replyToEmail?: EmailMessage
}) => {
	const { data: contacts } = useContacts()
	const { data: emails } = useFolderEmails()
	const { selectedFolder, selectedIndices } = useUIStore()
	const selectedIndex = selectedIndices[selectedFolder?.id || "INBOX"] || 0
	const email = emails?.[selectedIndex]
	const { mutateAsync: sendEmail, isPending } = sendEmailMutation()
	const { isComposing, setIsComposing, setShowEmptySubjectDialog } =
		useUIStore()
	const {
		toQuery,
		ccQuery,
		bccQuery,
		subject,
		message,
		toContacts,
		ccContacts,
		bccContacts,
		attachments,
		showSuggestions,
		selectedContactIndex,
		activeField,
		addAttachment,
		reset,
	} = useComposeStore()

	const handleAttach = async () => {
		const result = await window.electron.openFile()
		if (!result.canceled && result.filePaths.length > 0) {
			const filePath = result.filePaths[0]
			const stats = await window.electron.getFileStats(filePath)
			addAttachment({
				name: filePath.split("/").pop()!,
				size: stats.size,
				path: filePath,
			})
		}
	}

	const handleSend = () => {
		if (!subject.trim()) {
			setShowEmptySubjectDialog(true)
			return
		}
		sendEmail(
			{
				to: toContacts,
				cc: ccContacts,
				bcc: bccContacts,
				subject,
				body: message,
				attachments,
				replyToEmail: isReply ? replyToEmail : undefined,
			},
			{
				onSuccess: () => {
					setIsComposing(false)
				},
			}
		)
			.catch(() => {})
			.then(() => reset())
	}

	const filteredContacts = filterContacts(
		contacts,
		activeField === "to"
			? toQuery
			: activeField === "cc"
				? ccQuery
				: bccQuery,
		activeField === "to"
			? toContacts
			: activeField === "cc"
				? ccContacts
				: bccContacts
	)

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!showSuggestions || !filteredContacts?.length) {
				if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
					e.preventDefault()
					handleSend()
					return
				}

				if (e.metaKey && e.shiftKey) {
					if (e.key === ",") {
						e.preventDefault()
						setIsComposing(false)
						return
					}

					if (e.key === "u" || e.key === "U") {
						e.preventDefault()
						handleAttach()
						return
					}
				}
			}
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [showSuggestions, filteredContacts, selectedContactIndex])

	if (!isComposing) return null

	return (
		<div className="absolute inset-0 z-40 flex flex-row bg-white">
			<SendEmptySubjectDialog
				onConfirm={() => {
					setShowEmptySubjectDialog(false)
					sendEmail(
						{
							to: toContacts,
							cc: ccContacts,
							bcc: bccContacts,
							subject,
							body: message,
							attachments,
							replyToEmail: isReply ? replyToEmail : undefined,
						},
						{
							onSuccess: () => {
								setIsComposing(false)
							},
						}
					)
				}}
			/>
			<BackNavigationSection onClose={() => setIsComposing(false)} />
			<div className="flex w-3/5 flex-col items-center">
				<h2 className="text-lg w-3/5 p-4 font-medium">New Message</h2>
				<div className="flex w-3/5 flex-col rounded-2xl p-4 shadow-2xl">
					<div className="flex flex-col gap-2">
						<RecipientFields />
						<SubjectField />
						<MessageArea />
					</div>
					<MessageActions onSend={handleSend} isSending={isPending} />
				</div>
			</div>
			<div className="flex w-1/5 flex-col bg-slate-50 p-4">
				<EmailSenderDetailsPane email={email} />
			</div>
		</div>
	)
}
