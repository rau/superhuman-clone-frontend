"use client"

import { EmailsContainer } from "@/components/EmailsContainer"
import { GlobalDialog } from "@/components/GlobalDialog"
import { TipBar } from "@/components/TipBar"
import { useAccounts } from "@/hooks/dataHooks"
import { useAccountStore } from "@/hooks/useAccountStore"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const Home = () => {
	const { data: accounts, isLoading } = useAccounts()
	const { setSelectedAccountId } = useAccountStore()
	const router = useRouter()

	useEffect(() => {
		if (accounts && accounts.length > 0) {
			setSelectedAccountId(accounts[0].id)
		}
	}, [accounts])

	if (isLoading) {
		return null
	}

	if (accounts?.length === 0) {
		router.push("/signin")
		return null
	}

	return (
		<div className="relative flex h-screen flex-col">
			<main className="flex h-full flex-1 flex-col">
				<EmailsContainer />
				<TipBar />
			</main>
			<GlobalDialog />
		</div>
	)
}

export default Home
