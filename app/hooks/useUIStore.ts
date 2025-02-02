import { create } from "zustand"

const INITIAL_FOLDER: Folder = {
	id: "INBOX",
	name: "INBOX",
	type: "system",
	messageCount: 0,
}

interface UIState {
	// Dialog States
	isAccountDialogOpen: boolean
	isAISettingsOpen: boolean
	isAutoAdvanceDialogOpen: boolean
	isAutoBCCDialogOpen: boolean
	isBlockedSendersDialogOpen: boolean
	isDownloadsOpen: boolean
	isEmojiSkinColorOpen: boolean
	isFileDialogOpen: boolean
	isGetMeToZeroOpen: boolean
	isImageSettingsOpen: boolean
	isInstantIntroDialogOpen: boolean
	isMeetingLinksOpen: boolean
	isMoveToDialogOpen: boolean
	isNotificationsOpen: boolean
	isRemindersOpen: boolean
	isSettingsOpen: boolean
	isShortcutsPaneOpen: boolean
	isSignatureDialogOpen: boolean
	isSignInOpen: boolean
	isThemeDialogOpen: boolean
	showEmptySubjectDialog: boolean
	showNoRecipientsDialog: boolean

	// Email Selection States
	selectedFolder: Folder | null
	selectedIndices: Record<string, number>
	selectedThreads: Record<string, Set<string>>
	selectedMessageIndex: number
	moveToDialogIndex: number

	// Message States
	collapsedMessages: Record<number, boolean>
	showReplyPane: boolean
	showAIPrompt: boolean
	isBulkActionsOpen: boolean

	// Dialog Setters
	setIsAccountDialogOpen: (open: boolean) => void
	setIsAISettingsOpen: (open: boolean) => void
	setIsAutoAdvanceDialogOpen: (value: boolean) => void
	setIsAutoBCCDialogOpen: (value: boolean) => void
	setIsBlockedSendersDialogOpen: (value: boolean) => void
	setIsDownloadsOpen: (value: boolean) => void
	setIsEmojiSkinColorOpen: (value: boolean) => void
	setIsFileDialogOpen: (value: boolean) => void
	setIsGetMeToZeroOpen: (value: boolean) => void
	setIsImageSettingsOpen: (value: boolean) => void
	setIsInstantIntroDialogOpen: (value: boolean) => void
	setIsMeetingLinksOpen: (value: boolean) => void
	setIsMoveToDialogOpen: (value: boolean) => void
	setIsNotificationsOpen: (value: boolean) => void
	setIsRemindersOpen: (value: boolean) => void
	setIsSettingsOpen: (open: boolean) => void
	setIsShortcutsPaneOpen: (open: boolean) => void
	setIsSignatureDialogOpen: (value: boolean) => void
	setIsSignInOpen: (value: boolean) => void
	setIsThemeDialogOpen: (value: boolean) => void
	setShowEmptySubjectDialog: (value: boolean) => void
	setShowNoRecipientsDialog: (value: boolean) => void

	// Selection Setters
	setSelectedFolder: (folder: Folder) => void
	setSelectedIndex: (folderId: string, index: number) => void
	setSelectedMessageIndex: (index: number) => void
	setSelectedThreads: (folderId: string, threadIds: Set<string>) => void
	setMoveToDialogIndex: (index: number) => void
	toggleThreadSelection: (folderId: string, threadId: string) => void
	clearSelectedThreads: (folderId: string) => void

	// Message State Setters
	setCollapsedMessages: (value: Record<number, boolean>) => void
	setShowReplyPane: (value: boolean) => void
	setShowAIPrompt: (value: boolean) => void
	setIsBulkActionsOpen: (value: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
	// Dialog States
	isAccountDialogOpen: false,
	isAISettingsOpen: false,
	isAutoAdvanceDialogOpen: false,
	isAutoBCCDialogOpen: false,
	isBlockedSendersDialogOpen: false,
	isDownloadsOpen: false,
	isEmojiSkinColorOpen: false,
	isFileDialogOpen: false,
	isGetMeToZeroOpen: false,
	isImageSettingsOpen: false,
	isInstantIntroDialogOpen: false,
	isMeetingLinksOpen: false,
	isMoveToDialogOpen: false,
	isNotificationsOpen: false,
	isRemindersOpen: false,
	isSettingsOpen: false,
	isShortcutsPaneOpen: false,
	isSignatureDialogOpen: false,
	isSignInOpen: false,
	isThemeDialogOpen: false,
	showEmptySubjectDialog: false,
	showNoRecipientsDialog: false,

	// Email Selection States
	selectedFolder: INITIAL_FOLDER,
	selectedIndices: {},
	selectedThreads: {},
	selectedMessageIndex: 0,
	moveToDialogIndex: 0,

	// Message States
	collapsedMessages: {},
	showReplyPane: false,
	showAIPrompt: false,
	isBulkActionsOpen: false,

	// Dialog Setters
	setIsAccountDialogOpen: (open) => set({ isAccountDialogOpen: open }),
	setIsAISettingsOpen: (open) => set({ isAISettingsOpen: open }),
	setIsAutoAdvanceDialogOpen: (value) =>
		set({ isAutoAdvanceDialogOpen: value }),
	setIsAutoBCCDialogOpen: (value) => set({ isAutoBCCDialogOpen: value }),
	setIsBlockedSendersDialogOpen: (value) =>
		set({ isBlockedSendersDialogOpen: value }),
	setIsDownloadsOpen: (value) => set({ isDownloadsOpen: value }),
	setIsEmojiSkinColorOpen: (value) => set({ isEmojiSkinColorOpen: value }),
	setIsFileDialogOpen: (value) => set({ isFileDialogOpen: value }),
	setIsGetMeToZeroOpen: (value) => set({ isGetMeToZeroOpen: value }),
	setIsImageSettingsOpen: (value) => set({ isImageSettingsOpen: value }),
	setIsInstantIntroDialogOpen: (value) =>
		set({ isInstantIntroDialogOpen: value }),
	setIsMeetingLinksOpen: (value) => set({ isMeetingLinksOpen: value }),
	setIsMoveToDialogOpen: (value) => set({ isMoveToDialogOpen: value }),
	setIsNotificationsOpen: (value) => set({ isNotificationsOpen: value }),
	setIsRemindersOpen: (value) => set({ isRemindersOpen: value }),
	setIsSettingsOpen: (open) => set({ isSettingsOpen: open }),
	setIsShortcutsPaneOpen: (open) => set({ isShortcutsPaneOpen: open }),
	setIsSignatureDialogOpen: (value) => set({ isSignatureDialogOpen: value }),
	setIsSignInOpen: (value) => set({ isSignInOpen: value }),
	setIsThemeDialogOpen: (value) => set({ isThemeDialogOpen: value }),
	setShowEmptySubjectDialog: (value) =>
		set({ showEmptySubjectDialog: value }),
	setShowNoRecipientsDialog: (value) =>
		set({ showNoRecipientsDialog: value }),

	// Selection Setters
	setSelectedFolder: (folder) => set({ selectedFolder: folder }),
	setSelectedIndex: (folderId, index) =>
		set((state) => ({
			selectedIndices: { ...state.selectedIndices, [folderId]: index },
		})),
	setSelectedMessageIndex: (index) => set({ selectedMessageIndex: index }),
	setSelectedThreads: (folderId, threadIds) =>
		set((state) => ({
			selectedThreads: {
				...state.selectedThreads,
				[folderId]: threadIds,
			},
		})),
	setMoveToDialogIndex: (index) => set({ moveToDialogIndex: index }),
	toggleThreadSelection: (folderId, threadId) =>
		set((state) => {
			const currentSet = state.selectedThreads[folderId] || new Set()
			const newSet = new Set(currentSet)
			if (newSet.has(threadId)) newSet.delete(threadId)
			else newSet.add(threadId)
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

	// Message State Setters
	setCollapsedMessages: (value) => set({ collapsedMessages: value }),
	setShowReplyPane: (value) => set({ showReplyPane: value }),
	setShowAIPrompt: (value) => set({ showAIPrompt: value }),
	setIsBulkActionsOpen: (value) => set({ isBulkActionsOpen: value }),
}))
