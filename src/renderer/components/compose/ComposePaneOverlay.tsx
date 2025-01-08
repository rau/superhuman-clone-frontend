import { BackNavigationSection } from "@/components/BackNavigationSection"
import RecipientFields from "@/components/compose/RecipientFields"
import { SendEmptySubjectDialog } from "@/components/compose/SendEmptySubjectDialog"
import { SubjectField } from "@/components/compose/SubjectField"
import { EmailSenderDetailsPane } from "@/components/EmailSenderDetailsPane"
import { KeyboardTooltip } from "@/components/KeyboardTooltip"
import {
	sendEmailMutation,
	useCreateDraft,
	useFolderEmails,
} from "@/hooks/dataHooks"
import { useComposeStore } from "@/hooks/useComposeStore"
import { useUIStore } from "@/hooks/useUIStore"
import { debounce } from "@/libs/utils"
import { Braces, Calendar, File, Paperclip, Trash2, X } from "lucide-react"
import { useEffect } from "react"
import TextareaAutosize from "react-textarea-autosize"
import { toast } from "react-toastify"

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
			<div className="flex items-center justify-between">
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
	const { data: emails } = useFolderEmails()
	const { mutateAsync: createDraft } = useCreateDraft()
	const { selectedFolder, selectedIndices } = useUIStore()
	const selectedIndex = selectedIndices[selectedFolder?.id || "INBOX"] || 0
	const email = emails?.[selectedIndex]
	const { mutateAsync: sendEmail, isPending } = sendEmailMutation()
	const { isComposing, setIsComposing, setShowEmptySubjectDialog } =
		useUIStore()
	const {
		subject,
		message,
		toContacts,
		ccContacts,
		bccContacts,
		attachments,
		reset,
		draftId,
		setDraftId,
		setMessage,
		setSubject,
		setToContacts,
		setCcContacts,
		setBccContacts,
	} = useComposeStore()

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

	useEffect(() => {
		const debouncedSaveDraft = debounce(() => {
			if (
				!message &&
				!subject &&
				!toContacts.length &&
				!ccContacts.length &&
				!bccContacts.length
			) {
				return
			}

			const draft = emails?.find((e) => e.id === draftId)
			if (
				draft &&
				draft.messages[0].body === message &&
				draft.subject === subject &&
				JSON.stringify(draft.messages[0].to.to) ===
					JSON.stringify(toContacts) &&
				JSON.stringify(draft.messages[0].to.cc) ===
					JSON.stringify(ccContacts) &&
				JSON.stringify(draft.messages[0].to.bcc) ===
					JSON.stringify(bccContacts)
			) {
				return
			}

			createDraft(
				{
					to: toContacts,
					cc: ccContacts,
					bcc: bccContacts,
					subject,
					body: message,
					draftId: draftId,
				},
				{
					onSuccess: (data) => {
						if (!draftId) {
							setDraftId(data.draft_id)
						} else {
							toast.success("Draft saved")
						}
					},
				}
			)
		}, 3000)

		debouncedSaveDraft()
		return () => debouncedSaveDraft.cancel()
	}, [message, subject, toContacts, ccContacts, bccContacts])

	useEffect(() => {
		if (draftId) {
			const draft = emails?.find((e) => e.id === draftId)
			if (draft) {
				setMessage(draft.messages[0].body)
				setSubject(draft.subject)
				setToContacts(draft.messages[0].to.to || [])
				setCcContacts(draft.messages[0].to.cc || [])
				setBccContacts(draft.messages[0].to.bcc || [])
			}
		}
	}, [draftId])

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
				<div className="flex w-3/5 flex-col rounded-2xl px-4 pt-4 shadow-2xl">
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
