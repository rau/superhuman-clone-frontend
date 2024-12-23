import {
	fetchAuthTokens,
	fetchContacts,
	fetchEmails,
	fetchFolderEmails,
	fetchFolders,
	markEmailDone,
	markEmailRead,
	searchEmails,
	sendEmail,
} from "@/services/googleServices"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useUIStore } from "./useUIStore"

export const useAuth = () => {
	return useQuery<GoogleAuthToken[]>({
		queryKey: ["auth"],
		queryFn: fetchAuthTokens,
		staleTime: Infinity,
	})
}

export const useEmails = () => {
	return useQuery<EmailThread[]>({
		queryKey: ["emails"],
		queryFn: fetchEmails,
		staleTime: 1000 * 60 * 5,
	})
}

export const useContacts = () => {
	return useQuery<Contact[]>({
		queryKey: ["contacts"],
		queryFn: fetchContacts,
		staleTime: 1000 * 60 * 5,
	})
}

export const sendEmailMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: sendEmail,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["emails"] })
		},
	})
}

export const useSearchEmails = (query: string) => {
	return useQuery<EmailThread[]>({
		queryKey: ["search", query],
		queryFn: () => searchEmails(query),
		enabled: false,
		staleTime: 1000 * 60 * 5,
	})
}

export const useMarkEmailDone = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: markEmailDone,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["emails"] })
		},
	})
}

export const useMarkEmailRead = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: markEmailRead,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["emails"] })
		},
	})
}

export const useFolders = () => {
	return useQuery<Folder[]>({
		queryKey: ["folders"],
		queryFn: fetchFolders,
		placeholderData: [],
		staleTime: 1000 * 60 * 5,
		retry: 2,
		refetchOnWindowFocus: false,
	})
}

export const useFolderEmails = () => {
	const { selectedFolder } = useUIStore()
	return useQuery({
		queryKey: ["emails", selectedFolder?.id],
		queryFn: () => fetchFolderEmails(selectedFolder?.id || "inbox"),
		enabled: true,
		staleTime: 1000 * 60 * 5,
	})
}
