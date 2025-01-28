import { create } from "zustand"

type AiPromptMode = "edit" | "draft"

interface AIPromptState {
	aiPrompt: string
	setAiPrompt: (value: string) => void

	originalAiPrompt: string
	setOriginalAiPrompt: (value: string) => void

	aiPromptMode: AiPromptMode
	setAiPromptMode: (mode: AiPromptMode) => void

	showAIPromptContextMenu: boolean
	setShowAIPromptContextMenu: (show: boolean) => void

	aiPromptEdit: string
	setAiPromptEdit: (value: string) => void
}

export const useAIPromptStore = create<AIPromptState>((set) => ({
	aiPrompt: "",
	setAiPrompt: (value) => set({ aiPrompt: value }),

	originalAiPrompt: "",
	setOriginalAiPrompt: (value) => set({ originalAiPrompt: value }),

	aiPromptMode: "draft",
	setAiPromptMode: (mode) => set({ aiPromptMode: mode }),

	showAIPromptContextMenu: false,
	setShowAIPromptContextMenu: (show) =>
		set({ showAIPromptContextMenu: show }),

	aiPromptEdit: "",
	setAiPromptEdit: (value) => set({ aiPromptEdit: value }),
}))
