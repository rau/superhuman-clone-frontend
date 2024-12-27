import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Dialog, DialogContent } from "@/components/ui/Dialog"
import { useAccounts, useSignOutAccount } from "@/hooks/dataHooks"
import { useAccountStore } from "@/hooks/useAccountStore"
import { useUIStore } from "@/hooks/useUIStore"
import { GripVertical } from "lucide-react"

export const AccountPickerDialog = () => {
	const { isAccountDialogOpen, setIsAccountDialogOpen, setIsSignInOpen } =
		useUIStore()
	const { setSelectedAccountId } = useAccountStore()
	const { data: accounts } = useAccounts()
	const { mutate: signOut } = useSignOutAccount()

	return (
		<Dialog
			open={isAccountDialogOpen}
			onOpenChange={setIsAccountDialogOpen}
		>
			<DialogContent className="w-fit min-w-[600px]">
				<div className="flex flex-col gap-2">
					<h2 className="pb-2 text-lg">Accounts</h2>
					{accounts?.map((account, index) => (
						<div
							key={account.email}
							className="group flex items-center justify-between rounded-md p-2 hover:bg-slate-50"
							onClick={() => {
								setSelectedAccountId(account.id)
								setIsAccountDialogOpen(false)
							}}
						>
							<div className="flex items-center gap-2">
								<Avatar>
									<AvatarImage
										src={account.picture}
										alt={account.name}
									/>
									<AvatarFallback className="bg-blue-100 text-blue-700">
										{account.name[0]}
									</AvatarFallback>
								</Avatar>
								<span className="text-xs">{account.email}</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
									<div className="cursor-move hover:cursor-grab hover:text-slate-700">
										<GripVertical className="h-4 w-4" />
									</div>
									<span
										className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700"
										onClick={() => signOut(account.id)}
									>
										Sign out
									</span>
								</div>
								<kbd className="rounded-sm bg-slate-100 px-1 py-0.5 text-xs text-slate-500">
									Control
								</kbd>
								<kbd className="rounded-sm bg-slate-100 px-1 py-0.5 text-xs text-slate-500">
									{index}
								</kbd>
							</div>
						</div>
					))}
					<div className="mt-2 flex items-center justify-start gap-1 text-xs">
						<span
							className="text-blue-600 hover:cursor-pointer hover:text-blue-700 hover:underline"
							onClick={() => {
								setIsSignInOpen(true)
								setIsAccountDialogOpen(false)
							}}
						>
							Sign in with your email provider
						</span>
						<span>to add an account</span>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
