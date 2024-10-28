// React/Next
import { MemoryRouter as Router, Routes, Route } from "react-router-dom"
// Components
import { ReactQueryClientProvider } from "@/components/ReactQueryClientProvider"
import { SharedLayout } from "@/components/SharedLayout"
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
			<Router>
				<Routes>
					<Route path="/" element={<SharedLayout />}>
						{pageRoutes}
					</Route>
				</Routes>
			</Router>
		</ReactQueryClientProvider>
	)
}
