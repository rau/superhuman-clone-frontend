// React/Next
// Components
// Hooks
// Libraries
// Icons
// Types

import { ComposePaneOverlay } from "@/components/ComposePaneOverlay"
import { EmailsContainer } from "@/components/EmailsContainer"
import { Login } from "@/components/Login"
import { SearchPane } from "@/components/SearchPane"
import { TipBar } from "@/components/TipBar"
import { TooltipProvider } from "@/components/ui/Tooltip"
import { ViewEmailPane } from "@/components/ViewEmailPane"
import { useAuth } from "@/hooks/dataHooks"
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts"
import { useUIStore } from "@/hooks/useUIStore"
import { useState } from "react"

export default function Home() {
	const { data: tokens, isLoading } = useAuth()
	const {
		isComposing,
		setIsComposing,
		isSearching,
		setIsSearching,
		isShowingEmail,
		setIsShowingEmail,
	} = useUIStore()
	const [selectedIndex, setSelectedIndex] = useState(0)

	useKeyboardShortcuts([
		{
			key: "c",
			handler: () => setIsComposing(true),
			mode: "global",
		},
		{
			key: "/",
			handler: () => setIsSearching(true),
			mode: "global",
		},
		{
			key: "Escape",
			handler: () => {
				setIsSearching(false)
				setIsComposing(false)
				setIsShowingEmail(false)
			},
			mode: "global",
		},
	])

	if (isLoading) {
		return null
	}

	if (tokens?.length === 0) {
		return <Login />
	}
	return (
		<TooltipProvider>
			<div className="relative flex h-screen flex-col">
				<main className="flex h-full flex-1 flex-col">
					<EmailsContainer
						selectedIndex={selectedIndex}
						setSelectedIndex={setSelectedIndex}
					/>
					<TipBar />
				</main>

				<ComposePaneOverlay />
				<SearchPane />
				<ViewEmailPane
					emailIndex={selectedIndex}
					setSelectedIndex={setSelectedIndex}
				/>
			</div>
		</TooltipProvider>
	)
}
