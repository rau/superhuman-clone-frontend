import { useAccountStore } from "@/hooks/useAccountStore"
import { useEmailActionsStore } from "@/hooks/useEmailActionsStore"
import { useUIStore } from "@/hooks/useUIStore"
import {
	createDoneFolder,
	fetchAccounts,
	fetchContacts,
	fetchFolderEmails,
	fetchFolders,
	markEmailDone,
	markEmailRead,
	markEmailUndone,
	searchEmails,
	sendEmail,
	SendEmailPayload,
	signOutAccount,
	starEmail,
} from "@/services/googleServices"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useContacts = () => {
	const { selectedAccountId } = useAccountStore()
	return useQuery<Contact[]>({
		queryKey: ["contacts", selectedAccountId],
		queryFn: () => fetchContacts(selectedAccountId || ""),
		enabled: !!selectedAccountId,
		staleTime: 1000 * 60 * 5,
	})
}

export const sendEmailMutation = () => {
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
	const selectedIndex = selectedIndices[selectedFolder?.id || "inbox"] || 0

	return useMutation({
		mutationFn: (email: EmailThread) =>
			markEmailDone(email, selectedAccountId || ""),
		onMutate: async (email) => {
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
				email: email,
				previousValue: false,
			})

			queryClient.setQueryData<EmailThread[]>(
				["emails", selectedFolder?.id, selectedAccountId],
				(old) => old?.filter((e) => e.id !== email.id)
			)

			if (emails && selectedIndex < emails.length - 1) {
				setSelectedIndex(
					selectedFolder?.id || "inbox",
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
		mutationFn: (email: EmailThread) =>
			markEmailUndone(email, selectedAccountId || ""),
		onMutate: async (email) => {
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
					(old) => [...(old || []), lastAction.email]
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
			email,
			read,
		}: {
			email: EmailThread
			read: boolean
		}) => {
			setLastAction({
				type: "read",
				email: email,
				previousValue: email.messages[0].read,
			})
			return markEmailRead(email, selectedAccountId || "", read)
		},
		onMutate: async ({ email, read }) => {
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
						e.id === email.id
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
				selectedFolder?.id || "inbox",
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
			email,
			star,
		}: {
			email: EmailThread
			star: boolean
		}) => {
			setLastAction({
				type: "star",
				email,
				previousValue: email.starred,
			})
			return starEmail(email, selectedAccountId || "", star)
		},
		onMutate: async ({ email, star }) => {
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
						e.id === email.id ? { ...e, starred: star } : e
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
