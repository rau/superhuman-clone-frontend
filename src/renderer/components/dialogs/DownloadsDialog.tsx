import { Dialog, DialogContent } from "@/components/ui/Dialog"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select"
import { useSettingsStore } from "@/hooks/useSettingsStore"
import { useUIStore } from "@/hooks/useUIStore"

export const DownloadsDialog = () => {
	const { isDownloadsOpen, setIsDownloadsOpen } = useUIStore()
	const { downloadPath, setDownloadPath } = useSettingsStore()

	const handleDownloadPathChange = async (path: string) => {
		if (path === "custom") {
			const result = await window.electron.showOpenDialog()
			if (!result.canceled && result.filePaths.length > 0) {
				setDownloadPath(result.filePaths[0])
			}
		} else {
			setDownloadPath(path)
		}
	}

	return (
		<Dialog open={isDownloadsOpen} onOpenChange={setIsDownloadsOpen}>
			<DialogContent className="w-2/3">
				<div className="flex w-full flex-col gap-6 p-2">
					<h2 className="text-xl font-semibold">Downloads</h2>
					<p className="text-sm text-slate-600">
						Choose where to download attachments.
					</p>
					<div className="flex items-center gap-2">
						<span className="w-1/2 text-xs">
							Download attachments to:
						</span>
						<Select
							value={downloadPath}
							onValueChange={handleDownloadPathChange}
						>
							<SelectTrigger className="w-1/2">
								<SelectValue>
									{downloadPath === "Downloads"
										? "Downloads"
										: downloadPath === "Desktop"
											? "Desktop"
											: downloadPath}
								</SelectValue>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Downloads">
									Downloads
								</SelectItem>
								<SelectItem value="Desktop">Desktop</SelectItem>
								<SelectItem value="custom">
									<span>Choose folder...</span>
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
