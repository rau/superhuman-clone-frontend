import { Avatar, AvatarFallback } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import { Dialog, DialogContent } from "@/components/ui/Dialog"
import { useUIStore } from "@/hooks/useUIStore"

const accounts = [
	{ email: "rdaga@college.harvard.edu", initial: "R" },
	{ email: "work@company.com", initial: "W" },
	{ email: "personal@gmail.com", initial: "P" },
]

export const AccountPickerDialog = () => {
	const { isAccountDialogOpen, setIsAccountDialogOpen } = useUIStore()

	return (
		<Dialog
			open={isAccountDialogOpen}
			onOpenChange={setIsAccountDialogOpen}
		>
			<DialogContent className="w-[400px]">
				<div className="flex flex-col gap-2">
					{accounts.map((account) => (
						<Button
							key={account.email}
							variant="ghost"
							className="flex h-auto items-center justify-start gap-3 p-3"
						>
							<Avatar>
								<AvatarFallback className="bg-blue-100 text-blue-700">
									{account.initial}
								</AvatarFallback>
							</Avatar>
							<span className="text-sm">{account.email}</span>
						</Button>
					))}
				</div>
			</DialogContent>
		</Dialog>
	)
}
