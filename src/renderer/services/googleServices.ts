import { fetchWithAxios } from "@/libs/fetch"

export const initiateGoogleAuth = async () => {
	try {
		const { data } = await fetchWithAxios("auth/gmail/", {
			method: "GET",
		})
		console.log(data, "data")
		window.electron.ipcRenderer.sendMessage(
			"open-external-url",
			data.auth_url
		)
	} catch (err) {
		console.error("Error initiating Google auth", err)
	}
}

export const fetchAuthTokens = async (): Promise<GoogleAuthToken[]> => {
	const { data } = await fetchWithAxios("tokens/", {
		method: "GET",
	})
	return data
}

export const fetchEmails = async (): Promise<Email[]> => {
	const { data } = await fetchWithAxios("emails/", {
		method: "GET",
	})

	return data.map((email: any) => ({
		...email,
		date: new Date(email.date),
	}))
}
