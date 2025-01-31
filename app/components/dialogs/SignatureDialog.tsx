import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select"
import { useAccounts } from "@/hooks/dataHooks"
import { useUIStore } from "@/hooks/useUIStore"
import Link from "next/link"

export const SignatureDialog = () => {
	const { isSignatureDialogOpen, setIsSignatureDialogOpen } = useUIStore()
	const { data: accounts } = useAccounts()

	return (
		<Dialog
			open={isSignatureDialogOpen}
			onOpenChange={setIsSignatureDialogOpen}
		>
			<DialogTitle hidden>Signatures</DialogTitle>
			<DialogContent className="w-[600px]">
				<div className="flex flex-col gap-4">
					<h2 className="text-xl font-semibold">Signatures</h2>
					<div className="flex h-fit flex-row items-center gap-2">
						<p className="text-xs text-slate-600">Signature for:</p>
						<Select>
							<SelectTrigger className="h-2 w-fit border-none text-xs text-slate-600">
								<SelectValue
									placeholder={accounts?.[0]?.email}
								/>
							</SelectTrigger>
							<SelectContent>
								{accounts?.map((account) => (
									<SelectItem
										key={account.email}
										value={account.email}
									>
										{account.email}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="flex flex-row gap-1 text-xs text-slate-600">
						<p>To add a signature, please visit </p>
						<Link
							href={`https://mail.google.com/?shxr=0&authuser=${accounts?.[0]?.email}`}
							target="_blank"
						>
							<p className="text-xs text-blue-500 hover:text-blue-700 hover:underline">
								Gmail settings
							</p>
						</Link>{" "}
						<p>and then reload Superhuman.</p>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
