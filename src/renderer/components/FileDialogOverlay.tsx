import { useUIStore } from "@/hooks/useUIStore"

export const FileDialogOverlay = () => {
	const { isFileDialogOpen } = useUIStore()

	if (!isFileDialogOpen) return null

	return <div className="fixed inset-0 z-[9999] bg-black/50" />
}
