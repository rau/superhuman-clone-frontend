import { OpenAI } from "llamaindex"

export const getGptClient = () => {
	return new OpenAI({
		apiKey: process.env.AZURE_OPENAI_KEY,
		model: process.env.AZURE_OPENAI_DEPLOYMENT,
		azure: {
			endpoint: process.env.AZURE_OPENAI_ENDPOINT,
		},
	})
}

export const queryGpt = async (prompt: string) => {
	const llm = getGptClient()

	const results = await llm.complete({
		prompt,
	})
	return results.text
}
