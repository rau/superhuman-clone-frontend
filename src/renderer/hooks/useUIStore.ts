import { create } from "zustand"

interface UIState {
	isSearching: boolean
	isShowingEmail: boolean
	isComposing: boolean
	isAccountDialogOpen: boolean
	selectedFolder: Folder | null
	isSettingsOpen: boolean
	isShortcutsPaneOpen: boolean
	isAISettingsOpen: boolean
	setIsSearching: (isSearching: boolean) => void
	setIsShowingEmail: (isShowingEmail: boolean) => void
	setIsComposing: (isComposing: boolean) => void
	setIsAccountDialogOpen: (open: boolean) => void
	setSelectedFolder: (folder: Folder) => void
	setIsSettingsOpen: (open: boolean) => void
	setIsShortcutsPaneOpen: (open: boolean) => void
	setIsAISettingsOpen: (open: boolean) => void
}

const INITIAL_FOLDER: Folder = {
	id: "inbox",
	name: "Inbox",
	type: "system",
	messageCount: 0,
}

export const useUIStore = create<UIState>((set) => ({
	isSearching: false,
	isShowingEmail: false,
	isComposing: false,
	isAccountDialogOpen: false,
	isSettingsOpen: false,
	isShortcutsPaneOpen: false,
	isAISettingsOpen: false,
	selectedFolder: INITIAL_FOLDER,
	setIsSearching: (isSearching) => set({ isSearching }),
	setIsShowingEmail: (isShowingEmail) => set({ isShowingEmail }),
	setIsComposing: (isComposing) => set({ isComposing }),
	setIsAccountDialogOpen: (open) => set({ isAccountDialogOpen: open }),
	setIsSettingsOpen: (open) => set({ isSettingsOpen: open }),
	setSelectedFolder: (folder) => set({ selectedFolder: folder }),
	setIsShortcutsPaneOpen: (open) => set({ isShortcutsPaneOpen: open }),
	setIsAISettingsOpen: (open) => set({ isAISettingsOpen: open }),
}))
