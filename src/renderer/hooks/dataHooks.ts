import { useQuery } from "@tanstack/react-query"
import { fetchAuthTokens, fetchEmails } from "@/services/googleServices"

export const useAuth = () => {
	return useQuery<GoogleAuthToken[]>({
		queryKey: ["auth"],
		queryFn: fetchAuthTokens,
		staleTime: Infinity,
	})
}

export const useEmails = () => {
	return useQuery<Email[]>({
		queryKey: ["emails"],
		queryFn: fetchEmails,
		staleTime: 1000 * 60 * 5,
	})
}
