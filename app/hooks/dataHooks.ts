import { useAccountStore } from "@/hooks/useAccountStore"
import { useEmailActionsStore } from "@/hooks/useEmailActionsStore"
import { useUIStore } from "@/hooks/useUIStore"
import {
	createDoneFolder,
	createDraft,
	discardDraft,
	fetchAccounts,
	fetchContacts,
	fetchFolderEmails,
	fetchFolders,
	markEmailDone,
	markEmailRead,
	markEmailUndone,
	modifyLabels,
	searchEmails,
	sendEmail,
	SendEmailPayload,
	signOutAccount,
	spamEmail,
	starEmail,
	trashEmail,
} from "@/services/googleServices"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useContacts = () => {
	const { selectedAccountId } = useAccountStore()
	return useQuery<EmailParticipant[]>({
		queryKey: ["contacts", selectedAccountId],
		queryFn: () => fetchContacts(selectedAccountId || ""),
		enabled: !!selectedAccountId,
		staleTime: 1000 * 60 * 5,
	})
}

export const useSendEmail = () => {
	const queryClient = useQueryClient()
	const { selectedAccountId } = useAccountStore()
	return useMutation({
		mutationFn: (payload: SendEmailPayload) =>
			sendEmail(payload, selectedAccountId || ""),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["emails"] })
		},
	})
}

export const useSearchEmails = (query: string) => {
	const { selectedAccountId } = useAccountStore()
	return useQuery<EmailThread[]>({
		queryKey: ["search", query, selectedAccountId],
		queryFn: () => searchEmails(query, selectedAccountId || ""),
		enabled: false,
		staleTime: 1000 * 60 * 5,
	})
}

export const useMarkEmailDone = () => {
	const queryClient = useQueryClient()
	const { setLastAction } = useEmailActionsStore()
	const { selectedAccountId } = useAccountStore()
	const { selectedFolder, selectedIndices, setSelectedIndex } = useUIStore()
	const { data: emails } = useFolderEmails()
	const selectedIndex = selectedIndices[selectedFolder?.id || "INBOX"] || 0

	return useMutation({
		mutationFn: (emails_input: EmailThread[]) =>
			markEmailDone(emails_input, selectedAccountId || ""),
		onMutate: async (emails_input) => {
			await queryClient.cancelQueries({
				queryKey: ["emails", selectedFolder?.id, selectedAccountId],
			})

			const previousEmails = queryClient.getQueryData<EmailThread[]>([
				"emails",
				selectedFolder?.id,
				selectedAccountId,
			])

			setLastAction({
				type: "done",
				emails: emails_input,
				previousValues: emails?.map(() => false) || [],
			})

			queryClient.setQueryData<EmailThread[]>(
				["emails", selectedFolder?.id, selectedAccountId],
				(old) =>
					old?.filter(
						(e) => !emails_input.map((e) => e.id).includes(e.id)
					)
			)

			if (emails && selectedIndex < emails.length - 1) {
				setSelectedIndex(
					selectedFolder?.id || "INBOX",
					selectedIndex + 1
				)
			}

			return { previousEmails }
		},
		onError: (err, email, context) => {
			queryClient.setQueryData(
				["emails", selectedFolder?.id, selectedAccountId],
				context?.previousEmails
			)
		},
	})
}

export const useUndoMarkEmailDone = () => {
	const queryClient = useQueryClient()
	const { lastAction, setLastAction } = useEmailActionsStore()
	const { selectedAccountId } = useAccountStore()
	const { selectedFolder } = useUIStore()

	return useMutation({
		mutationFn: (emails_input: EmailThread[]) =>
			markEmailUndone(emails_input, selectedAccountId || ""),
		onMutate: async (emails_input) => {
			await queryClient.cancelQueries({
				queryKey: ["emails", selectedFolder?.id, selectedAccountId],
			})

			const previousEmails = queryClient.getQueryData<EmailThread[]>([
				"emails",
				selectedFolder?.id,
				selectedAccountId,
			])

			if (lastAction) {
				queryClient.setQueryData<EmailThread[]>(
					["emails", selectedFolder?.id, selectedAccountId],
					(old) => [...(old || []), ...emails_input]
				)
			}

			return { previousEmails }
		},
		onError: (err, email, context) => {
			queryClient.setQueryData(
				["emails", selectedFolder?.id, selectedAccountId],
				context?.previousEmails
			)
		},
		onSuccess: () => {
			setLastAction(null)
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ["emails", selectedFolder?.id, selectedAccountId],
			})
		},
	})
}

export const useMarkEmailRead = () => {
	const queryClient = useQueryClient()
	const { selectedAccountId } = useAccountStore()
	const { selectedFolder } = useUIStore()
	const { setLastAction } = useEmailActionsStore()

	return useMutation({
		mutationFn: ({
			emails_input,
			read,
		}: {
			emails_input: EmailThread[]
			read: boolean
		}) => {
			setLastAction({
				type: "read",
				emails: emails_input,
				previousValues: emails_input.map((e) => e.messages[0].read),
			})
			return markEmailRead(emails_input, selectedAccountId || "", read)
		},
		onMutate: async ({ emails_input, read }) => {
			await queryClient.cancelQueries({
				queryKey: ["emails", selectedFolder?.id, selectedAccountId],
			})

			const previousEmails = queryClient.getQueryData<EmailThread[]>([
				"emails",
				selectedFolder?.id,
				selectedAccountId,
			])

			queryClient.setQueryData<EmailThread[]>(
				["emails", selectedFolder?.id, selectedAccountId],
				(old) =>
					old?.map((e) =>
						emails_input.map((e) => e.id).includes(e.id)
							? {
									...e,
									messages: e.messages.map((m) => ({
										...m,
										read,
									})),
								}
							: e
					)
			)

			return { previousEmails }
		},
		onError: (err, variables, context) => {
			queryClient.setQueryData(
				["emails", selectedFolder?.id, selectedAccountId],
				context?.previousEmails
			)
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ["emails", selectedFolder?.id, selectedAccountId],
			})
		},
	})
}

export const useFolders = () => {
	const { selectedAccountId } = useAccountStore()
	return useQuery<Folder[]>({
		queryKey: ["folders", selectedAccountId],
		queryFn: () => fetchFolders(selectedAccountId || ""),
		enabled: !!selectedAccountId,
		placeholderData: [],
		staleTime: 1000 * 60 * 5,
		retry: 2,
		refetchOnWindowFocus: false,
	})
}

export const useFolderEmails = () => {
	const { selectedFolder } = useUIStore()
	const { selectedAccountId } = useAccountStore()
	return useQuery({
		queryKey: ["emails", selectedFolder?.id, selectedAccountId],
		queryFn: () =>
			fetchFolderEmails(
				selectedFolder?.id || "INBOX",
				selectedAccountId || ""
			),
		select: (emails: EmailThread[]) =>
			[...emails].sort(
				(a, b) => b.last_message_timestamp - a.last_message_timestamp
			),
		enabled: !!selectedAccountId && !!selectedFolder?.id,
		staleTime: 1000 * 60 * 5,
	})
}

export const useCreateDoneFolder = () => {
	const queryClient = useQueryClient()
	const { selectedAccountId } = useAccountStore()
	return useMutation({
		mutationFn: () => createDoneFolder(selectedAccountId || ""),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["folders"] })
		},
	})
}

export const useAccounts = () => {
	return useQuery<Account[]>({
		queryKey: ["accounts"],
		queryFn: fetchAccounts,
		staleTime: 1000 * 60 * 5,
	})
}

export const useSignOutAccount = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: signOutAccount,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["accounts"] })
		},
	})
}

export const useStarEmail = () => {
	const queryClient = useQueryClient()
	const { selectedAccountId } = useAccountStore()
	const { selectedFolder } = useUIStore()
	const { setLastAction } = useEmailActionsStore()

	return useMutation({
		mutationFn: ({
			emails_input,
			star,
		}: {
			emails_input: EmailThread[]
			star: boolean
		}) => {
			setLastAction({
				type: "star",
				emails: emails_input,
				previousValues: emails_input.map((e) => e.starred),
			})
			return starEmail(emails_input, selectedAccountId || "", star)
		},
		onMutate: async ({ emails_input, star }) => {
			await queryClient.cancelQueries({
				queryKey: ["emails", selectedFolder?.id, selectedAccountId],
			})

			const previousEmails = queryClient.getQueryData<EmailThread[]>([
				"emails",
				selectedFolder?.id,
				selectedAccountId,
			])

			queryClient.setQueryData<EmailThread[]>(
				["emails", selectedFolder?.id, selectedAccountId],
				(old) =>
					old?.map((e) =>
						emails_input.map((e) => e.id).includes(e.id)
							? { ...e, starred: star }
							: e
					)
			)

			return { previousEmails }
		},
		onError: (err, variables, context) => {
			queryClient.setQueryData(
				["emails", selectedFolder?.id, selectedAccountId],
				context?.previousEmails
			)
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ["emails", selectedFolder?.id, selectedAccountId],
			})
		},
	})
}

export const useTrashEmail = () => {
	const queryClient = useQueryClient()
	const { selectedAccountId } = useAccountStore()
	const { selectedFolder } = useUIStore()
	const { setLastAction } = useEmailActionsStore()

	return useMutation({
		mutationFn: ({
			emails_input,
			trash,
		}: {
			emails_input: EmailThread[]
			trash: boolean
		}) => {
			setLastAction({
				type: "trash",
				emails: emails_input,
				previousValues: emails_input.map(() => false),
			})
			return trashEmail(emails_input, selectedAccountId || "", trash)
		},
		onMutate: async ({ emails_input, trash }) => {
			await queryClient.cancelQueries({
				queryKey: ["emails", selectedFolder?.id, selectedAccountId],
			})

			const previousEmails = queryClient.getQueryData<EmailThread[]>([
				"emails",
				selectedFolder?.id,
				selectedAccountId,
			])

			queryClient.setQueryData<EmailThread[]>(
				["emails", selectedFolder?.id, selectedAccountId],
				(old) =>
					trash
						? old?.filter(
								(e) =>
									!emails_input
										.map((e) => e.id)
										.includes(e.id)
							)
						: [...(old || []), ...emails_input]
			)

			return { previousEmails }
		},
		onError: (err, variables, context) => {
			queryClient.setQueryData(
				["emails", selectedFolder?.id, selectedAccountId],
				context?.previousEmails
			)
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ["emails", selectedFolder?.id, selectedAccountId],
			})
		},
	})
}

export const useSpamEmail = () => {
	const queryClient = useQueryClient()
	const { selectedAccountId } = useAccountStore()
	const { selectedFolder } = useUIStore()
	const { setLastAction } = useEmailActionsStore()
	return useMutation({
		mutationFn: ({
			emails_input,
			spam,
		}: {
			emails_input: EmailThread[]
			spam: boolean
		}) => {
			setLastAction({
				type: "spam",
				emails: emails_input,
				previousValues: emails_input.map(() => false),
			})
			return spamEmail(emails_input, selectedAccountId || "", spam)
		},
		onMutate: async ({ emails_input, spam }) => {
			await queryClient.cancelQueries({
				queryKey: ["emails", selectedFolder?.id, selectedAccountId],
			})

			const previousEmails = queryClient.getQueryData<EmailThread[]>([
				"emails",
				selectedFolder?.id,
				selectedAccountId,
			])

			queryClient.setQueryData<EmailThread[]>(
				["emails", selectedFolder?.id, selectedAccountId],
				(old) =>
					spam
						? old?.filter(
								(e) =>
									!emails_input
										.map((e) => e.id)
										.includes(e.id)
							)
						: [...(old || []), ...emails_input]
			)

			return { previousEmails }
		},
		onError: (err, variables, context) => {
			queryClient.setQueryData(
				["emails", selectedFolder?.id, selectedAccountId],
				context?.previousEmails
			)
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ["emails", selectedFolder?.id, selectedAccountId],
			})
		},
	})
}

export const useModifyLabels = () => {
	const queryClient = useQueryClient()
	const { selectedAccountId } = useAccountStore()
	const { selectedFolder } = useUIStore()
	const { setLastAction } = useEmailActionsStore()

	return useMutation({
		mutationFn: ({
			threads,
			addLabels,
			removeLabels,
		}: {
			threads: EmailThread[]
			addLabels: string[]
			removeLabels: string[]
		}) => {
			setLastAction({
				type: "modifyLabels",
				emails: threads,
				previousValues: [addLabels, removeLabels],
			})

			return modifyLabels(
				selectedAccountId || "",
				threads,
				addLabels,
				removeLabels
			)
		},
		onMutate: async ({ threads, addLabels, removeLabels }) => {
			await queryClient.cancelQueries({
				queryKey: ["emails", selectedFolder?.id, selectedAccountId],
			})

			const previousEmails = queryClient.getQueryData<EmailThread[]>([
				"emails",
				selectedFolder?.id,
				selectedAccountId,
			])

			queryClient.setQueryData<EmailThread[]>(
				["emails", selectedFolder?.id, selectedAccountId],
				(old) => old?.filter((e) => !threads.includes(e))
			)

			queryClient.setQueryData<EmailThread[]>(
				["emails", addLabels[0], selectedAccountId],
				(old) => [...(old || []), ...threads]
			)

			queryClient.setQueryData<EmailThread[]>(
				["emails", removeLabels[0], selectedAccountId],
				(old) => old?.filter((e) => !threads.includes(e))
			)

			return { previousEmails }
		},
		onError: (err, variables, context) => {
			queryClient.setQueryData(
				["emails", selectedFolder?.id, selectedAccountId],
				context?.previousEmails
			)
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ["emails", selectedFolder?.id, selectedAccountId],
			})
		},
	})
}

export const useCreateDraft = () => {
	const queryClient = useQueryClient()
	const { selectedAccountId } = useAccountStore()
	const { selectedFolder } = useUIStore()
	return useMutation({
		mutationFn: ({
			to,
			cc,
			bcc,
			subject,
			body,
			draftId,
			attachmentsToDelete,
			attachmentsToAdd,
		}: {
			to: EmailParticipant[]
			cc: EmailParticipant[]
			bcc: EmailParticipant[]
			subject: string
			body: string
			attachmentsToDelete: DraftAttachment[]
			attachmentsToAdd: DraftAttachment[]
			draftId?: string
		}) =>
			createDraft(
				selectedAccountId || "",
				to,
				cc,
				bcc,
				subject,
				body,
				attachmentsToAdd,
				attachmentsToDelete,
				draftId
			),
		onMutate: async ({
			to,
			cc,
			bcc,
			subject,
			body,
			draftId,
			attachmentsToDelete,
		}) => {
			await queryClient.cancelQueries({
				queryKey: ["emails", selectedFolder?.id, selectedAccountId],
			})

			const previousEmails = queryClient.getQueryData<EmailThread[]>([
				"emails",
				selectedFolder?.id,
				selectedAccountId,
			])

			queryClient.setQueryData<EmailThread[]>(
				["emails", selectedFolder?.id, selectedAccountId],
				(old) =>
					old?.map((thread) => {
						if (thread.id === draftId) {
							return {
								...thread,
								messages: [
									{
										...thread.messages[0],
										to: { to: to, cc: cc, bcc: bcc },
										subject,
										body,
									},
								],
							}
						}
						return thread
					})
			)

			return { previousEmails }
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["emails", selectedFolder?.id, selectedAccountId],
			})
		},
	})
}

export const useDiscardDraft = () => {
	const queryClient = useQueryClient()
	const { selectedAccountId } = useAccountStore()
	const { selectedFolder } = useUIStore()
	return useMutation({
		mutationFn: (draftIds: string[]) =>
			discardDraft(draftIds, selectedAccountId || ""),
		onMutate: async (draftIds) => {
			await queryClient.cancelQueries({
				queryKey: ["emails", selectedFolder?.id, selectedAccountId],
			})

			const previousEmails = queryClient.getQueryData<EmailThread[]>([
				"emails",
				selectedFolder?.id,
				selectedAccountId,
			])

			queryClient.setQueryData<EmailThread[]>(
				["emails", selectedFolder?.id, selectedAccountId],
				(old) => old?.filter((e) => !draftIds.includes(e.id))
			)

			return { previousEmails }
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["emails", selectedFolder?.id, selectedAccountId],
			})
		},
	})
}
