interface Window {
	electron: {
		openFile: () => Promise<{ canceled: boolean; filePaths: string[] }>
		getFileStats: (path: string) => Promise<{ size: number }>
		readFile: (path: string) => Promise<string>
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
