// Components
import Home from "@/pages/Home"
import { Login } from "@/components/Login"

const pagesData: RouterURL[] = [
	{
		path: "",
		element: <Home />,
		title: "home",
	},
	{
		path: "/login",
		element: <Login />,
		title: "login",
	},
]

export { pagesData }
