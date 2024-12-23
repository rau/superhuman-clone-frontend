import { create } from "zustand"

interface UIState {
	isSearching: boolean
	isShowingEmail: boolean
	isComposing: boolean
	isAccountDialogOpen: boolean
	selectedFolder: Folder | null
	setIsSearching: (isSearching: boolean) => void
	setIsShowingEmail: (isShowingEmail: boolean) => void
	setIsComposing: (isComposing: boolean) => void
	setIsAccountDialogOpen: (open: boolean) => void
	setSelectedFolder: (folder: Folder) => void
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
	selectedFolder: INITIAL_FOLDER,
	setIsSearching: (isSearching) => set({ isSearching }),
	setIsShowingEmail: (isShowingEmail) => set({ isShowingEmail }),
	setIsComposing: (isComposing) => set({ isComposing }),
	setIsAccountDialogOpen: (open) => set({ isAccountDialogOpen: open }),
	setSelectedFolder: (folder) => set({ selectedFolder: folder }),
}))
