import { Button } from "@/components/ui/Button"
import { useUIStore } from "@/hooks/useUIStore"
import { initiateGoogleAuth } from "@/services/googleServices"
import { ChevronLeft } from "lucide-react"

export const SignInPane = () => {
	const { setIsSignInOpen } = useUIStore()

	const handleGmailLogin = async () => {
		try {
			await initiateGoogleAuth()
		} catch (err) {
			console.error("Gmail auth failed", err)
		}
	}

	return (
		<div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-400">
			<Button
				variant="ghost"
				className="absolute left-4 top-4 text-white hover:bg-white/10"
				onClick={() => setIsSignInOpen(false)}
			>
				<ChevronLeft className="h-4 w-4" />
				<span>Back</span>
			</Button>
			<div className="flex w-[400px] flex-col items-center gap-8 rounded-lg bg-white p-8 shadow-lg">
				<h1 className="text-2xl font-light tracking-wide text-slate-700">
					SUPERHUMAN
				</h1>
				<p className="text-center text-slate-600">
					The fastest email experience ever made.
				</p>
				<div className="flex w-full flex-col gap-2">
					<Button
						variant="secondary"
						className="w-full"
						onClick={handleGmailLogin}
					>
						Sign in with Google
					</Button>
					<Button
						variant="secondary"
						className="w-full"
						onClick={() =>
							window.electron.auth.signInWithMicrosoft()
						}
					>
						Sign in with Microsoft
					</Button>
				</div>
			</div>
		</div>
	)
}
