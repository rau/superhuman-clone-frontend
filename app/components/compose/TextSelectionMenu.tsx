const TextSelectionMenu = () => {
	return (
		<div className="flex items-center gap-0.5 rounded-lg bg-gray-800 p-1 shadow-lg">
			<button className="rounded p-1.5 text-white hover:bg-gray-700">
				<span className="text-sm font-medium">B</span>
			</button>
			<button className="rounded p-1.5 text-white hover:bg-gray-700">
				<span className="text-sm font-medium italic">I</span>
			</button>
			<button className="rounded p-1.5 text-white hover:bg-gray-700">
				<span className="text-sm font-medium underline">U</span>
			</button>
			<button className="rounded p-1.5 text-white hover:bg-gray-700">
				<span className="text-sm font-medium">K</span>
			</button>
			<button className="rounded p-1.5 text-white hover:bg-gray-700">
				<span className="text-sm font-medium">O</span>
			</button>
			<div className="mx-1 h-4 w-px bg-gray-600" />
			<button className="rounded p-1.5 text-white hover:bg-gray-700">
				<span className="text-sm font-medium">⇧7</span>
			</button>
			<button className="rounded p-1.5 text-white hover:bg-gray-700">
				<span className="text-sm font-medium">⇧8</span>
			</button>
			<button className="rounded p-1.5 text-white hover:bg-gray-700">
				<span className="text-sm font-medium">⇧9</span>
			</button>
			<div className="mx-1 h-4 w-px bg-gray-600" />
			<button className="rounded p-1.5 text-white hover:bg-gray-700">
				<span className="text-sm font-medium">J</span>
			</button>
		</div>
	)
}

export { TextSelectionMenu }
