// React/Next
// Components
// Hooks
// Libraries
// Icons
// Types

import { useAuth, useEmails } from "@/hooks/dataHooks"
import { Login } from "@/components/Login"
import { TipBar } from "@/components/TipBar"
import { EmailsContainer } from "@/components/EmailsContainer"

export default function Home() {
	const { data: tokens, isLoading } = useAuth()
	const { data: emails, isLoading: emailsLoading } = useEmails()

	if (isLoading || emailsLoading) {
		return null
	}

	if (tokens?.length === 0) {
		return <Login />
	}

	console.log(emails)

	return (
		<div className="flex h-screen flex-col">
			<main className="flex flex-1">
				<EmailsContainer />
			</main>
			<TipBar />
		</div>
	)
}
