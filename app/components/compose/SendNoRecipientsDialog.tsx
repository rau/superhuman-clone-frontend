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

const SendNoRecipientsDialog = () => {
	const { showNoRecipientsDialog, setShowNoRecipientsDialog } = useUIStore()

	return (
		<Dialog
			open={showNoRecipientsDialog}
			onOpenChange={setShowNoRecipientsDialog}
		>
			<DialogTitle hidden>Send without recipients?</DialogTitle>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Send without recipients?</DialogTitle>
					<DialogDescription>
						You have not selected any recipients. Please select at
						least one recipient before sending.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						onClick={() => setShowNoRecipientsDialog(false)}
						className="rounded-md px-3 py-1.5 text-sm hover:bg-slate-100"
					>
						Exit
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export { SendNoRecipientsDialog }
