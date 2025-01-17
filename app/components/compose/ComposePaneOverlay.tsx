import { BackNavigationSection } from "@/components/BackNavigationSection"
import { AIPromptInput } from "@/components/compose/AIPromptInput"
import RecipientFields from "@/components/compose/RecipientFields"
import { SendEmptySubjectDialog } from "@/components/compose/SendEmptySubjectDialog"
import { SendNoRecipientsDialog } from "@/components/compose/SendNoRecipientsDialog"
import { SubjectField } from "@/components/compose/SubjectField"
import { EmailSenderDetailsPane } from "@/components/EmailSenderDetailsPane"
import { KeyboardTooltip } from "@/components/KeyboardTooltip"
import { IconButton } from "@/components/ui/IconButton"
import {
	useCreateDraft,
	useFolderEmails,
	useSendEmail,
} from "@/hooks/dataHooks"
import { useComposeShortcuts } from "@/hooks/useComposeShortcuts"
import { useComposeStore } from "@/hooks/useComposeStore"
import { useUIStore } from "@/hooks/useUIStore"
import {
	discardDraft,
	sendEmail,
	useAddAttachment,
	useRemoveAttachment,
} from "@/libs/composeUtils"
import { debounce } from "@/libs/utils"
import { Braces, Calendar, Paperclip, Trash2, X } from "lucide-react"
import { useEffect } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import TextareaAutosize from "react-textarea-autosize"
import { toast } from "react-toastify"

const MessageActions = () => {
	const { isPending: isSending } = useSendEmail()
	const { draftId } = useComposeStore()
	const form = useFormContext<ComposeFormData>()
	const addAttachment = useAddAttachment(form)
	const attachments = form.watch("attachments.current")

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
						<button type="submit" disabled={isSending}>
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
						<button type="submit" disabled={isSending}>
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
						<button type="submit" disabled={isSending}>
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
					<IconButton
						icon={Calendar}
						tooltipLabel="Share availability"
						keyboardShortcuts={[
							{
								keys: ["⌘", "shift", "A"],
								label: "Share availability",
							},
						]}
					/>
					<IconButton
						icon={Braces}
						tooltipLabel="Use snippet inline"
						keyboardShortcuts={[
							{
								keys: [";"],
								label: "Use snippet inline",
							},
						]}
					/>
					<IconButton
						icon={Paperclip}
						tooltipLabel="Attach"
						keyboardShortcuts={[
							{
								keys: ["⌘", "shift", "U"],
								label: "Attach",
							},
						]}
						onClick={() => addAttachment}
					/>
					<IconButton
						icon={Trash2}
						tooltipLabel="Discard"
						keyboardShortcuts={[
							{
								keys: ["⌘", "shift", ","],
								label: "Discard",
							},
						]}
						onClick={() => {
							discardDraft(draftId || "")
						}}
					/>
				</div>
			</div>
		</div>
	)
}

const AttachmentChip = ({ attachment }: { attachment: DraftAttachment }) => {
	const form = useFormContext<ComposeFormData>()
	const removeAttachment = useRemoveAttachment(form)

	return (
		<div
			className="group relative flex w-[150px] rounded-md bg-[#DCE2EA] px-2 pb-12 pt-1 transition-colors duration-200 hover:bg-[#404040]/90"
			key={attachment.name}
		>
			<span className="text-xs">{attachment.name}</span>

			<span className="absolute bottom-1 left-1 rounded-sm bg-white px-1 py-[2px] text-xs uppercase group-hover:opacity-10">
				{attachment.name.substring(
					attachment.name.lastIndexOf(".") + 1
				)}
			</span>
			<IconButton
				icon={X}
				onClick={() => removeAttachment(attachment)}
				className="invisible absolute right-1 top-1 group-hover:visible"
				variant="inverse"
			/>
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
	const {
		selectedFolder,
		selectedIndices,
		isComposing,
		setIsComposing,
		showAIPrompt,
		setShowAIPrompt,
	} = useUIStore()
	const { draftId, setDraftId } = useComposeStore()
	const selectedIndex = selectedIndices[selectedFolder?.id || "INBOX"] || 0
	const email = emails?.[selectedIndex]

	const form = useForm<ComposeFormData>({
		defaultValues: {
			to: [],
			cc: [],
			bcc: [],
			subject: "",
			message: "",
			attachments: {
				current: [],
				toDelete: [],
			},
		},
	})
	const { setValue, getValues, register } = form
	const send = sendEmail(form)
	useComposeShortcuts(form)

	useEffect(() => {
		let lastValues = ""
		const debouncedSaveDraft = debounce(() => {
			const values = getValues()
			const currentValues = JSON.stringify({
				message: values.message,
				subject: values.subject,
				to: values.to,
				cc: values.cc,
				bcc: values.bcc,
				attachments: values.attachments,
			})

			if (currentValues === lastValues) return
			lastValues = currentValues

			if (
				!values.message &&
				!values.subject &&
				!values.to.length &&
				!values.cc.length &&
				!values.bcc.length
			)
				return

			createDraft({
				to: values.to,
				cc: values.cc,
				bcc: values.bcc,
				subject: values.subject,
				body: values.message,
				draftId,
				attachmentsToDelete: values.attachments.toDelete,
				attachmentsToAdd: values.attachments.toAdd,
			}).then((data) => {
				if (!draftId) setDraftId(data.draft_id)
				else toast.success("Draft saved")
			})
		}, 3000)

		const subscription = form.watch(() => debouncedSaveDraft())
		return () => {
			subscription.unsubscribe()
			debouncedSaveDraft.cancel()
		}
	}, [draftId, createDraft])

	useEffect(() => {
		console.log("draftId", draftId)
		if (draftId) {
			const draft = emails?.find((e) => e.id === draftId)
			if (draft) {
				setValue("message", draft.messages[0].body)
				setValue("subject", draft.subject)
				setValue("to", draft.messages[0].to.to || [])
				setValue("cc", draft.messages[0].to.cc || [])
				setValue("bcc", draft.messages[0].to.bcc || [])
				setValue(
					"attachments.current",
					draft.messages[0].attachments?.map((a) => ({
						name: a.filename,
						size: a.size,
						path: "",
						type: a.mime_type,
					})) || []
				)
			}
		} else {
			form.reset()
			console.log("reset")
		}
	}, [draftId])

	if (!isComposing) return null

	return (
		<div className="absolute inset-0 z-40 flex flex-row bg-white">
			<BackNavigationSection onClose={() => setIsComposing(false)} />
			<FormProvider {...form}>
				<SendEmptySubjectDialog />
				<SendNoRecipientsDialog />
				<form
					className="flex w-3/5 flex-col items-center"
					onSubmit={send}
				>
					<h2 className="text-lg w-3/5 p-4 font-medium">
						New Message
					</h2>
					<div className="flex w-3/5 flex-col rounded-2xl px-4 pt-4 shadow-2xl">
						<div className="flex flex-col gap-2">
							<RecipientFields />
							<SubjectField />
							<div className="relative flex min-h-0 flex-1 flex-col">
								<div className="flex-1 overflow-y-auto">
									<TextareaAutosize
										data-message-field
										{...register("message")}
										placeholder="Tip: Hit ⌘J for AI"
										className="w-full resize-none pt-1 text-sm font-light outline-none"
										minRows={12}
										maxRows={24}
									/>
									{showAIPrompt && <AIPromptInput />}
								</div>
							</div>
						</div>
						<MessageActions />
					</div>
				</form>
			</FormProvider>
			<div className="flex w-1/5 flex-col bg-slate-50 p-4">
				<EmailSenderDetailsPane email={email} />
			</div>
		</div>
	)
}
