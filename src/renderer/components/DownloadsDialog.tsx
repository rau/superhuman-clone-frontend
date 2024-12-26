import { Dialog, DialogContent } from "@/components/ui/Dialog"
import { useUIStore } from "@/hooks/useUIStore"
import { ChevronDown } from "lucide-react"
import { Button } from "./ui/Button"

export const DownloadsDialog = () => {
	const { isDownloadsOpen, setIsDownloadsOpen } = useUIStore()

	return (
		<Dialog open={isDownloadsOpen} onOpenChange={setIsDownloadsOpen}>
			<DialogContent className="w-fit">
				<div className="flex flex-col gap-6 p-6">
					<h2 className="text-xl font-semibold">Downloads</h2>
					<p className="text-sm text-slate-600">
						Choose where to download attachments.
					</p>
					<div className="flex items-center gap-2">
						<span className="text-sm">
							Download attachments to:
						</span>
						<Button
							variant="outline"
							className="flex items-center gap-2"
						>
							<span>Downloads</span>
							<ChevronDown className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
