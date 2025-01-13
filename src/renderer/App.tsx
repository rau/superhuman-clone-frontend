import "@/App.css"
import { ReactQueryClientProvider } from "@/components/ReactQueryClientProvider"
import { SharedLayout } from "@/components/SharedLayout"
import { ThemeProvider } from "@/components/ThemeProvider"
import { TooltipProvider } from "@/components/ui/Tooltip"
import { pagesData } from "@/pages/pagesData"
import { Route, MemoryRouter as Router, Routes } from "react-router-dom"
import { ToastContainer } from "react-toastify"

export default function App() {
	const pageRoutes = pagesData.map(({ path, title, element }: RouterURL) => {
		return <Route key={title} path={`/${path}`} element={element} />
	})

	return (
		<ReactQueryClientProvider>
			<ThemeProvider>
				<TooltipProvider>
					<ToastContainer />
					<Router>
						<Routes>
							<Route path="/" element={<SharedLayout />}>
								{pageRoutes}
							</Route>
						</Routes>
					</Router>
				</TooltipProvider>
			</ThemeProvider>
		</ReactQueryClientProvider>
	)
}
