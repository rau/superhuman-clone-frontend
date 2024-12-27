// React/Next
import { Route, MemoryRouter as Router, Routes } from "react-router-dom"
// Components
import { ReactQueryClientProvider } from "@/components/ReactQueryClientProvider"
import { SharedLayout } from "@/components/SharedLayout"
import { TooltipProvider } from "@/components/ui/Tooltip"
// Hooks
// Libraries
// Icons
// Types
// Styles
import "./App.css"
// Constants
import { pagesData } from "@/pages/pagesData"

export default function App() {
	const pageRoutes = pagesData.map(({ path, title, element }: RouterURL) => {
		return <Route key={title} path={`/${path}`} element={element} />
	})

	return (
		<ReactQueryClientProvider>
			<TooltipProvider>
				<Router>
					<Routes>
						<Route path="/" element={<SharedLayout />}>
							{pageRoutes}
						</Route>
					</Routes>
				</Router>
			</TooltipProvider>
		</ReactQueryClientProvider>
	)
}
