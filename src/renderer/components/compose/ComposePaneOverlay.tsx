import { BackNavigationSection } from "@/components/BackNavigationSection"
import RecipientFields from "@/components/compose/RecipientFields"
import { SendEmptySubjectDialog } from "@/components/compose/SendEmptySubjectDialog"
import { SendNoRecipientsDialog } from "@/components/compose/SendNoRecipientsDialog"
import { SubjectField } from "@/components/compose/SubjectField"
import { EmailSenderDetailsPane } from "@/components/EmailSenderDetailsPane"
import { KeyboardTooltip } from "@/components/KeyboardTooltip"
import { IconButton } from "@/components/ui/IconButton"
import {
	sendEmailMutation,
	useCreateDraft,
	useFolderEmails,
} from "@/hooks/dataHooks"
import { useComposeStore } from "@/hooks/useComposeStore"
import { useUIStore } from "@/hooks/useUIStore"
import { debounce, handleAttach } from "@/libs/utils"
import { Braces, Calendar, Paperclip, Trash2, X } from "lucide-react"
import { useEffect } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import TextareaAutosize from "react-textarea-autosize"
import { toast } from "react-toastify"

const MessageActions = ({
	isSending,
	attachments,
	onDiscard,
}: {
	isSending: boolean
	attachments: DraftAttachment[]
	onDiscard: () => void
}) => {
	const { setIsFileDialogOpen } = useUIStore()
	const { setValue, getValues } = useFormContext<ComposeFormData>()

	const removeAttachment = (attachment: DraftAttachment) => {
		setValue(
			"attachments.current",
			getValues("attachments.current").filter(
				(a) => a.name !== attachment.name
			)
		)
		setValue("attachments.toDelete", [
			...getValues("attachments.toDelete"),
			attachment,
		])
	}

	return (
		<div className="flex flex-col border-t border-slate-200">
			{attachments.length > 0 && (
				<div className="flex flex-wrap gap-2 border-b border-slate-200 p-4">
					{attachments.map((attachment) => (
						<AttachmentChip
							key={attachment.path}
							attachment={attachment}
							onRemove={() => removeAttachment(attachment)}
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
							onClick={() =>
								handleAttach(
									setIsFileDialogOpen,
									setValue,
									getValues
								)
							}
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
							onClick={onDiscard}
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

const AttachmentChip = ({
	attachment,
	onRemove,
}: {
	attachment: DraftAttachment
	onRemove: () => void
}) => {
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
				onClick={onRemove}
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
	const { mutateAsync: sendEmail, isPending } = sendEmailMutation()
	const {
		selectedFolder,
		selectedIndices,
		isComposing,
		setIsComposing,
		setShowEmptySubjectDialog,
		setShowNoRecipientsDialog,
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
	const { handleSubmit, watch, setValue, getValues, register } = form
	const formValues = watch()

	const handleSend = handleSubmit((data: ComposeFormData) => {
		if (!data.subject.trim()) {
			setShowEmptySubjectDialog(true)
			return
		}
		if (!data.to.length && !data.cc.length && !data.bcc.length) {
			setShowNoRecipientsDialog(true)
			return
		}

		sendEmail({
			to: data.to,
			cc: data.cc,
			bcc: data.bcc,
			subject: data.subject,
			body: data.message,
			attachments: data.attachments.current,
			replyToEmail: isReply ? replyToEmail : undefined,
		})
			.then(() => {
				setIsComposing(false)
				form.reset()
			})
			.catch(() => {})
	})

	useEffect(() => {
		const debouncedSaveDraft = debounce(() => {
			const { message, subject, to, cc, bcc, attachments } = getValues()
			if (!message && !subject && !to.length && !cc.length && !bcc.length)
				return

			createDraft({
				to,
				cc,
				bcc,
				subject,
				body: message,
				draftId,
				attachmentsToDelete: attachments.toDelete,
				attachmentsToAdd: attachments.toAdd,
			}).then((data) => {
				if (!draftId) setDraftId(data.draft_id)
				else toast.success("Draft saved")
			})
		}, 3000)

		debouncedSaveDraft()
		return () => debouncedSaveDraft.cancel()
	}, [formValues])

	useEffect(() => {
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
		}
	}, [draftId])

	if (!isComposing) return null

	return (
		<div className="absolute inset-0 z-40 flex flex-row bg-white">
			<SendEmptySubjectDialog onConfirm={handleSend} />
			<SendNoRecipientsDialog />
			<BackNavigationSection onClose={() => setIsComposing(false)} />
			<FormProvider {...form}>
				<form
					className="flex w-3/5 flex-col items-center"
					onSubmit={handleSend}
				>
					<h2 className="text-lg w-3/5 p-4 font-medium">
						New Message
					</h2>
					<div className="flex w-3/5 flex-col rounded-2xl px-4 pt-4 shadow-2xl">
						<div className="flex flex-col gap-2">
							<RecipientFields form={form} />
							<SubjectField form={form} />
							<div className="flex min-h-0 flex-1 flex-col">
								<div className="flex-1 overflow-y-auto">
									<TextareaAutosize
										{...register("message")}
										placeholder="Tip: Hit ⌘J for AI"
										className="w-full resize-none pt-1 text-sm font-light outline-none"
										minRows={12}
										maxRows={24}
									/>
								</div>
							</div>
						</div>
						<MessageActions
							isSending={isPending}
							attachments={formValues.attachments.current}
							onDiscard={() => setIsComposing(false)}
						/>
					</div>
				</form>
			</FormProvider>
			<div className="flex w-1/5 flex-col bg-slate-50 p-4">
				<EmailSenderDetailsPane email={email} />
			</div>
		</div>
	)
}
