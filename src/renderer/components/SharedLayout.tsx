// React/Next
import { Outlet, Link } from "react-router-dom"
// Components
// Hooks
// Libraries
// Icons
// Types

const SharedLayout = () => {
	return (
		<div className="flex h-screen w-screen flex-col">
			<div className="flex w-full flex-row gap-2"></div>
			<Outlet />
		</div>
	)
}

export { SharedLayout }
