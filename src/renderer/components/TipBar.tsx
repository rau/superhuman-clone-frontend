import { useUIStore } from "@/hooks/useUIStore"
import { X } from "lucide-react"
import { IconButton } from "./ui/IconButton"

const tipItems = [
	{ key: "E", text: "to Mark Done" },
	{ key: "H", text: "to set a reminder" },
	{ key: "C", text: "to compose" },
	{ key: "/", text: "to search" },
]

const tipItemsDiv = tipItems.map((item, index) => (
	<div className="flex items-center gap-1" key={item.key}>
		<kbd className="rounded bg-[#ABB7C5] px-[4px] py-[1px] text-xs font-medium text-white">
			{item.key}
		</kbd>
		<span className="text-xs">{item.text}</span>
		{index < tipItems.length - 1 && <span className="text-xs">&#183;</span>}
	</div>
))

export const TipBar = () => {
	const { isQuickTipsOpen, setIsQuickTipsOpen } = useUIStore()
	if (!isQuickTipsOpen) return null

	return (
		<div className="flex h-[24px] items-center justify-center bg-[#F2F4FA]">
			<div className="flex items-center gap-2">
				<span className="text-xs">Hit</span>
				{tipItemsDiv}
			</div>
			<IconButton
				icon={X}
				onClick={() => setIsQuickTipsOpen(false)}
				className="absolute right-4"
			/>
		</div>
	)
}
