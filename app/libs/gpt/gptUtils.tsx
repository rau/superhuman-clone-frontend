"use server"

import { OpenAI } from "openai"
import {
	draftMakeLongerSystemPrompt,
	draftMakeLongerUserPrompt,
	draftMakeShorterSystemPrompt,
	draftMakeShorterUserPrompt,
	draftSystemPrompt,
	draftUserPrompt,
	editSystemPrompt,
	editUserPrompt,
	fixSpellingAndGrammarSystemPrompt,
	fixSpellingAndGrammarUserPrompt,
	improveWritingSystemPrompt,
	improveWritingUserPrompt,
	simplifySystemPrompt,
	simplifyUserPrompt,
	updateUserPrompt,
} from "./gptStrings"

type ChatMessage = {
	role: ChatMessageRole
	content: string
}

enum ChatMessageRole {
	System = "system",
	User = "user",
	Assistant = "assistant",
}

export const getGptClient = async () => {
	return new OpenAI({
		// baseURL: "https://api.deepseek.com/v1",
		// apiKey: process.env.DEEPSEEK_API_KEY,
		baseURL: "http://127.0.0.1:1234/v1",
		apiKey: "sk-proj-1234567890",
	})
}

export const queryGpt = async (messages: ChatMessage[]) => {
	const client = await getGptClient()
	const results = await client.chat.completions.create({
		model: "hugging-quants/Llama-3.2-1B-Instruct-Q8_0-GGUF",
		messages: messages,
	})
	return results.choices[0].message.content
}

export const queryGptDraft = async (prompt: string) => {
	const messages = [
		{ role: ChatMessageRole.System, content: draftSystemPrompt },
		{ role: ChatMessageRole.User, content: draftUserPrompt + prompt },
	]
	return queryGpt(messages)
}

export const queryGptDraftMakeShorter = async (prompt: string) => {
	const messages = [
		{ role: ChatMessageRole.System, content: draftMakeShorterSystemPrompt },
		{
			role: ChatMessageRole.User,
			content: draftMakeShorterUserPrompt + prompt,
		},
	]
	return queryGpt(messages)
}

export const queryGptDraftMakeLonger = async (prompt: string) => {
	const messages = [
		{ role: ChatMessageRole.System, content: draftMakeLongerSystemPrompt },
		{
			role: ChatMessageRole.User,
			content: draftMakeLongerUserPrompt + prompt,
		},
	]
	return queryGpt(messages)
}

export const queryGptImproveWriting = async (prompt: string) => {
	const messages = [
		{ role: ChatMessageRole.System, content: improveWritingSystemPrompt },
		{
			role: ChatMessageRole.User,
			content: improveWritingUserPrompt + prompt,
		},
	]
	return queryGpt(messages)
}

export const queryGptDraftSimplify = async (prompt: string) => {
	const messages = [
		{ role: ChatMessageRole.System, content: simplifySystemPrompt },
		{ role: ChatMessageRole.User, content: simplifyUserPrompt + prompt },
	]
	return queryGpt(messages)
}

export const queryGptFixSpellingAndGrammar = async (prompt: string) => {
	const messages = [
		{
			role: ChatMessageRole.System,
			content: fixSpellingAndGrammarSystemPrompt,
		},
		{
			role: ChatMessageRole.User,
			content: fixSpellingAndGrammarUserPrompt + prompt,
		},
	]
	return queryGpt(messages)
}

export const queryGptEdit = async (
	editInstructions: string,
	partToEdit: string
) => {
	const messages = [
		{ role: ChatMessageRole.System, content: editSystemPrompt },
		{
			role: ChatMessageRole.User,
			content:
				editUserPrompt + "\n" + editInstructions + "\n" + partToEdit,
		},
	]
	return queryGpt(messages)
}

export const queryGptUpdate = async (
	updateInstructions: string,
	partToUpdate: string
) => {
	const messages = [
		{ role: ChatMessageRole.System, content: editSystemPrompt },
		{
			role: ChatMessageRole.User,
			content:
				updateUserPrompt +
				"\n" +
				updateInstructions +
				"\n" +
				partToUpdate,
		},
	]
	return queryGpt(messages)
}
