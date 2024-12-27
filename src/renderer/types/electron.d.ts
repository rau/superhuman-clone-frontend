interface Window {
	electron: {
		openFile: () => Promise<{ canceled: boolean; filePaths: string[] }>
		getFileStats: (path: string) => Promise<{ size: number }>
		openExternalUrl: (url: string) => void
		showOpenDialog: () => Promise<{
			canceled: boolean
			filePaths: string[]
		}>
		auth: {
			signInWithGoogle: () => Promise<void>
			signInWithMicrosoft: () => Promise<void>
		}
	}
}
