import { EmailRow } from "@/components/EmailRow"
import { Loader } from "@/components/ui/Loader"
import { useSearchEmails } from "@/hooks/dataHooks"
import { useSearchStore } from "@/hooks/useSearchStore"
import { useUIStore } from "@/hooks/useUIStore"
import { X } from "lucide-react"

const Results = ({ results }: { results: EmailThread[] }) => {
	const { query } = useSearchStore()
	const { isLoading } = useSearchEmails(query)

	if (isLoading) {
		return <Loader />
	}

	if (!query) {
		return (
			<div className="flex flex-1 gap-x-1">
				<span className="text-sm text-slate-500">
					Search even faster with
				</span>
				<span className="text-sm font-semibold text-slate-500">
					in:sent, is:unread, and has:attachment
				</span>
			</div>
		)
	}

	if (results.length === 0) {
		return <div className="text-sm text-slate-500">No results found</div>
	}

	return (
		<div className="flex flex-col gap-1">
			{results.map((email) => (
				<EmailRow key={email.id} email={email} />
			))}
		</div>
	)
}

const Header = () => {
	const { query, setQuery } = useSearchStore()
	const { refetch } = useSearchEmails(query)
	const { setIsSearching } = useUIStore()
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && query) {
			refetch()
		}
	}
	return (
		<div className="flex h-14 items-center justify-between border-b border-slate-200 px-4">
			<div className="flex-1">
				<input
					autoFocus
					type="text"
					placeholder="Search"
					className="w-full bg-transparent text-lg outline-none"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onKeyDown={handleKeyDown}
				/>
			</div>
			<button
				onClick={() => setIsSearching(false)}
				className="rounded p-1 hover:bg-slate-100"
			>
				<X className="h-5 w-5" />
			</button>
		</div>
	)
}

const SearchTips = () => (
	<div className="flex h-full w-1/4 flex-col gap-3 border-l border-slate-200 bg-slate-50 p-4 text-xs shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.05)]">
		<h3 className="pb-4 text-lg font-medium text-slate-900">Tips</h3>
		<div className="flex flex-col gap-2.5">
			<div className="flex">
				<span className="w-48 font-medium">from:nicole</span>
				<span>from Nicole</span>
			</div>
			<div className="flex">
				<span className="w-48 font-medium">to:roman</span>
				<span>to Roman</span>
			</div>
			<div className="flex">
				<span className="w-48 font-medium">"be brilliant"</span>
				<span>contains "be brilliant"</span>
			</div>
			<div className="flex">
				<span className="w-48 font-medium">has:attachment</span>
				<span>with attachments</span>
			</div>
			<div className="flex">
				<span className="w-48 font-medium">subject:lunch</span>
				<span>subject contains "lunch"</span>
			</div>
			<div className="flex">
				<span className="w-48 font-medium">in:sent</span>
				<span>in Sent Mail</span>
			</div>
			<div className="flex">
				<span className="w-48 font-medium">in:inbox</span>
				<span>in the Inbox</span>
			</div>
			<div className="flex">
				<span className="w-48 font-medium">-in:inbox</span>
				<span>not in the Inbox</span>
			</div>
			<div className="flex">
				<span className="w-48 font-medium">in:fundraising</span>
				<span>in this label</span>
			</div>
			<div className="flex">
				<span className="w-48 font-medium">is:unread</span>
				<span>unread conversations</span>
			</div>
			<div className="flex">
				<span className="w-48 font-medium">is:starred</span>
				<span>starred conversations</span>
			</div>
			<div className="flex">
				<span className="w-48 font-medium">before:2017/06/01</span>
				<span>before June 2017</span>
			</div>
			<div className="flex">
				<span className="w-48 font-medium">after:2017/06/01</span>
				<span>June 2017 or later</span>
			</div>
			<div className="flex">
				<span className="w-48 font-medium">older_than:3d</span>
				<span>more than 3 days ago</span>
			</div>
			<div className="flex">
				<span className="w-48 font-medium">newer_than:1m</span>
				<span>1 month ago or later</span>
			</div>
		</div>
	</div>
)

export const SearchPane = () => {
	const { isSearching } = useUIStore()
	const { query } = useSearchStore()
	const { data: results = [] } = useSearchEmails(query)

	if (!isSearching) return null

	return (
		<div className="absolute inset-0 z-50 flex flex-col bg-white">
			<Header />
			<div className="flex flex-1">
				<div className="flex flex-1 p-4">
					<Results results={results} />
				</div>
				<SearchTips />
			</div>
		</div>
	)
}
