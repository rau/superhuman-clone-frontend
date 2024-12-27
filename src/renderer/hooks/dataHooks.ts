import { useAccountStore } from "@/hooks/useAccountStore"
import { useUIStore } from "@/hooks/useUIStore"
import {
	createDoneFolder,
	fetchAccounts,
	fetchContacts,
	fetchEmails,
	fetchFolderEmails,
	fetchFolders,
	markEmailDone,
	markEmailRead,
	searchEmails,
	sendEmail,
	SendEmailPayload,
	signOutAccount,
} from "@/services/googleServices"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useEmails = () => {
	const { selectedAccountId } = useAccountStore()

	return useQuery<EmailThread[]>({
		queryKey: ["emails", selectedAccountId],
		queryFn: () => fetchEmails(selectedAccountId || ""),
		enabled: !!selectedAccountId,
		staleTime: 1000 * 60 * 5,
	})
}

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
	const { selectedAccountId } = useAccountStore()
	return useMutation({
		mutationFn: (emailId: string) =>
			markEmailDone(emailId, selectedAccountId || ""),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["emails"] })
		},
	})
}

export const useMarkEmailRead = () => {
	const queryClient = useQueryClient()
	const { selectedAccountId } = useAccountStore()
	return useMutation({
		mutationFn: (emailId: string) =>
			markEmailRead(emailId, selectedAccountId || ""),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["emails"] })
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
