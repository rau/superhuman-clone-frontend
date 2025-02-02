"use client"

import { ComposePaneOverlay } from "@/components/compose/ComposePaneOverlay"
import { EmailsContainer } from "@/components/EmailsContainer"
import { GlobalDialog } from "@/components/GlobalDialog"
import { SignInPane } from "@/components/SignInPane"
import { TipBar } from "@/components/TipBar"
import { useAccounts } from "@/hooks/dataHooks"
import { useAccountStore } from "@/hooks/useAccountStore"
import { useAppShortcuts } from "@/hooks/useAppShortcuts"
import { useUIStore } from "@/hooks/useUIStore"
import { useEffect } from "react"

const Home = () => {
	const { data: accounts, isLoading } = useAccounts()
	const { setSelectedAccountId } = useAccountStore()
	const { isSignInOpen } = useUIStore()

	useEffect(() => {
		if (accounts && accounts.length > 0) {
			setSelectedAccountId(accounts[0].id)
		}
	}, [accounts])

	useAppShortcuts()

	if (isLoading) {
		return null
	}

	if (accounts?.length === 0 || isSignInOpen) {
		return <SignInPane />
	}

	return (
		<div className="relative flex h-screen flex-col">
			<main className="flex h-full flex-1 flex-col">
				<EmailsContainer />
				<TipBar />
			</main>
			<GlobalDialog />
			<ComposePaneOverlay />
		</div>
	)
}

export default Home
