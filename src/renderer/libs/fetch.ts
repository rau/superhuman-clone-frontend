// @ts-nocheck
import axios, { AxiosRequestConfig } from "axios"

interface FetchParameters {
	method?: string
	data?: Record<string, any>
	params?: Record<string, any>
}

export const fetchWithAxios = async (
	endpoint: string,
	parameters: FetchParameters = {},
	responseType: "json" | "blob" = "json"
) => {
	const formData = new FormData()

	let options: AxiosRequestConfig = {
		method: parameters.method || "GET",
		url: "http://localhost:8000/api/" + endpoint,
		responseType: responseType,
		headers: {},
	}

	if (options.method === "GET" && parameters.params) {
		options.params = parameters.params
	} else if (
		(options.method === "POST" || options.method === "DELETE") &&
		parameters.data
	) {
		options.headers["Content-Type"] = "application/json"
		options.data = parameters.data
	}

	try {
		const res = await axios(options)
		return {
			data: res.data,
			headers: res.headers,
			status: res.status,
			statusText: res.statusText,
		}
	} catch (error: AxiosError | any) {
		console.log(error)
		if (error.response) {
			const errorData = error.response.data
			const errors = errorData.errors
			let message = ""
			errors.forEach((error: any) => {
				message +=
					(error.code === null ? "" : error.code + "\n") +
					(error.detail === null ? "" : error.detail + "\n") +
					(error.attr === null ? "" : error.attr + "\n")
			})
			console.log(message)
		}
		throw error
	}
}
