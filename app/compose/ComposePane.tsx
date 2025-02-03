"use client"

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
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import TextareaAutosize from "react-textarea-autosize"
import { toast } from "react-toastify"

const MessageActions = () => {
	const { draftId } = useParams()
	const { isPending: isSending } = useSendEmail()
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
							discardDraft(draftId as string)
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

const ComposePane = ({
	draftId,
	isReply = false,
	replyToEmail,
}: {
	draftId?: string
	isReply?: boolean
	replyToEmail?: EmailMessage
}) => {
	const { data: emails } = useFolderEmails()
	const { mutateAsync: createDraft } = useCreateDraft()
	const { selectedFolder, selectedIndices, showAIPrompt, setShowAIPrompt } =
		useUIStore()
	const router = useRouter()
	const { setSelectedText } = useComposeStore()
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

	useEffect(() => {
		const initialValues = JSON.stringify({
			message: getValues("message"),
			subject: getValues("subject"),
			to: getValues("to"),
			cc: getValues("cc"),
			bcc: getValues("bcc"),
			attachments: getValues("attachments"),
		})
		let lastValues = initialValues

		const debouncedSaveDraft = debounce(() => {
			const currentValues = JSON.stringify({
				message: getValues("message"),
				subject: getValues("subject"),
				to: getValues("to"),
				cc: getValues("cc"),
				bcc: getValues("bcc"),
				attachments: getValues("attachments"),
			})

			if (currentValues === lastValues || currentValues === initialValues)
				return
			lastValues = currentValues

			if (
				!getValues("message") &&
				!getValues("subject") &&
				!getValues("to").length &&
				!getValues("cc").length &&
				!getValues("bcc").length
			)
				return

			createDraft({
				to: getValues("to"),
				cc: getValues("cc"),
				bcc: getValues("bcc"),
				subject: getValues("subject"),
				body: getValues("message"),
				draftId,
				attachmentsToDelete: getValues("attachments.toDelete"),
				attachmentsToAdd: getValues("attachments.toAdd"),
			}).then((data) => {
				if (!draftId) {
					router.push(`/compose/${data.id}`)
				} else toast.success("Draft saved")
			})
		}, 3000)

		const subscription = form.watch(() => debouncedSaveDraft())
		return () => {
			subscription.unsubscribe()
			debouncedSaveDraft.cancel()
		}
	}, [draftId, createDraft])

	useEffect(() => {
		if (draftId) {
			const draft = emails?.find((e) => e.id === draftId)
			if (draft) {
				console.log("found draft", draft)
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
	}, [draftId, emails])

	return (
		<div className="absolute inset-0 z-40 flex flex-row bg-white">
			<BackNavigationSection onClose={() => router.back()} />
			<FormProvider {...form}>
				<SendEmptySubjectDialog />
				<SendNoRecipientsDialog />
				<form
					className="flex w-3/5 flex-col items-center"
					onSubmit={send}
				>
					<p className="text-lg w-3/5 p-4 font-medium">New Message</p>
					<div className="flex w-3/5 flex-col rounded-2xl px-4 pt-4 shadow-2xl">
						<div className="flex flex-col gap-2">
							<RecipientFields />
							<SubjectField />
							<div className="relative flex min-h-0 flex-1 flex-col">
								<div className="flex-1 items-center overflow-y-auto">
									<div className="relative">
										<TextareaAutosize
											data-message-field
											className="w-full resize-none bg-transparent text-sm outline-none selection:bg-blue-200 selection:!bg-opacity-100"
											value={getValues("message")}
											onChange={(e) =>
												setValue(
													"message",
													e.target.value
												)
											}
											minRows={1}
											placeholder="Tip: Hit ⌘J for AI"
											onSelect={(e) => {
												const target =
													e.target as HTMLTextAreaElement
												setSelectedText(
													target.selectionStart,
													target.selectionEnd
												)
											}}
											onBlur={() => {
												setSelectedText(0, 0)
											}}
										/>
										{/* <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-lg">
											{(window.getSelection()?.toString()
												?.length ?? 0) > 0 && (
												<div className="flex gap-2">
													<TextSelectionMenu />
												</div>
											)}
										</div> */}
									</div>
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

export { ComposePane }
