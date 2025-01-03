import { useUIStore } from "@/hooks/useUIStore"
import { cn } from "@/libs/utils"
import { X } from "lucide-react"
import { useState } from "react"

type KeyType = "letter" | "symbol" | "meta" | "special"

interface ShortcutKey {
	key: string
	type: KeyType
}

interface ShortcutItemProps {
	label: string
	keys: ShortcutKey[]
}

const SearchBar = ({
	search,
	setSearch,
}: {
	search: string
	setSearch: (search: string) => void
}) => {
	const { setIsShortcutsPaneOpen } = useUIStore()

	return (
		<div className="flex h-fit items-center justify-between border-l border-blue-200 p-6 shadow-inner">
			<input
				autoFocus
				type="text"
				placeholder="Search"
				className="w-full bg-transparent text-sm outline-none"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>
			<button
				onClick={() => setIsShortcutsPaneOpen(false)}
				className="rounded p-1 hover:bg-slate-100"
			>
				<X className="h-4 w-4" />
			</button>
		</div>
	)
}

const ShortcutItem = ({
	label,
	keys,
	searchTerm,
}: ShortcutItemProps & { searchTerm: string }) => {
	const getKeyStyle = (type: KeyType) => {
		switch (type) {
			case "meta":
				return "bg-slate-200"
			case "special":
				return "bg-slate-200 px-2"
			case "symbol":
				return "bg-slate-200"
			default:
				return "bg-slate-200 uppercase"
		}
	}

	const isHighlighted =
		searchTerm && label.toLowerCase().includes(searchTerm.toLowerCase())

	return (
		<div
			className={cn(
				"flex items-center justify-between rounded px-2 py-1",
				isHighlighted && "bg-blue-50"
			)}
		>
			<span className="text-xs text-slate-600">{label}</span>
			<div className="flex w-32 items-center justify-start gap-1">
				{keys.map((k, i) => (
					<>
						{i > 0 && label.startsWith("Go to") && (
							<span className="text-xs text-slate-400">then</span>
						)}
						<span
							key={i}
							className={cn(
								"min-w-[24px] rounded px-1.5 py-0.5 text-center text-xs font-medium text-slate-600",
								getKeyStyle(k.type)
							)}
						>
							{k.key}
						</span>
					</>
				))}
			</div>
		</div>
	)
}

interface ShortcutSection {
	title: string
	shortcuts: {
		label: string
		keys: ShortcutKey[]
	}[]
}

const SHORTCUT_SECTIONS: ShortcutSection[] = [
	{
		title: "Actions",
		shortcuts: [
			{
				label: "Superhuman Command",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "k", type: "letter" },
				],
			},
			{
				label: "Search",
				keys: [{ key: "/", type: "symbol" }],
			},
			{
				label: "Undo",
				keys: [{ key: "z", type: "letter" }],
			},
			{
				label: "Shortcuts",
				keys: [{ key: "?", type: "symbol" }],
			},
		],
	},
	{
		title: "Navigation",
		shortcuts: [
			{
				label: "Next / Previous Conversation",
				keys: [
					{ key: "j", type: "letter" },
					{ key: "k", type: "letter" },
				],
			},
			{
				label: "Next / Previous Message",
				keys: [
					{ key: "n", type: "letter" },
					{ key: "p", type: "letter" },
				],
			},
			{
				label: "Open",
				keys: [{ key: "enter", type: "special" }],
			},
			{
				label: "Back",
				keys: [{ key: "esc", type: "special" }],
			},
			{
				label: "Next Split Inbox",
				keys: [{ key: "tab", type: "special" }],
			},
			{
				label: "Previous Split Inbox",
				keys: [
					{ key: "shift", type: "special" },
					{ key: "tab", type: "special" },
				],
			},
			{
				label: "Page Down",
				keys: [{ key: "space", type: "special" }],
			},
			{
				label: "Page Up",
				keys: [
					{ key: "shift", type: "special" },
					{ key: "space", type: "special" },
				],
			},
			{
				label: "Jump to Top",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "↑", type: "special" },
				],
			},
			{
				label: "Jump to Bottom",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "↓", type: "special" },
				],
			},
			{
				label: "Switch Accounts",
				keys: [
					{ key: "control", type: "special" },
					{ key: "1-9", type: "special" },
				],
			},
			{
				label: "Superhuman Focus",
				keys: [
					{ key: "→", type: "special" },
					{ key: "←", type: "special" },
					{ key: "↓", type: "special" },
					{ key: "��", type: "special" },
				],
			},
		],
	},
	{
		title: "Conversations",
		shortcuts: [
			{
				label: "Mark Done (Archive)",
				keys: [{ key: "E", type: "special" }],
			},
			{
				label: "Mark not Done",
				keys: [
					{ key: "shift", type: "special" },
					{ key: "E", type: "special" },
				],
			},
			{
				label: "Remind Me (Snooze)",
				keys: [{ key: "H", type: "special" }],
			},
			{
				label: "Star",
				keys: [{ key: "S", type: "special" }],
			},
			{
				label: "Mark Read or Unread",
				keys: [{ key: "U", type: "special" }],
			},
			{
				label: "Summarize",
				keys: [{ key: "I", type: "special" }],
			},
			{
				label: "Mute",
				keys: [
					{ key: "shift", type: "special" },
					{ key: "M", type: "special" },
				],
			},
			{
				label: "Trash",
				keys: [{ key: "#", type: "special" }],
			},
			{
				label: "Mark as Spam",
				keys: [{ key: "!", type: "special" }],
			},
			{
				label: "Unsubscribe",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "U", type: "special" },
				],
			},
			{
				label: "Print",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "P", type: "special" },
				],
			},
			{
				label: "Select Conversation",
				keys: [{ key: "X", type: "special" }],
			},
			{
				label: "Clear Selection",
				keys: [{ key: "esc", type: "special" }],
			},
			{
				label: "Select All From Here",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "A", type: "special" },
				],
			},
			{
				label: "Select All",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "shift", type: "special" },
					{ key: "A", type: "special" },
				],
			},
			{
				label: "Share Conversation",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "S", type: "special" },
				],
			},
			{
				label: "Comment",
				keys: [{ key: "M", type: "special" }],
			},
			{
				label: "Delete Comment",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "delete", type: "special" },
				],
			},
		],
	},
	{
		title: "Labels",
		shortcuts: [
			{
				label: "Move",
				keys: [{ key: "V", type: "special" }],
			},
			{
				label: "Add or Remove Label",
				keys: [{ key: "L", type: "special" }],
			},
			{
				label: "Remove Label",
				keys: [{ key: "Y", type: "special" }],
			},
			{
				label: "Remove Label, Next",
				keys: [{ key: "I", type: "special" }],
			},
			{
				label: "Remove Label, Previous",
				keys: [{ key: "U", type: "special" }],
			},
			{
				label: "Remove All Labels",
				keys: [
					{ key: "shift", type: "special" },
					{ key: "Y", type: "special" },
				],
			},
		],
	},
	{
		title: "Messages",
		shortcuts: [
			{
				label: "Compose",
				keys: [{ key: "C", type: "special" }],
			},
			{
				label: "Reply All",
				keys: [{ key: "enter", type: "special" }],
			},
			{
				label: "Reply",
				keys: [{ key: "R", type: "special" }],
			},
			{
				label: "Forward",
				keys: [{ key: "F", type: "special" }],
			},
			{
				label: "Open Links & Attachments",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "O", type: "special" },
				],
			},
			{
				label: "Cycle Through Links",
				keys: [{ key: "tab", type: "special" }],
			},
			{
				label: "Expand Message",
				keys: [{ key: "O", type: "special" }],
			},
			{
				label: "Expand All Messages",
				keys: [
					{ key: "shift", type: "special" },
					{ key: "O", type: "special" },
				],
			},
			{
				label: "Show New Messages",
				keys: [
					{ key: "shift", type: "special" },
					{ key: "N", type: "special" },
				],
			},
			{
				label: "Use Snippet",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "?", type: "special" },
				],
			},
		],
	},
	{
		title: "Compose",
		shortcuts: [
			{
				label: "To",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "shift", type: "special" },
					{ key: "O", type: "special" },
				],
			},
			{
				label: "Cc",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "shift", type: "special" },
					{ key: "C", type: "special" },
				],
			},
			{
				label: "Bcc",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "shift", type: "special" },
					{ key: "B", type: "special" },
				],
			},
			{
				label: "From",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "shift", type: "special" },
					{ key: "F", type: "special" },
				],
			},
			{
				label: "Edit Subject",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "shift", type: "special" },
					{ key: "S", type: "special" },
				],
			},
			{
				label: "Superhuman AI",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "J", type: "special" },
				],
			},
			{
				label: "Attach",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "shift", type: "special" },
					{ key: "A", type: "special" },
				],
			},
			{
				label: "Discard Draft",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "shift", type: "special" },
					{ key: "D", type: "special" },
				],
			},
			{
				label: "Instant Intro",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "shift", type: "special" },
					{ key: "I", type: "special" },
				],
			},
			{
				label: "Remind Me",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "shift", type: "special" },
					{ key: "R", type: "special" },
				],
			},
			{
				label: "Send Later",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "shift", type: "special" },
					{ key: "L", type: "special" },
				],
			},
			{
				label: "Use Snippet Inline",
				keys: [{ key: "?", type: "symbol" }],
			},
			{
				label: "Insert Emoji",
				keys: [{ key: ":", type: "symbol" }],
			},
			{
				label: "Send",
				keys: [{ key: "enter", type: "special" }],
			},
			{
				label: "Send Instantly",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "shift", type: "special" },
					{ key: "Z", type: "special" },
				],
			},
			{
				label: "Send + Mark Done",
				keys: [{ key: "⌘", type: "meta" }],
			},
		],
	},
	{
		title: "Format",
		shortcuts: [
			{
				label: "Bold",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "B", type: "letter" },
				],
			},
			{
				label: "Italics",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "I", type: "letter" },
				],
			},
			{
				label: "Underline",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "U", type: "letter" },
				],
			},
			{
				label: "Hyperlink",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "K", type: "letter" },
				],
			},
			{
				label: "Color",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "O", type: "letter" },
				],
			},
			{
				label: "Strikethrough",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "shift", type: "special" },
					{ key: "X", type: "letter" },
				],
			},
			{
				label: "Numbers",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "shift", type: "special" },
					{ key: "7", type: "special" },
				],
			},
			{
				label: "Bullets",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "shift", type: "special" },
					{ key: "8", type: "special" },
				],
			},
			{
				label: "Quote",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "shift", type: "special" },
					{ key: "9", type: "special" },
				],
			},
			{
				label: "Indent List",
				keys: [{ key: "tab", type: "special" }],
			},
			{
				label: "Outdent List",
				keys: [
					{ key: "shift", type: "special" },
					{ key: "tab", type: "special" },
				],
			},
			{
				label: "Increase Indent",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "]", type: "symbol" },
				],
			},
			{
				label: "Decrease Indent",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "[", type: "symbol" },
				],
			},
		],
	},
	{
		title: "Folders",
		shortcuts: [
			{
				label: "Go to Inbox",
				keys: [
					{ key: "g", type: "letter" },
					{ key: "i", type: "letter" },
				],
			},
			{
				label: "Go to Important",
				keys: [
					{ key: "g", type: "letter" },
					{ key: "i", type: "letter" },
				],
			},
			{
				label: "Go to Other",
				keys: [
					{ key: "g", type: "letter" },
					{ key: "o", type: "letter" },
				],
			},
			{
				label: "Go to Starred",
				keys: [
					{ key: "g", type: "letter" },
					{ key: "s", type: "letter" },
				],
			},
			{
				label: "Go to Drafts",
				keys: [
					{ key: "g", type: "letter" },
					{ key: "d", type: "letter" },
				],
			},
			{
				label: "Go to Sent",
				keys: [
					{ key: "g", type: "letter" },
					{ key: "t", type: "letter" },
				],
			},
			{
				label: "Go to Done",
				keys: [
					{ key: "g", type: "letter" },
					{ key: "e", type: "letter" },
				],
			},
			{
				label: "Go to Reminders",
				keys: [
					{ key: "g", type: "letter" },
					{ key: "h", type: "letter" },
				],
			},
			{
				label: "Go to Muted",
				keys: [
					{ key: "g", type: "letter" },
					{ key: "m", type: "letter" },
				],
			},
			{
				label: "Go to Snippets",
				keys: [
					{ key: "g", type: "letter" },
					{ key: ";", type: "symbol" },
				],
			},
			{
				label: "Go to Spam",
				keys: [
					{ key: "g", type: "letter" },
					{ key: "!", type: "symbol" },
				],
			},
			{
				label: "Go to Trash",
				keys: [
					{ key: "g", type: "letter" },
					{ key: "#", type: "symbol" },
				],
			},
			{
				label: "Go to All Mail",
				keys: [
					{ key: "g", type: "letter" },
					{ key: "a", type: "letter" },
				],
			},
			{
				label: "Go to Label",
				keys: [
					{ key: "g", type: "letter" },
					{ key: "l", type: "letter" },
				],
			},
		],
	},
	{
		title: "Windows",
		shortcuts: [
			{
				label: "New Tab",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "t", type: "letter" },
				],
			},
			{
				label: "Next Tab",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "shift", type: "special" },
					{ key: "}", type: "symbol" },
				],
			},
			{
				label: "Previous Tab",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "shift", type: "special" },
					{ key: "{", type: "symbol" },
				],
			},
			{
				label: "Close Tab",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "w", type: "letter" },
				],
			},
			{
				label: "Increase Font Size",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "+", type: "symbol" },
				],
			},
			{
				label: "Decrease Font Size",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "-", type: "symbol" },
				],
			},
			{
				label: "Reset Font Size",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "0", type: "special" },
				],
			},
			{
				label: "Find Within Page",
				keys: [
					{ key: "⌘", type: "meta" },
					{ key: "f", type: "letter" },
				],
			},
			{
				label: "Copy Private Link",
				keys: [
					{ key: "control", type: "special" },
					{ key: "l", type: "letter" },
				],
			},
		],
	},
	{
		title: "Calendar",
		shortcuts: [
			{
				label: "Open Day",
				keys: [{ key: "d", type: "letter" }],
			},
			{
				label: "Open Week",
				keys: [
					{ key: "then", type: "special" },
					{ key: "w", type: "letter" },
				],
			},
			{
				label: "Previous Day/Week",
				keys: [{ key: "-", type: "symbol" }],
			},
			{
				label: "Next Day/Week",
				keys: [{ key: "+", type: "symbol" }],
			},
			{
				label: "Share Availability",
				keys: [
					{ key: "shift", type: "special" },
					{ key: "a", type: "letter" },
				],
			},
			{
				label: "Create Event",
				keys: [{ key: "c", type: "letter" }],
			},
			{
				label: "Create Empty Event",
				keys: [
					{ key: "shift", type: "special" },
					{ key: "e", type: "letter" },
				],
			},
		],
	},
	{
		title: "Filters",
		shortcuts: [
			{
				label: "Unread",
				keys: [
					{ key: "shift", type: "special" },
					{ key: "u", type: "letter" },
				],
			},
			{
				label: "Starred",
				keys: [
					{ key: "shift", type: "special" },
					{ key: "s", type: "letter" },
				],
			},
			{
				label: "Important",
				keys: [
					{ key: "shift", type: "special" },
					{ key: "i", type: "letter" },
				],
			},
		],
	},
]

export const ShortcutsPane = () => {
	const [search, setSearch] = useState("")
	const { selectedThreads, selectedFolder } = useUIStore()

	const hasSelectedThreads =
		selectedThreads[selectedFolder?.id || "INBOX"]?.size > 0

	const filteredSections = SHORTCUT_SECTIONS.filter((section) => {
		if (hasSelectedThreads) {
			return ["Navigation", "Actions"].includes(section.title)
		}
		return true
	})
		.map((section) => ({
			...section,
			shortcuts: section.shortcuts.filter((shortcut) =>
				shortcut.label.toLowerCase().includes(search.toLowerCase())
			),
		}))
		.filter((section) => section.shortcuts.length > 0)

	return (
		<div className="fixed right-0 top-0 z-50 flex h-screen w-[400px] flex-col bg-white">
			<SearchBar search={search} setSearch={setSearch} />
			<div className="flex-1 overflow-y-auto">
				<div className="flex flex-col gap-4 p-6">
					{filteredSections.map((section) => (
						<div key={section.title}>
							<h2 className="mb-2 text-xs font-bold">
								{section.title}
							</h2>
							<div className="flex flex-col gap-1">
								{section.shortcuts.map((shortcut) => (
									<ShortcutItem
										key={shortcut.label}
										label={shortcut.label}
										keys={shortcut.keys}
										searchTerm={search}
									/>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
