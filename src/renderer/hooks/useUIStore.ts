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
	isQuickTipsOpen: boolean
	isDownloadsOpen: boolean
	isImageSettingsOpen: boolean
	isSignInOpen: boolean
	isThemeDialogOpen: boolean
	selectedIndices: Record<string, number>
	setIsSearching: (isSearching: boolean) => void
	setIsShowingEmail: (isShowingEmail: boolean) => void
	setIsComposing: (isComposing: boolean) => void
	setIsAccountDialogOpen: (open: boolean) => void
	setSelectedFolder: (folder: Folder) => void
	setIsSettingsOpen: (open: boolean) => void
	setIsShortcutsPaneOpen: (open: boolean) => void
	setIsAISettingsOpen: (open: boolean) => void
	setIsQuickTipsOpen: (open: boolean) => void
	setIsDownloadsOpen: (value: boolean) => void
	setIsImageSettingsOpen: (value: boolean) => void
	setIsSignInOpen: (value: boolean) => void
	setSelectedIndex: (folderId: string, index: number) => void
	setIsThemeDialogOpen: (value: boolean) => void
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
	isQuickTipsOpen: true,
	isDownloadsOpen: false,
	isImageSettingsOpen: false,
	isSignInOpen: false,
	selectedIndices: {},
	isThemeDialogOpen: false,
	setIsSearching: (isSearching) => set({ isSearching }),
	setIsShowingEmail: (isShowingEmail) => set({ isShowingEmail }),
	setIsComposing: (isComposing) => set({ isComposing }),
	setIsAccountDialogOpen: (open) => set({ isAccountDialogOpen: open }),
	setIsSettingsOpen: (open) => set({ isSettingsOpen: open }),
	setSelectedFolder: (folder) => set({ selectedFolder: folder }),
	setIsShortcutsPaneOpen: (open) => set({ isShortcutsPaneOpen: open }),
	setIsAISettingsOpen: (open) => set({ isAISettingsOpen: open }),
	setIsQuickTipsOpen: (open) => set({ isQuickTipsOpen: open }),
	setIsDownloadsOpen: (value) => set({ isDownloadsOpen: value }),
	setIsImageSettingsOpen: (value) => set({ isImageSettingsOpen: value }),
	setIsSignInOpen: (value) => set({ isSignInOpen: value }),
	setSelectedIndex: (folderId, index) =>
		set((state) => ({
			selectedIndices: { ...state.selectedIndices, [folderId]: index },
		})),
	setIsThemeDialogOpen: (value) => set({ isThemeDialogOpen: value }),
}))
