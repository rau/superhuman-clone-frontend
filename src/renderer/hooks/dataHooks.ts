import {
	fetchAuthTokens,
	fetchContacts,
	fetchEmails,
	markEmailDone,
	markEmailRead,
	searchEmails,
	sendEmail,
} from "@/services/googleServices"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

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
