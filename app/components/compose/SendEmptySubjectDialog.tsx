import { Button } from "@/components/ui/Button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/Dialog"
import { useUIStore } from "@/hooks/useUIStore"
import { sendEmail } from "@/libs/composeUtils"
import { useFormContext } from "react-hook-form"

const SendEmptySubjectDialog = () => {
	const { showEmptySubjectDialog, setShowEmptySubjectDialog } = useUIStore()
	const form = useFormContext<ComposeFormData>()
	const send = sendEmail(form)

	return (
		<Dialog
			open={showEmptySubjectDialog}
			onOpenChange={setShowEmptySubjectDialog}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Send without subject?</DialogTitle>
					<DialogDescription>
						Are you sure you want to send this email without a
						subject?
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						onClick={() => setShowEmptySubjectDialog(false)}
						className="rounded-md px-3 py-1.5 text-sm hover:bg-slate-100"
					>
						Cancel
					</Button>
					<Button
						onClick={send}
						className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
					>
						Send anyway
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export { SendEmptySubjectDialog }
