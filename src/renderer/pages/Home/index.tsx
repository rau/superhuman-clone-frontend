// React/Next
// Components
// Hooks
// Libraries
// Icons
// Types

import { ComposePaneOverlay } from "@/components/ComposePaneOverlay"
import { EmailsContainer } from "@/components/EmailsContainer"
import { FolderSidebar } from "@/components/FolderSidebar"
import { Login } from "@/components/Login"
import { SearchPane } from "@/components/SearchPane"
import { TipBar } from "@/components/TipBar"
import { TooltipProvider } from "@/components/ui/Tooltip"
import { ViewEmailPane } from "@/components/ViewEmailPane"
import { useAuth } from "@/hooks/dataHooks"
import { useUIStore } from "@/hooks/useUIStore"
import { useEffect, useState } from "react"

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

	// console.log("emails", emails)
	// console.log("isComposing", isComposing)
	// console.log("isSearching", isSearching)
	// console.log("isShowingEmail", isShowingEmail)

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (
				e.key === "c" &&
				!isComposing &&
				!isSearching &&
				!isShowingEmail
			) {
				e.preventDefault()
				setIsComposing(true)
			}
			if (
				e.key === "/" &&
				!isSearching &&
				!isComposing &&
				!isShowingEmail
			) {
				e.preventDefault()
				setIsSearching(true)
			}
			if (e.key === "Escape") {
				if (isSearching) {
					e.preventDefault()
					setIsSearching(false)
				}
				if (isComposing) {
					e.preventDefault()
					setIsComposing(false)
				}
				if (isShowingEmail) {
					e.preventDefault()
					setIsShowingEmail(false)
				}
			}
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [isComposing, isSearching, isShowingEmail])

	if (isLoading) {
		return null
	}

	if (tokens?.length === 0) {
		return <Login />
	}
	return (
		<TooltipProvider>
			<div className="relative flex h-screen flex-col">
				<main className="flex flex-1">
					<FolderSidebar />
					<EmailsContainer
						selectedIndex={selectedIndex}
						setSelectedIndex={setSelectedIndex}
					/>
				</main>
				<TipBar />
				{isComposing && <ComposePaneOverlay />}
				{isSearching && <SearchPane />}
				{isShowingEmail && (
					<ViewEmailPane
						emailIndex={selectedIndex}
						setSelectedIndex={setSelectedIndex}
					/>
				)}
			</div>
		</TooltipProvider>
	)
}
