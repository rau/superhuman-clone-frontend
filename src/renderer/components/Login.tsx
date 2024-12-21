import { initiateGoogleAuth } from "@/services/googleServices"
import { Button } from "./ui/Button"

export const Login = () => {
	const handleGmailLogin = async () => {
		try {
			await initiateGoogleAuth()
		} catch (err) {
			console.error("Gmail auth failed", err)
		}
	}

	return (
		<div className="flex flex-col gap-4">
			<Button onClick={handleGmailLogin} variant="outline">
				<div className="flex w-16 flex-row items-center gap-2">
					<p>Connect Gmail</p>
				</div>
			</Button>
		</div>
	)
}
