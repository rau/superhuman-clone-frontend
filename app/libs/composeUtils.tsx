import { useDiscardDraft, useSendEmail } from "@/hooks/dataHooks"
import { useComposeStore } from "@/hooks/useComposeStore"
import { useUIStore } from "@/hooks/useUIStore"
import { useParams, useRouter } from "next/navigation"
import { UseFormReturn } from "react-hook-form"
import { toast } from "react-toastify"

export const sendEmail = (form: UseFormReturn<ComposeFormData>) => {
	const { mutateAsync: send } = useSendEmail()
	const { mutateAsync: discardDraft } = useDiscardDraft()
	const { handleSubmit } = form
	const { setShowEmptySubjectDialog, setShowNoRecipientsDialog } =
		useUIStore()
	const router = useRouter()
	const { draftId } = useParams()

	return handleSubmit((data: ComposeFormData) => {
		if (!data.subject.trim()) {
			setShowEmptySubjectDialog(true)
			return
		}
		if (!data.to.length && !data.cc.length && !data.bcc.length) {
			setShowNoRecipientsDialog(true)
			return
		}

		send({
			to: data.to,
			cc: data.cc,
			bcc: data.bcc,
			subject: data.subject,
			body: data.message,
			attachments: data.attachments.current,
			replyToEmail: undefined,
		})
			.then(() => {
				if (draftId) {
					discardDraft([draftId as string])
				}
				router.push("/")
				form.reset()
			})
			.catch(() => {})
	})
}

export const useAddContact = (form: UseFormReturn<ComposeFormData>) => {
	const { setValue } = form
	const {
		activeField,
		setShowSuggestions,
		setToQuery,
		setCcQuery,
		setBccQuery,
	} = useComposeStore()

	return (contact: EmailParticipant) => {
		setValue(activeField, [...form.getValues(activeField), contact])
		setShowSuggestions(false)
		if (activeField === "to") {
			setToQuery("")
		} else if (activeField === "cc") {
			setCcQuery("")
		} else if (activeField === "bcc") {
			setBccQuery("")
		}
	}
}

export const useRemoveContact = (
	form: UseFormReturn<ComposeFormData>,
	field: RecipientField
) => {
	const { setValue, getValues } = form

	return (contact: EmailParticipant) => {
		setValue(
			field,
			getValues(field).filter((c) => c.email !== contact.email)
		)
	}
}

export const useAddAttachment = (form: UseFormReturn<ComposeFormData>) => {
	const { setValue, getValues } = form

	return async () => {
		const { setIsFileDialogOpen } = useUIStore()
		setIsFileDialogOpen(true)
		const result = await window.electron.openFile()
		setIsFileDialogOpen(false)
		if (!result.canceled && result.filePaths.length > 0) {
			const filePath = result.filePaths[0]
			const stats = await window.electron.getFileStats(filePath)
			const content = await window.electron.readFile(filePath)
			setValue("attachments.current", [
				...getValues("attachments.current"),
				{
					name: filePath.split("/").pop()!,
					size: stats.size,
					path: filePath,
					content: content,
					type: "file",
				},
			])
		}
	}
}

export const useRemoveAttachment = (form: UseFormReturn<ComposeFormData>) => {
	const { setValue, getValues } = form

	return (attachment: DraftAttachment) => {
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
}

export const discardDraft = (draftId: string) => {
	const { mutateAsync } = useDiscardDraft()
	const router = useRouter()

	return () => {
		router.push("/")
		mutateAsync([draftId]).then(() => toast.success("Draft discarded"))
	}
}
