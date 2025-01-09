import { create } from "zustand"

interface UIState {
	isSearching: boolean
	isShowingEmail: boolean
	isComposing: boolean
	isAccountDialogOpen: boolean
	isSettingsOpen: boolean
	isShortcutsPaneOpen: boolean
	isAISettingsOpen: boolean
	isQuickTipsOpen: boolean
	isDownloadsOpen: boolean
	isImageSettingsOpen: boolean
	isSignInOpen: boolean
	isThemeDialogOpen: boolean
	isMoveToDialogOpen: boolean
	selectedIndices: Record<string, number>
	selectedThreads: Record<string, Set<string>>
	selectedFolder: Folder | null
	selectedMessageIndex: number
	setSelectedMessageIndex: (index: number) => void
	showReplyPane: boolean
	setShowReplyPane: (value: boolean) => void
	collapsedMessages: Record<number, boolean>
	setCollapsedMessages: (value: Record<number, boolean>) => void
	isFileDialogOpen: boolean
	setIsFileDialogOpen: (value: boolean) => void

	showEmptySubjectDialog: boolean
	showNoRecipientsDialog: boolean
	setShowEmptySubjectDialog: (value: boolean) => void
	setShowNoRecipientsDialog: (value: boolean) => void
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
	setSelectedThreads: (folderId: string, threadIds: Set<string>) => void
	toggleThreadSelection: (folderId: string, threadId: string) => void
	clearSelectedThreads: (folderId: string) => void
	setIsMoveToDialogOpen: (value: boolean) => void

	moveToDialogIndex: number
	setMoveToDialogIndex: (index: number) => void
}

const INITIAL_FOLDER: Folder = {
	id: "INBOX",
	name: "INBOX",
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
	selectedThreads: {},
	isMoveToDialogOpen: false,
	moveToDialogIndex: 0,
	showReplyPane: false,
	showEmptySubjectDialog: false,
	showNoRecipientsDialog: false,
	selectedMessageIndex: 0,
	collapsedMessages: {},
	isFileDialogOpen: false,
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
	setSelectedThreads: (folderId, threadIds) =>
		set((state) => ({
			selectedThreads: {
				...state.selectedThreads,
				[folderId]: threadIds,
			},
		})),
	toggleThreadSelection: (folderId, threadId) =>
		set((state) => {
			const currentSet = state.selectedThreads[folderId] || new Set()
			const newSet = new Set(currentSet)
			if (newSet.has(threadId)) {
				newSet.delete(threadId)
			} else {
				newSet.add(threadId)
			}
			return {
				selectedThreads: {
					...state.selectedThreads,
					[folderId]: newSet,
				},
			}
		}),
	clearSelectedThreads: (folderId) =>
		set((state) => ({
			selectedThreads: {
				...state.selectedThreads,
				[folderId]: new Set(),
			},
		})),
	setIsMoveToDialogOpen: (value) => set({ isMoveToDialogOpen: value }),
	setMoveToDialogIndex: (index) => set({ moveToDialogIndex: index }),
	setSelectedMessageIndex: (index) => set({ selectedMessageIndex: index }),
	setShowReplyPane: (value) => set({ showReplyPane: value }),
	setCollapsedMessages: (value) => set({ collapsedMessages: value }),
	setShowEmptySubjectDialog: (value) =>
		set({ showEmptySubjectDialog: value }),
	setIsFileDialogOpen: (value) => set({ isFileDialogOpen: value }),
	setShowNoRecipientsDialog: (value) =>
		set({ showNoRecipientsDialog: value }),
}))
