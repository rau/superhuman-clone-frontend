import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog"
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
	const { settings, setSettings } = useSettingsStore()

	const handleDownloadPathChange = async (path: string) => {
		if (path === "custom") {
			const input = document.createElement("input")
			input.type = "file"
			input.webkitdirectory = true

			input.onchange = (e) => {
				const files = (e.target as HTMLInputElement).files
				if (files && files[0]) {
					const path = files[0].webkitRelativePath.split("/")[0]
					setSettings({ downloadPath: path })
				}
			}

			input.click()
		} else {
			setSettings({ downloadPath: path })
		}
	}

	return (
		<Dialog open={isDownloadsOpen} onOpenChange={setIsDownloadsOpen}>
			<DialogTitle hidden>Select your download path</DialogTitle>
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
							value={settings.downloadPath}
							onValueChange={handleDownloadPathChange}
						>
							<SelectTrigger className="w-1/2">
								<SelectValue>
									{settings.downloadPath === "Downloads"
										? "Downloads"
										: settings.downloadPath === "Desktop"
											? "Desktop"
											: settings.downloadPath}
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
